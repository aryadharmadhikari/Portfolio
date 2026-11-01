import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  excerpt: { type: String, required: true, trim: true, maxlength: 240 },
  body: { type: String, required: true, trim: true, maxlength: 10000 },
  tags: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
