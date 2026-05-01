import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {

  try {

    const body = await req.json();
    const username = body.username?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    await connectDB();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword
    });

    return NextResponse.json({
      message: "User registered successfully"
    });

  } catch (error) {

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );

  }

}
