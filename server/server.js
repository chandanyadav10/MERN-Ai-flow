
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// import fetch from "node-fetch";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;



// // ── POST /api/ask-ai ────────────────────────────────────────────────────────
// app.post("/api/ask-ai", async (req, res) => {
//   const { prompt } = req.body;
//   if (!prompt) return res.status(400).json({ error: "Prompt is required" });

//   try {
//     const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//         "HTTP-Referer": process.env.SITE_URL || "http://localhost:5173",
//         "X-Title": "MERN AI Flow App",
//       },
//       body: JSON.stringify({
//         model: "openrouter/free",
//         messages: [{ role: "user", content: prompt }],
//       }),
//     });

//     const data = await aiRes.json();

//     if (data.error) {
//       return res.status(500).json({ error: data.error.message });
//     }

//     const answer = data.choices?.[0]?.message?.content || "No response";
//     res.json({ answer });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch AI response" });
//   }
// });

// ── POST /api/save ──────────────────────────────────────────────────────────
// app.post("/api/save", async (req, res) => {
//   const { prompt, response } = req.body;
//   if (!prompt || !response)
//     return res.status(400).json({ error: "prompt and response are required" });

//   try {
//     const doc = await Conversation.create({ prompt, response });
//     res.json({ success: true, id: doc._id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to save to database" });
//   }
// });

// ── GET /api/history ────────────────────────────────────────────────────────
// app.get("/api/history", async (_req, res) => {
//   try {
//     const docs = await Conversation.find().sort({ createdAt: -1 }).limit(20);
//     res.json(docs);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch history" });
//   }
// });

const loadRoutes = async () => {
  const routeFiles = fs.readdirSync("./src/routes");
  for (const file of routeFiles) {
    try {
      const { default: router } = await import(`./src/routes/${file}`);
      app.use("/api/", router);
    } catch (error) {
      console.error(`Error loading route file ${file}:`, error);
    }
  }
};

await loadRoutes();

const Server = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }

};

Server();
