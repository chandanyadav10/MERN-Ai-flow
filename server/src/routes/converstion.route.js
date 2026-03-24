import express from "express";
import { askAI, getHistory, saveConversation } from "../controllers/conversation.controller.js";

const router = express.Router();

// ── POST /api/ask-ai
router.post("/ask-ai", askAI);

router.get("/history", getHistory);

router.post("/save", saveConversation)

export default router;