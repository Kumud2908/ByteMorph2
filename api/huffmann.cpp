#include <bits/stdc++.h>
#include <atomic>
#include <chrono>
#include <fstream>
#include <iostream>
#include <mutex>
#include <thread>
#include <vector>
#include <deque>
#include <unistd.h>

using namespace std;

// Constants for chunk size management
const size_t MIN_CHUNK_SIZE = 64 * 1024;       // Minimum chunk size (64KB)
const size_t MAX_CHUNK_SIZE = 10 * 1024 * 1024; // Maximum chunk size (10MB)
const size_t SPEED_HISTORY_SIZE = 5;            // Number of speed measurements to keep for averaging

// Structure to store compressed chunk results
struct ChunkResult
{
    size_t index;    // Chunk sequence number
    string data;     // Compressed data
};

// Global variables for parallel processing
atomic<size_t> globalOffset(0);       // Current file offset for chunk allocation
atomic<size_t> chunkCounter(0);       // Counter for assigning chunk sequence numbers
mutex resultMutex;                   // Mutex for protecting results vector
vector<ChunkResult> results;         // Vector to store compressed chunks
mutex feedbackMutex;                 // Mutex for thread feedback data

// Structure for thread performance tracking
struct ThreadSpeedData
{
    deque<double> speedHistory;  // History of processing speeds
    size_t chunkSize;            // Current chunk size for this thread
};

vector<ThreadSpeedData> threadData;          // Performance data for each thread
atomic<size_t> baseChunkSize(1024 * 1024);   // Initial chunk size (1MB)

// Function to get current CPU usage
double getCpuUsage()
{
    // Read CPU stats from /proc/stat
    ifstream file("/proc/stat");
    string line;
    getline(file, line);
    istringstream ss(line);
    string cpu;
    long user, nice, system, idle;
    ss >> cpu >> user >> nice >> system >> idle;

    // Static variables to store previous values
    static long prevIdle = 0, prevTotal = 0;
    long total = user + nice + system + idle;
    double cpuUsage = 0.0;
    
    // Calculate CPU usage percentage
    if (prevTotal != 0)
    {
        long totalDiff = total - prevTotal;
        long idleDiff = idle - prevIdle;
        cpuUsage = (double)(totalDiff - idleDiff) / totalDiff * 100.0;
    }
    prevIdle = idle;
    prevTotal = total;
    return cpuUsage;
}

// Huffman Encoding Node structure
struct HuffmanNode
{
    char ch;            // Character
    int freq;           // Frequency of character
    HuffmanNode *left;  // Left child
    HuffmanNode *right; // Right child
    
    // Constructor for leaf node
    HuffmanNode(char ch, int freq) : ch(ch), freq(freq), left(nullptr), right(nullptr) {}
    // Constructor for internal node
    HuffmanNode(HuffmanNode *left, HuffmanNode *right) : ch('\0'), freq(left->freq + right->freq), left(left), right(right) {}
};

// Comparison function for priority queue
struct CompareNode
{
    bool operator()(HuffmanNode *l, HuffmanNode *r)
    {
        return l->freq > r->freq;
    }
};

// Recursive function to build Huffman code table
void buildCodeTable(HuffmanNode *root, const string &code, unordered_map<char, string> &codeTable)
{
    if (!root)
        return;
    // If leaf node, store the code
    if (!root->left && !root->right)
    {
        codeTable[root->ch] = code;
    }
    // Traverse left and right children
    buildCodeTable(root->left, code + "0", codeTable);
    buildCodeTable(root->right, code + "1", codeTable);
}

// Function to free Huffman tree memory
void freeHuffmanTree(HuffmanNode *root)
{
    if (!root)
        return;
    freeHuffmanTree(root->left);
    freeHuffmanTree(root->right);
    delete root;
}

// Global Huffman code table
unordered_map<char, string> globalCodeTable;

// Function to build global Huffman tree from file data
void buildGlobalHuffmanTree(const vector<char> &fileData, size_t fileSize)
{
    // Calculate character frequencies
    unordered_map<char, int> globalFreq;
    for (size_t i = 0; i < fileSize; ++i)
    {
        globalFreq[fileData[i]]++;
    }

    // Create priority queue for Huffman tree construction
    priority_queue<HuffmanNode *, vector<HuffmanNode *>, CompareNode> pq;
    for (auto &pair : globalFreq)
    {
        pq.push(new HuffmanNode(pair.first, pair.second));
    }

    // Build Huffman tree
    while (pq.size() > 1)
    {
        HuffmanNode *left = pq.top();
        pq.pop();
        HuffmanNode *right = pq.top();
        pq.pop();
        pq.push(new HuffmanNode(left, right));
    }

    // Build code table from Huffman tree
    HuffmanNode *root = pq.top();
    buildCodeTable(root, "", globalCodeTable);
    freeHuffmanTree(root);
}

// Function to compress data using global Huffman codes
string compressWithGlobalCode(const vector<char> &data, size_t start, size_t length)
{
    string encodedData;
    // Encode each character in the chunk
    for (size_t i = start; i < start + length; ++i)
    {
        encodedData += globalCodeTable.at(data[i]);
    }
    return encodedData;
}

