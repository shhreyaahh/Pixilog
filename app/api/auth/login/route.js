import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {

  try {

    const { username, email, password } = await req.json();

    await connectDB();

    // Support login with either username or email
    let user;
    if (username) {
      // Try username first, then email if username doesn't match
      user = await User.findOne({ username }) || await User.findOne({ email: username });
    } else if (email) {
      user = await User.findOne({ email });
    }

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 400 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 400 }
      );
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is UNDEFINED in login!');
      return NextResponse.json({ message: 'Server config error' }, { status: 500 });
    }
    console.log('Login secret length:', process.env.JWT_SECRET.length);
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log('Token signed successfully');

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );

  }

}