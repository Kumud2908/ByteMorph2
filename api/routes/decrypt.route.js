import express from "express";
import multer from "multer";
import { decryptAndUpload } from "../controllers/decrypt.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/decrypt", upload.single("file"), decryptAndUpload);


export default router;
