import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });

  // Explicitly overwrite cookie with empty + expired
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),   // force expire
    maxAge: 0,              // immediately invalid
  });

  return response;
}
