// routes/analyzeRoute.js

import express from "express";
import multer from "multer";
import { analyzeHealth, downloadReport } from "../controllers/analyzeController.js";
import { upload } from "../middleware/upload.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Handle multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
  next();
};

router.post("/", auth, upload.single('picture'), handleMulterError, analyzeHealth);
router.post("/download", auth, downloadReport);

export default router;
