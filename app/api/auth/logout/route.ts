import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
    });

    response.cookies.set("authToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, 
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        message: "Server error during logout",
        error: error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
