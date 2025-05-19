// routes/compressRoute.js
import express from "express"
const router = express.Router();
import { compressAndUpload } from '../controllers/compress.controller.js';

router.post('/compress', compressAndUpload);

export default router
