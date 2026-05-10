import express from "express";
import multer from "multer";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { analyzeHealthDto } from "../dtos/analyzeDtos.js";
import { listQueryDto, uuidParamDto } from "../dtos/commonDtos.js";
import { HealthAnalysis } from "../models/index.js";
import { createAnalysis, formatAnalysis } from "../services/analysisService.js";
import { generateHealthReport } from "../utils/pdfGenerator.js";
import { debug } from "../utils/debug.js";

const router = express.Router();

function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
  }
  if (err) return res.status(500).json({ success: false, error: err.message });
  next();
}

router.get("/", auth, listQueryDto, validate, async (req, res) => {
  const analyses = await HealthAnalysis.findAll({
    where: { userId: req.user },
    order: [["createdAt", "DESC"]],
    limit: Number(req.query.limit || 20),
  });

  const data = analyses.map((analysis) => formatAnalysis(analysis));
  res.json({
    success: true,
    data,
    analyses: data,
  });
});

router.post(
  "/",
  auth,
  upload.single("file"),
  handleMulterError,
  analyzeHealthDto,
  validate,
  async (req, res) => {
    try {
      debug.feature("analysis request", {
        userId: req.user,
        hasFile: Boolean(req.file),
        bodyKeys: Object.keys(req.body || {}),
      });
      const analysis = await createAnalysis({ userId: req.user, body: req.body, file: req.file });
      res.status(201).json(analysis);
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message,
        details: error.details,
      });
    }
  }
);

router.get("/:id", auth, uuidParamDto, validate, async (req, res) => {
  const analysis = await HealthAnalysis.findOne({ where: { id: req.params.id, userId: req.user } });
  if (!analysis) return res.status(404).json({ success: false, message: "Analysis not found" });
  res.json(formatAnalysis(analysis));
});

router.post("/:id/report", auth, uuidParamDto, validate, async (req, res) => {
  try {
    const analysis = await HealthAnalysis.findOne({ where: { id: req.params.id, userId: req.user } });
    if (!analysis) return res.status(404).json({ success: false, message: "Analysis not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=HealthGuard_Report_${analysis.id}.pdf`);
    generateHealthReport(formatAnalysis(analysis), res);
  } catch (error) {
    if (!res.headersSent) res.status(500).json({ success: false, error: error.message });
    else res.end();
  }
});

export default router;
