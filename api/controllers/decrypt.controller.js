import crypto from "crypto";
import { Readable } from "stream";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export const decryptAndUpload = async (req, res) => {
    try {
      if (!req.body || !req.file) {
        return res.status(400).json({ message: "Missing request body or file." });
      }
  
      const { key, iv } = req.body;
  
      if (!key || !iv) {
        return res.status(400).json({ message: "Missing key or iv." });
      }
  
      // Convert key and iv from hex to buffer
      const keyBuffer = Buffer.from(key, "hex");
      const ivBuffer = Buffer.from(iv, "hex");
  
      console.log("🔍 req.file:", req.file);
      console.log("🔍 req.body:", req.body);
  
      // Decrypt
      const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, ivBuffer);
      const decrypted = Buffer.concat([
        decipher.update(req.file.buffer),
        decipher.final()
      ]);
  
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
  
        Readable.from(decrypted).pipe(uploadStream);
      });
  
      res.json({
        message: "Decryption and upload successful!",
        fileUrl: result.secure_url,
      });
  
    } catch (err) {
      console.error("Decryption Error:", err);
      res.status(500).json({ message: err.message });
    }
  };
  