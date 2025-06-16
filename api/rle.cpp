#include <bits/stdc++.h>
#include <atomic>
#include <chrono>
#include <fstream>
#include <iostream>
#include <mutex>
#include <thread>
#include <vector>
#include <deque>
#include <sstream>
#include <unistd.h> // For memory usage on Linux

using namespace std;
using namespace chrono;

// Constants for Dynamic Chunk Size Adjustment
const size_t MIN_CHUNK_SIZE = 64 * 1024;        // 64 KB
const size_t MAX_CHUNK_SIZE = 10 * 1024 * 1024; // 10 MB
const size_t SPEED_HISTORY_SIZE = 5;            // Moving average history size

// Structure to store the result of each compressed chunk.
struct ChunkResult {
    size_t index;       // Order in which the chunk was processed.
    string data;        // Compressed data.
};

// Global variables for adaptive chunking and results collection
atomic<size_t> globalOffset(0);   // Next byte to process.
atomic<size_t> chunkCounter(0);   // To assign a sequential index to each chunk.
mutex resultMutex;                // Protects access to 'results'.
vector<ChunkResult> results;      // Holds compressed chunks.

mutex feedbackMutex;   // Protects the feedback data.

struct ThreadSpeedData {
    deque<double> speedHistory; // For moving average
    size_t chunkSize;           // Current chunk size for the thread
};

vector<ThreadSpeedData> threadData; // Holds speed history and chunk size for each thread
atomic<size_t> baseChunkSize(1024 * 1024); // Start with 1MB chunk size

// Run-Length Encoding (RLE) function
string compressRLE(const vector<char>& data, size_t start, size_t length) {
    if (length == 0) return "";
    string compressed;
    char current = data[start];
    int count = 1;
    for (size_t i = start + 1; i < start + length; ++i) {
        if (data[i] == current) {
            ++count;
        } else {
            compressed += to_string(count) + current;
            current = data[i];
            count = 1;
        }
    }
    compressed += to_string(count) + current;
    return compressed;
}

// Moving Average for Speed Smoothing
double calculateMovingAverage(const deque<double>& speeds) {
    if (speeds.empty()) return 1.0;  // Default speed if history is empty
    double sum = accumulate(speeds.begin(), speeds.end(), 0.0);
    return sum / speeds.size();
}

// Dynamic Chunk Size Adjustment Based on Feedback
void adjustChunkSize(ThreadSpeedData &data, double currentSpeed) {
    double avgSpeed = calculateMovingAverage(data.speedHistory);

    if (currentSpeed > avgSpeed * 1.2) {  // Speed significantly higher
        data.chunkSize = min(data.chunkSize * 1.2, (double)MAX_CHUNK_SIZE);
    } else if (currentSpeed < avgSpeed * 0.8) {  // Speed significantly lower
        data.chunkSize = max(data.chunkSize * 0.8, (double)MIN_CHUNK_SIZE);
    }

    // Update speed history
    data.speedHistory.push_back(currentSpeed);
    if (data.speedHistory.size() > SPEED_HISTORY_SIZE)
        data.speedHistory.pop_front();
}

// Worker function with feedback-based load balancing
void worker(const vector<char>& fileData, size_t fileSize, size_t threadID, size_t numThreads) {
    ThreadSpeedData &data = threadData[threadID];

    while (true) {
        size_t currentOffset = globalOffset.load();
        if (currentOffset >= fileSize) break;

        size_t chunkSize = data.chunkSize > 0 ? data.chunkSize : baseChunkSize.load();
        size_t start = globalOffset.fetch_add(chunkSize);
        if (start >= fileSize) break;
        size_t length = min(chunkSize, fileSize - start);

        auto startTime = high_resolution_clock::now();
        string compressedChunk = compressRLE(fileData, start, length);
        auto endTime = high_resolution_clock::now();

        chrono::duration<double> elapsed = endTime - startTime;
        double currentSpeed = 1.0 / (elapsed.count() + 1e-6); // Avoid division by zero

        // Adjust chunk size based on performance
        {
            lock_guard<mutex> lock(feedbackMutex);
            adjustChunkSize(data, currentSpeed);
        }

        // Store result
        size_t idx = chunkCounter.fetch_add(1);
        {
            lock_guard<mutex> lock(resultMutex);
            results.push_back({idx, compressedChunk});
        }
    }
}

// CPU usage monitoring
double getCpuUsage() {
    ifstream file("/proc/stat");
    string line;
    getline(file, line);
    istringstream ss(line);
    string cpu;
    long user, nice, system, idle;
    ss >> cpu >> user >> nice >> system >> idle;
    static long prevIdle = 0, prevTotal = 0;
    long total = user + nice + system + idle;
    double cpuUsage = 0.0;
    if (prevTotal != 0) {
        long totalDiff = total - prevTotal;
        long idleDiff = idle - prevIdle;
        cpuUsage = (double)(totalDiff - idleDiff) / totalDiff * 100.0;
    }
    prevIdle = idle;
    prevTotal = total;
    return cpuUsage;
}

// Memory usage monitoring
size_t getMemoryUsage() {
    ifstream file("/proc/self/status");
    string line;
    size_t vmRSS = 0;
    while (getline(file, line)) {
        if (line.find("VmRSS:") == 0) {
            istringstream iss(line);
            string key;
            size_t value;
            string unit;
            iss >> key >> value >> unit;
            vmRSS = value; // in kB
            break;
        }
    }
    return vmRSS;
}

int main() {
    string inputFilename, outputFilename;
    cout << "Enter input file name: ";
    cin >> inputFilename;
    cout << "Enter output file name: ";
    cin >> outputFilename;
    cout << endl;

    // Performance Metrics
    auto startTime = high_resolution_clock::now();
    cout << "CPU Usage Before: " << getCpuUsage() << "%" << endl;
    cout << "Memory Usage Before: " << getMemoryUsage() / 1024.0 << " MB" << endl;

    size_t numThreads = thread::hardware_concurrency();
    ifstream inFile(inputFilename, ios::binary);
    if (!inFile) {
        cerr << "Error opening input file.\n";
        return 1;
    }
    vector<char> fileData((istreambuf_iterator<char>(inFile)), istreambuf_iterator<char>());
    inFile.close();
    size_t fileSize = fileData.size();

    // Initialize thread data
    threadData.resize(numThreads);
    for (auto &data : threadData) {
        data.chunkSize = baseChunkSize.load();
    }

    // Launch worker threads
    vector<thread> threads;
    for (size_t i = 0; i < numThreads; ++i) {
        threads.emplace_back(worker, cref(fileData), fileSize, i, numThreads);
    }
    for (auto &t : threads) {
        t.join();
    }

    // Sort results to maintain order
    sort(results.begin(), results.end(), [](const ChunkResult &a, const ChunkResult &b) {
        return a.index < b.index;
    });

    // Merge all compressed chunks
    string finalCompressed;
    for (const auto &chunk : results) {
        finalCompressed += chunk.data;
    }

    // Write to output file
    ofstream outFile(outputFilename, ios::binary);
    if (!outFile) {
        cerr << "Error opening output file.\n";
        return 1;
    }
    outFile.write(finalCompressed.data(), finalCompressed.size());
    outFile.close();

    auto endTime = high_resolution_clock::now();
    duration<double> execTime = endTime - startTime;

    // Performance Metrics After Processing
    cout << "CPU Usage After: " << getCpuUsage() << "%" << endl;
    cout << "Total Execution Time: " << execTime.count() << " seconds" << endl;
    cout << "Compression completed. Output written to " << outputFilename << "\n";
    return 0;
}