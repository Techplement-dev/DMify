import { NextResponse } from "next/server";

// List of public frontend routes
const publicPaths = ["/login", "/signup", "/forgot-password", "privacy-policy"];

export function middleware(req) {
  // Get token from cookie or Authorization header
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.split(" ")[1];

  const pathname = req.nextUrl.pathname;

  // Allow public frontend routes
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow API routes to handle auth themselves
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // If token missing, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    const res = NextResponse.redirect(loginUrl);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // All good, continue
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store");
  return res;
}

// Apply middleware to all frontend routes except Next.js internals
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
