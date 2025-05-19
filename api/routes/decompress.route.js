// routes/compressRoute.js
import express from "express"
const router = express.Router();
import { decompressAndUpload } from '../controllers/decompress.controller.js';

router.post('/', decompressAndUpload);

export default router
