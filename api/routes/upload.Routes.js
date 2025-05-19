import express from "express";
import multer from "multer";
import {uploadFile}  from "../controllers/upload.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

router.post("/profile/upload", upload.single("file"),uploadFile);

export default router;