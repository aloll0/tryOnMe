import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

// Routes that don't require authentication
const publicRoutes = ["/dashboard/login", "/dashboard/register", "/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    // No token, redirect to login
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }

  try {
    // Verify token
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // Invalid token, redirect to login
    console.error("Invalid token:", error);
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    "/dashboard/:path*",
    // Exclude API routes and static files
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
