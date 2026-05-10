import express from "express";
import { auth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { chatDto } from "../dtos/analyzeDtos.js";
import { listQueryDto, uuidParamDto } from "../dtos/commonDtos.js";
import { Conversation } from "../models/index.js";
import { continueConversation, createConversation } from "../services/chatService.js";
import { debug } from "../utils/debug.js";

const router = express.Router();

router.get("/sessions", auth, listQueryDto, validate, async (req, res) => {
  const conversations = await Conversation.findAll({
    where: { userId: req.user },
    order: [["updatedAt", "DESC"]],
    limit: Number(req.query.limit || 20),
  });
  res.json({ success: true, data: conversations, conversations });
});

router.post("/sessions", auth, async (req, res) => {
  const conversation = await createConversation({ userId: req.user, title: req.body.title });
  res.status(201).json({ success: true, conversation });
});

router.get("/sessions/:id", auth, uuidParamDto, validate, async (req, res) => {
  const conversation = await Conversation.findOne({ where: { id: req.params.id, userId: req.user } });
  if (!conversation) return res.status(404).json({ success: false, message: "Conversation not found" });
  res.json({ success: true, conversation });
});

router.post("/sessions/:id/messages", auth, uuidParamDto, chatDto, validate, async (req, res) => {
  try {
    debug.ai("chat message request", {
      userId: req.user,
      conversationId: req.params.id,
      intent: req.body.intent,
      runAnalysis: req.body.runAnalysis,
      textLength: (req.body.text || req.body.message || "").length,
    });
    const result = await continueConversation({
      userId: req.user,
      conversationId: req.params.id,
      body: req.body,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
      details: error.details,
    });
  }
});

router.post("/", auth, chatDto, validate, async (req, res) => {
  try {
    debug.ai("chat request", {
      userId: req.user,
      conversationId: req.body.conversationId,
      intent: req.body.intent,
      runAnalysis: req.body.runAnalysis,
      textLength: (req.body.text || req.body.message || "").length,
    });
    const result = await continueConversation({
      userId: req.user,
      conversationId: req.body.conversationId,
      body: req.body,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message,
      details: error.details,
    });
  }
});

export default router;
