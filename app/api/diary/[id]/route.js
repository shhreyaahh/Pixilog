import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
//import Diary from "@/models/Diary";
import jwt from "jsonwebtoken";
import Post from "@/models/Post"

export async function DELETE(req, { params }) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = params;

    await connectDB();

    const diary = await Diary.findOneAndDelete({
      _id: id,
      userId: decoded.id
    });

    if (!diary) {
      return NextResponse.json(
        { message: "Diary not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Diary deleted" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting diary" },
      { status: 500 }
    );
  }
}

