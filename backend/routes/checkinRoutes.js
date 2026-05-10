import express from "express";
import { DailyCheckin, User } from "../models/index.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { dailyCheckinDto } from "../dtos/userDtos.js";
import { listQueryDto } from "../dtos/commonDtos.js";
import { debug } from "../utils/debug.js";

const router = express.Router();

router.get("/", auth, listQueryDto, validate, async (req, res) => {
  const checkins = await DailyCheckin.findAll({
    where: { userId: req.user },
    order: [["createdAt", "DESC"]],
    limit: Number(req.query.limit || 30),
  });
  res.json({ success: true, data: checkins, checkins });
});

router.post("/", auth, dailyCheckinDto, validate, async (req, res) => {
  const user = await User.findByPk(req.user);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const log = req.body.log || {};
  debug.feature("check-in create", {
    userId: req.user,
    mood: log.mood,
    symptomCount: (log.symptoms || []).length,
    hasNotes: Boolean(log.notes),
  });
  const checkin = await DailyCheckin.create({
    userId: req.user,
    mood: log.mood,
    notes: log.notes,
    symptoms: log.symptoms || [],
    foodTags: log.foodTags || [],
    sleep: log.sleep || {},
    exercise: log.exercise || {},
    metadata: {
      source: log.source || "manual",
      voiceText: log.voiceText,
      clientTimestamp: log.date || log.createdAt,
    },
  });

  const dailyLogs = [...(user.dailyLogs || []), { ...log, id: checkin.id, createdAt: checkin.createdAt }];
  await user.update({ dailyLogs });

  res.status(201).json({ success: true, checkin });
});

export default router;
