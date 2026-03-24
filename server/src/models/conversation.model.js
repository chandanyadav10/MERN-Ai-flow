import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
    {
    prompt: { type: String, required: true },
    response: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);