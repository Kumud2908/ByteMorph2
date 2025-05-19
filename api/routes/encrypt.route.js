import express from "express";

import {encryptAndUploadFromUrl}  from "../controllers/encrypt.controller.js";

const router = express.Router();

router.post("/", encryptAndUploadFromUrl);

export default router;