import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
    tags: {
      type: [String],
      default: [],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, "Excerpt cannot exceed 500 characters"],
    },
    body: {
      type: String,
      required: [true, "Body content is required"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    readTime: {
      type: String,
      default: "1 min read",
    },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", body: "text", excerpt: "text" });

const Post = mongoose.model("Post", postSchema);
export default Post;
