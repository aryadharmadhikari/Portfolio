import "dotenv/config";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import Post from "./models/Post.js";
import Photo from "./models/Photo.js";

const app = express();
const port = Number(process.env.PORT) || 5050;

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? [process.env.CLIENT_ORIGIN]
  : ["http://localhost:5173", "http://127.0.0.1:5173"];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok", database: mongoose.connection.readyState === 1 ? "connected" : "disconnected" });
});

registerCollectionRoutes("posts", Post);
registerCollectionRoutes("photos", Photo);

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    return response.status(400).json({ error: "Request body must be valid JSON." });
  }
  console.error(error);
  return response.status(500).json({ error: "An unexpected server error occurred." });
});

async function start() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/arya_personal_site";
  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
  app.listen(port, "127.0.0.1", () => console.log(`API listening at http://localhost:${port}`));
}

function registerCollectionRoutes(resource, Model) {
  app.get(`/api/${resource}`, async (_request, response, next) => {
    try {
      const records = await Model.find().sort({ createdAt: -1 }).lean();
      response.json(records);
    } catch (error) {
      next(error);
    }
  });

  app.post(`/api/${resource}`, async (request, response, next) => {
    try {
      const record = await Model.create(request.body);
      response.status(201).json(record);
    } catch (error) {
      if (error.name === "ValidationError" || error.name === "CastError") {
        return response.status(400).json({ error: error.message });
      }
      next(error);
    }
  });
}

start();