// Function to calculate moving average of processing speeds
double calculateMovingAverage(const deque<double> &speeds)
{
    if (speeds.empty())
        return 1.0;
    double sum = accumulate(speeds.begin(), speeds.end(), 0.0);
    return sum / speeds.size();
}

// Function to dynamically adjust chunk size based on performance
void adjustChunkSize(ThreadSpeedData &data, double currentSpeed)
{
    double avgSpeed = calculateMovingAverage(data.speedHistory);
    // Increase chunk size if speed is significantly higher than average
    if (currentSpeed > avgSpeed * 1.2)
    {
        data.chunkSize = min((size_t)(data.chunkSize * 1.2), MAX_CHUNK_SIZE);
    }
    // Decrease chunk size if speed is significantly lower than average
    else if (currentSpeed < avgSpeed * 0.8)
    {
        data.chunkSize = max((size_t)(data.chunkSize * 0.8), MIN_CHUNK_SIZE);
    }
    // Update speed history
    data.speedHistory.push_back(currentSpeed);
    if (data.speedHistory.size() > SPEED_HISTORY_SIZE)
        data.speedHistory.pop_front();
}

// Worker thread function
void worker(const vector<char> &fileData, size_t fileSize, size_t threadID)
{
    ThreadSpeedData &data = threadData[threadID];
    while (true)
    {
        // Get current offset and check if we've processed the entire file
        size_t currentOffset = globalOffset.load();
        if (currentOffset >= fileSize)
            break;

        // Determine chunk size for this thread
        size_t chunkSize = data.chunkSize > 0 ? data.chunkSize : baseChunkSize.load();
        size_t start = globalOffset.fetch_add(chunkSize);
        if (start >= fileSize)
            break;
        size_t length = min(chunkSize, fileSize - start);

        // Measure compression time
        auto startTime = chrono::high_resolution_clock::now();
        string compressedChunk = compressWithGlobalCode(fileData, start, length);
        auto endTime = chrono::high_resolution_clock::now();

        // Calculate processing speed
        chrono::duration<double> elapsed = endTime - startTime;
        double currentSpeed = 1.0 / (elapsed.count() + 1e-6);

        // Adjust chunk size based on performance
        {
            lock_guard<mutex> lock(feedbackMutex);
            adjustChunkSize(data, currentSpeed);
        }

        // Store compressed chunk
        size_t idx = chunkCounter.fetch_add(1);
        {
            lock_guard<mutex> lock(resultMutex);
            results.push_back({idx, compressedChunk});
        }
    }
}

// Main function
int main()
{
    // Get input and output filenames
    string inputFilename, outputFilename;
    cout << "Enter input file name: ";
    cin >> inputFilename;
    cout << "Enter output file name: ";
    cin >> outputFilename;
    cout << endl;

    // Start performance measurement
    auto startTime = chrono::high_resolution_clock::now();
    double cpuBefore = getCpuUsage();

    // Determine number of threads to use
    size_t numThreads = thread::hardware_concurrency();
    
    // Read input file
    ifstream inFile(inputFilename, ios::binary);
    if (!inFile)
    {
        cerr << "Error opening input file.\n";
        return 1;
    }
    vector<char> fileData((istreambuf_iterator<char>(inFile)), istreambuf_iterator<char>());
    inFile.close();
    size_t fileSize = fileData.size();

    // Build global Huffman tree
    buildGlobalHuffmanTree(fileData, fileSize);

    // Initialize thread data
    threadData.resize(numThreads);
    for (auto &data : threadData)
    {
        data.chunkSize = baseChunkSize.load();
    }

    // Create and launch worker threads
    vector<thread> threads;
    for (size_t i = 0; i < numThreads; ++i)
    {
        threads.emplace_back(worker, cref(fileData), fileSize, i);
    }
    
    // Wait for all threads to complete
    for (auto &t : threads)
    {
        t.join();
    }

    // Sort results by chunk index
    sort(results.begin(), results.end(), [](const ChunkResult &a, const ChunkResult &b)
         { return a.index < b.index; });

    // Combine all compressed chunks
    string finalCompressed;
    for (const auto &chunk : results)
    {
        finalCompressed += chunk.data;
    }

    // Serialize Huffman codes for the header
    stringstream freqStream;
    for (const auto &pair : globalCodeTable)
    {
        freqStream << pair.first << ":" << pair.second << "\n";
    }
    string freqData = freqStream.str();

    // Write compressed data to output file
    ofstream outFile(outputFilename, ios::binary);
    if (!outFile)
    {
        cerr << "Error opening output file.\n";
        return 1;
    }

    // Write header (Huffman codes) followed by compressed data
    outFile.write(freqData.data(), freqData.size());
    outFile.write(finalCompressed.data(), finalCompressed.size());
    outFile.close();

    // Calculate and display performance metrics
    auto endTime = chrono::high_resolution_clock::now();
    double cpuAfter = getCpuUsage();
    chrono::duration<double> execTime = endTime - startTime;

    cout << "----------------------------\n";
    cout << "CPU Usage Before: " << cpuBefore << "%\n";
    cout << "CPU Usage After: " << cpuAfter << "%\n";
    cout << "Total Execution Time: " << execTime.count() << " seconds\n";
    cout << "----------------------------\n";

    return 0;
}