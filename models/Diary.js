/*import mongoose from "mongoose";

const DiarySchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  tags: [{
    type: String
  }],

  images: [{
    type: String
  }],

  isPrivate: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

export default mongoose.models.Diary || mongoose.model("Diary", DiarySchema);*/