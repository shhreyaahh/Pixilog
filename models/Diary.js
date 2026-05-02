import mongoose from "mongoose";

const DiarySchema = new mongoose.Schema(
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

const Diary = mongoose.models.Diary || mongoose.model("Diary", DiarySchema);

export default Diary;
