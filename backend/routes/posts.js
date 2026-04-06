import { Router } from "express";
import Post from "../models/Post.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

function estimateReadTime(text) {
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

// GET /api/posts — List all posts (public)
router.get("/", async (req, res) => {
  try {
    const { search, tag } = req.query;
    let filter = {};

    if (tag) {
      filter.tags = tag;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { title: regex },
        { excerpt: regex },
        { body: regex },
        { author: regex },
      ];
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .select("-body")
      .lean();

    res.json(posts);
  } catch (err) {
    console.error("Get posts error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/posts/:id — Get single post (public)
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).lean();
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    console.error("Get post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/posts — Create post (auth required)
router.post("/", authRequired, async (req, res) => {
  try {
    const { title, tags, excerpt, body, coverImage } = req.body;

    const postData = {
      title,
      author: req.user.name,
      authorId: req.user.id,
      tags: tags || [],
      excerpt: excerpt || (body ? body.substring(0, 160).replace(/[#*_`>\n]/g, "") + "..." : ""),
      body,
      coverImage: coverImage || "",
      readTime: estimateReadTime(body),
    };

    const post = await Post.create(postData);
    res.status(201).json(post);
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    console.error("Create post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/posts/:id — Update post (author only)
router.put("/:id", authRequired, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    const { title, tags, excerpt, body, coverImage } = req.body;

    post.title = title ?? post.title;
    post.tags = tags ?? post.tags;
    post.excerpt = excerpt ?? post.excerpt;
    post.body = body ?? post.body;
    post.coverImage = coverImage ?? post.coverImage;
    post.readTime = estimateReadTime(post.body);

    await post.save();
    res.json(post);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    console.error("Update post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/posts/:id — Delete post (author only)
router.delete("/:id", authRequired, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    console.error("Delete post error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
