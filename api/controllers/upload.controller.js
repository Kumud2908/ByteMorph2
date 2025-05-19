import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import File from "../models/file.models.js";

dotenv.config({ path: '../.env' });

// Cloudinary Configuration
console.log("Loaded env vars:", {
  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET
});
cloudinary.config({
  
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
console.log("Cloudinary config check:", cloudinary.config());


export const uploadFile = async (req, res) => {
  try {
    console.log("Cloudinary config:");
console.log("Cloud name:", process.env.CLOUD_NAME);
console.log("API key exists:", process.env.API_KEY);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    console.log("Received File:", req.file); // Debugging

    // Upload file to Cloudinary from buffer
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "auto" }, // Supports all file types
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer); // Upload the buffer
    });

    console.log("Cloudinary Response:", result); // Debugging Cloudinary response

    // Ensure Cloudinary returned a valid URL
    if (!result || !result.secure_url) {
      return res.status(500).json({ message: "File upload to Cloudinary failed" });
    }

    // Save file info to MongoDB
    const newFile = new File({
      fileName: req.file.originalname, // Fix: Use correct filename
      fileUrl: result.secure_url, // Fix: Save correct Cloudinary URL
      fileType: req.file.mimetype, // Fix: Use correct file type
    //   fileSize: req.file.size,
   
    });

    await newFile.save(); // Save file info in MongoDB

    res.json({
      
      message: "Upload successful!",
      file: newFile
    });
     console.log("uploaded ")
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: error.message });
  }
};
