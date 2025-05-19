import axios from 'axios';
import fs from 'fs-extra';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { promisify } from 'util';
import File from '../models/file.models.js';
import { uploadBufferToCloudinary } from '../utils/cloudinaryUpload.js';

const execAsync = promisify(exec);

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const compressAndUpload = async (req, res) => {
  const { fileUrl, method } = req.body;
  console.log("REcieved req",req.body);

  

  if (!fileUrl || !method) {
    return res.status(400).json({ error: 'Both fileUrl and method are required (method should be "rle" or "huffman")' });
  }

  if (!['rle', 'huffmann'].includes(method.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid compression method. Use "rle" or "huffman".' });
  }

  try {
    const timestamp = Date.now();
    const inputPath = path.join(__dirname, '..', 'uploads', `input-${timestamp}.txt`);
    const outputPath = path.join(__dirname, '..', 'compressed', `output-${timestamp}.txt`);

    // Download file
    const response = await axios.get(fileUrl, { responseType: 'stream' });
    await fs.ensureDir(path.dirname(inputPath));
    const writer = fs.createWriteStream(inputPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Compress using binary
    const binaryName = method.toLowerCase() === 'rle' ? 'rle' : 'huffmann';
    const binaryPath = path.join(__dirname, '..', binaryName); // assuming compiled binaries are named 'rle' and 'huffman'

    const cmd = `${binaryPath} ${inputPath} ${outputPath}`;
    console.log("Running CMD:", cmd);
    await execAsync(cmd);

    // Upload compressed file buffer
    const compressedBuffer = await fs.readFile(outputPath);
    const cloudinaryResult = await uploadBufferToCloudinary(compressedBuffer, { resource_type: 'raw' });

    // Save metadata
    const savedFile = new File({
      fileName: `compressed-${timestamp}.txt`,
      fileUrl: cloudinaryResult.secure_url,
      fileType: 'text/plain',
    });

    await savedFile.save();

    // Cleanup
    await fs.remove(inputPath);
    await fs.remove(outputPath);

    res.status(200).json({
      message: 'Compression and upload successful!',
      file: savedFile,
    });

  } catch (err) {
    console.error("Compression error:", err);
    res.status(500).json({ error: 'Compression or upload failed.' });
  }
};
