import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import Post from "./models/Post.js";
import { seedPosts } from "./data/seedPosts.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "5mb" }));

// ── Routes ───────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ── Health check ─────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Seed database ────────────────────────────────────────
async function seedDatabase() {
  const count = await Post.countDocuments();
  if (count === 0) {
    console.log("📝 Seeding database with initial posts...");

    const postsWithMeta = seedPosts.map((post) => {
      const words = post.body.trim().split(/\s+/).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      return {
        ...post,
        authorId: new mongoose.Types.ObjectId(),
        date: new Date().toISOString().split("T")[0],
        readTime: `${minutes} min read`,
      };
    });

    await Post.insertMany(postsWithMeta);
    console.log(`✅ Seeded ${postsWithMeta.length} posts`);
  }
}

// ── Connect to MongoDB & start server ────────────────────
async function start() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");

    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 CORS enabled for: ${process.env.CLIENT_URL || "http://localhost:5173"}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
}

start();
