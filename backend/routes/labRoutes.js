import express from "express";
import { upload } from "../middleware/upload.js";
import { analyzeLabFile } from "../controllers/labController.js";

const router = express.Router();

// 📤 Upload lab file (PDF/Image)
router.post(
    "/upload-labs",
    upload.single("file"),
    analyzeLabFile
);

export default router;