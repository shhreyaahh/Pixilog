import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Diary from "@/models/Diary";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();

    const diaries = await Diary.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(diaries);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching diaries" },
      { status: 500 }
    );
  }
}

