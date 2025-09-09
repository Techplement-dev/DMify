import { NextResponse } from "next/server";
import supabase from "src/lib/supabase";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.session) {
      return NextResponse.json(
        { error: "Please verify your email before logging in." },
        { status: 401 }
      );
    }

    const token = data.session.access_token;

    // Create response and set token as HTTP-only cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: data.user,
      token, // still send it in JSON if frontend wants
    });

    response.cookies.set("token", token, {
      httpOnly: true,     // cannot be accessed by JS (secure)
      path: "/",          // cookie available for all routes
      sameSite: "strict", // prevent CSRF
      // secure: true,     // enable in production (HTTPS)
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;

  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
