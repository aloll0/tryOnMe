import { NextRequest, NextResponse } from "next/server";
// import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../../../lib/lib/supabase";
// Define type for login request
type LoginRequestBody = {
  email: string;
  password: string;
};

// JWT secret (should be in environment variables)
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

export async function POST(req: NextRequest) {
  try {
    const body: LoginRequestBody = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    // const client = await clientPromise;

    // Find user
    const user = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 },
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.data.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 },
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.data.id.toString(),
        email: user.data.email,
        name: user.data.name,
      },
      JWT_SECRET,
      { expiresIn: "7d" }, // Token expires in 7 days
    );

    // Create response
    const response = NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.data.id.toString(),
        name: user.data.name,
        email: user.data.email,
        phone: user.data.phone,
        gender: user.data.gender,
      },
    });

    // Set HTTP-only cookie for better security (optional, alongside token)
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Login error:", error);

    return NextResponse.json(
      {
        message: "Server error",
        error: error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
