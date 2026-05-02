import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectDB();

    const user = await User.findOne({
      email: email
        .toLowerCase()
        .trim(),
    });

    if (user) {
      const token =
        crypto
          .randomBytes(32)
          .toString("hex");

      user.resetPasswordToken =
        token;

      user.resetPasswordExpires =
        Date.now() +
        1000 *
          60 *
          15; // 15 mins

      await user.save();

      const resetLink = `http://localhost:3000/reset-password?token=${token}`;

      await resend.emails.send({
        from: "Pixilog <onboarding@resend.dev>",
        to: email,
        subject:
          "Reset your Pixilog password",
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;">
            <h2>Pixilog Password Reset ✨</h2>

            <p>You requested to reset your password.</p>

            <p>
              Click below to continue:
            </p>

            <a
              href="${resetLink}"
              style="
                display:inline-block;
                padding:12px 18px;
                background:#191f2b;
                color:#ffffff;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
              "
            >
              Reset Password
            </a>

            <p style="margin-top:20px;font-size:14px;color:#666;">
              This link expires in 15 minutes.
            </p>
          </div>
        `,
      });

      console.log(
        "Reset email sent to:",
        email
      );
    }

    return NextResponse.json({
      message:
        "If an account exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Server error",
      },
      { status: 500 }
    );
  }
}