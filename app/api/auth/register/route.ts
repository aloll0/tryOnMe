// pages/api/auth/register.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSupabaseClient } from "../../../lib/lib/supabase";

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

    if (password.length < 8 || password.length > 50) {
      return NextResponse.json(
        { message: "Password must be between 8 and 50 characters" },
        { status: 400 },
      );
    }

    if (gender && !["male", "female"].includes(gender)) {
      return NextResponse.json(
        { message: "Gender must be either 'male' or 'female'" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseClient();

    const { data: existingUser } = await supabase
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

    const { data } = await supabase
      .from("users")
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone || null,
        gender: gender || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .select()
      .single();

    return NextResponse.json(
      { message: "Account created successfully", userId: data?.id.toString() },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      {
        message: "Server error",
        error: error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
