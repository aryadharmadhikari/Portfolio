import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  location: { type: String, trim: true, maxlength: 100, default: "" },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2048,
    validate: {
      validator(value) {
        try {
          return ["http:", "https:"].includes(new URL(value).protocol);
        } catch {
          return false;
        }
      },
      message: "Enter a valid HTTP or HTTPS image address.",
    },
  },
}, { timestamps: true });

export default mongoose.model("Photo", photoSchema);
