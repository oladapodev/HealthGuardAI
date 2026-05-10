import express from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { LabUpload } from "../models/index.js";
import { parseAndStoreLabFile } from "../services/analysisService.js";
import { validate } from "../middleware/validate.js";
import { listQueryDto } from "../dtos/commonDtos.js";
import { labUploadDto } from "../dtos/labDtos.js";

const router = express.Router();

function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
  }
  if (err) return res.status(500).json({ success: false, error: err.message });
  next();
}

router.get("/", auth, listQueryDto, validate, async (req, res) => {
  const uploads = await LabUpload.findAll({
    where: { userId: req.user },
    order: [["createdAt", "DESC"]],
    limit: Number(req.query.limit || 20),
  });
  res.json({ success: true, uploads });
});

router.post("/upload", auth, upload.single("file"), handleMulterError, labUploadDto, validate, async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
    const uploadRecord = await parseAndStoreLabFile({ file: req.file, userId: req.user });
    res.status(201).json({
      success: true,
      labUpload: {
        id: uploadRecord.id,
        fileName: uploadRecord.fileName,
        mimeType: uploadRecord.mimeType,
        size: uploadRecord.size,
        parsedResults: uploadRecord.parsedResults,
        extractedTextPreview: uploadRecord.extractedText?.slice(0, 500) || "",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
