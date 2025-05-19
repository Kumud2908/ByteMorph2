import express from'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import UploadRoutes from './routes/upload.Routes.js';
import CompressRoutes from './routes/compressRoute.js';
import EncryptRoutes from './routes/encrypt.route.js';
import DecryptRoutes from './routes/decrypt.route.js';
import DecompressRoutes from './routes/decompress.route.js';
import cors from "cors";
dotenv.config({ path: '../.env' });
const app=express();
app.use(express.json());
console.log(process.env.MONGO_URI)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

 app.use(cors({
   origin: ["http://localhost:5173", "http://localhost:5174"] , // Allow requests from your frontend
   methods: ["GET", "POST", "PUT", "DELETE"],
   credentials: true  // Allow cookies/auth headers if needed
 }));


app.use("/api/user",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/",UploadRoutes);
app.use("/api/compress/",CompressRoutes);
app.use("/api/decompress/",DecompressRoutes);
app.use("/api/encrypt/",EncryptRoutes);
app.use("/api/",DecryptRoutes);
app.listen(3000 ,()=>{
   console.log('server lsitening on port 3000!')
});
