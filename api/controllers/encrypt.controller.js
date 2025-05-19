import crypto from "crypto";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

// Make sure your Cloudinary is configured somewhere
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const encryptAndUploadFromUrl = async (req, res) => {
  try {
    const { fileUrl } = req.body;
    if (!fileUrl) {
      return res.status(400).json({ message: "File URL is required" });
    }

    // 1. Download the file
    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
    const fileBuffer = Buffer.from(response.data);

    // 2. Generate key and IV
    const key = crypto.randomBytes(32); // 256-bit key
    const iv = crypto.randomBytes(16);  // 128-bit IV

    // 3. Encrypt the file
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);

    // 4. Upload encrypted file to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(encrypted);
    });

    res.json({
      message: "Encrypted file uploaded successfully",
      encryptedFileUrl: uploadResult.secure_url,
      key: key.toString("hex"),
      iv: iv.toString("hex")
    });

  } catch (error) {
    console.error("Encryption/Upload error:", error);
    res.status(500).json({ message: "Failed to process file", error: error.message });
  }
};
