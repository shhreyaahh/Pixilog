import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    category: String,
    tags: [String],
    isPublic: Boolean,
    userId: String,
    image: {
    type: String,
    default: null
  }
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", PostSchema);