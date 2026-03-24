import Conversation from "../models/conversation.model.js";
const askAI = async (req, res) => {
  // Implementation for asking AI
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
      const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.SITE_URL || "http://localhost:5173",
          "X-Title": "MERN AI Flow App",
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await aiRes.json();
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        const answer = data.choices?.[0]?.message?.content || "No response";
        res.json({ answer });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch AI response" });
    }
}
const saveConversation = async (req, res) => {
  // Implementation for saving conversation
    const { prompt, response } = req.body;
    if (!prompt || !response)
        return res.status(400).json({ error: "prompt and response are required" });

    try {
        const doc = await Conversation.create({ prompt, response });
        res.json({ success: true, id: doc._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save conversation" });
    }
};

const getHistory = async (req, res) => {
  // Implementation for getting history
    try {
        const history = await Conversation.find().sort({ createdAt: -1 }).limit(20);
        res.json(history);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch history" });
    }
};

export { askAI, saveConversation, getHistory };