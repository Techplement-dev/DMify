import supabaseAdmin from "@/lib/supabaseAdmin";// backend admin client
import supabase from "@/lib/supabase"; // frontend client (for signup)
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Password rules
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: "Password must be 6+ chars, 1 uppercase, 1 special char" },
        { status: 400 }
      );
    }

    // Check if user already exists using admin client
    const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      return NextResponse.json({ error: "Error checking existing users" }, { status: 500 });
    }

    const userExists = users.users.some((u) => u.email === email);
    if (userExists) {
      return NextResponse.json(
        { error: "User already exists, please login" },
        { status: 400 }
      );
    }

    // Signup new user with anon client
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: "Signup successful! Please check your email for verification.",
      user: data.user,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
