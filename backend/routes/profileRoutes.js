import express from "express";
import { User } from "../models/index.js";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateProfileDto } from "../dtos/userDtos.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const user = await User.findByPk(req.user, { attributes: { exclude: ["password"] } });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, user });
});

router.put("/", auth, updateProfileDto, validate, async (req, res) => {
  const user = await User.findByPk(req.user, { attributes: { exclude: ["password"] } });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  await user.update({ profile: { ...(user.profile || {}), ...(req.body.profile || {}) } });
  res.json({ success: true, user });
});

export default router;
