import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;

  // Public routes
  const publicPaths = ["/login", "/api/auth/signup", "/api/auth/login", "/api/auth/logout"];

  if (publicPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // If not logged in, redirect to login
  if (!token) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.headers.set("Cache-Control", "no-store"); // prevent caching
    return res;
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store"); // prevent caching
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
