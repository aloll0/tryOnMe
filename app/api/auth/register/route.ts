import { NextRequest, NextResponse } from "next/server";
// import clientPromise from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import { supabase } from "../../../lib/lib/supabase";

export const runtime = "nodejs";

type RegisterRequestBody = {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  gender?: "male" | "female" | null;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body: RegisterRequestBody = await req.json();
    const { name, email, password, phone, gender } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 },
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters long" },
        { status: 400 },
      );
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    if (password.length > 50) {
      return NextResponse.json(
        { message: "Password must not exceed 50 characters" },
        { status: 400 },
      );
    }

    if (gender && !["male", "female"].includes(gender)) {
      return NextResponse.json(
        { message: "Gender must be either 'male' or 'female'" },
        { status: 400 },
      );
    }

    const existingUser = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12); 

    const result = await supabase
      .from("users")
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone || null,
        gender: gender || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    return NextResponse.json(
      {
        message: "Account created successfully",
        userId: result.data?.id.toString(),
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("REGISTER ERROR:", error);

    const isDevelopment = process.env.NODE_ENV === "development";

    return NextResponse.json(
      {
        message:
          "An error occurred while creating your account. Please try again.",
        ...(isDevelopment && {
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
        }),
      },
      { status: 500 },
    );
  }
}
