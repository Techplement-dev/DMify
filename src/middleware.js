import { NextResponse } from "next/server";

const publicPaths = ["/login", "/signup", "/forgot-password", "/privacy-policy"];

export function middleware(req) {
  const token =
    req.cookies.get("token")?.value ||
    req.headers.get("authorization")?.split(" ")[1];

  const pathname = req.nextUrl.pathname;

  // Public routes
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // API routes handle their own auth
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // If no token, redirect
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Pass through
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
