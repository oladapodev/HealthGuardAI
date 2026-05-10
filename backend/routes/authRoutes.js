import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { validate } from "../middleware/validate.js";
import { loginUserDto, registerUserDto } from "../dtos/userDtos.js";

const router = express.Router();

function publicUser(user) {
  return { id: user.id, email: user.email, profile: user.profile, createdAt: user.createdAt };
}

function signToken(user) {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret_key", { expiresIn: "30d" });
}

router.post("/register", registerUserDto, validate, async (req, res) => {
  try {
    const { email, password, profile = {} } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
    const user = await User.create({ email, password: hashedPassword, profile });

    res.status(201).json({ success: true, token: signToken(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/login", loginUserDto, validate, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    res.json({ success: true, token: signToken(user), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
