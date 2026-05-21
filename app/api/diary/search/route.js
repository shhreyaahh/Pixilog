import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import Diary from "@/models/Diary";


export async function GET(req) {

  try {

    const token = req.headers.get("authorization")?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    await connectDB();

    const results = await Diary.find({
      userId: decoded.id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } }
      ]
    });

    return NextResponse.json(results);

  } catch (error) {

    return NextResponse.json(
      { message: "Search error" },
      { status: 500 }
    );

  }

}