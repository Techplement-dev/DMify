import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL || (() => { throw new Error("SUPABASE_URL is not defined"); })(),
  process.env.SUPABASE_SERVICE_ROLE_KEY || (() => { throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined"); })()
);

// Helper: parse cookies
function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, ...rest] = cookie.split("=");
      return [name, rest.join("=")];
    })
  );
}

// GET: Fetch campaigns for logged-in user (all or by keyword)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword");

    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Token missing" },
        { status: 401 }
      );
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid token" },
        { status: 401 }
      );
    }

    const userId = decoded.sub;

    // Case 1: Keyword provided → existence check
    if (keyword) {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id")
        .eq("user_id", userId)
        .eq("campaign_name", keyword)
        .maybeSingle(); // returns null if not found

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ exists: !!data });
    }

    // Case 2: No keyword → fetch all campaigns
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /campaigns error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST: Create a new campaign
export async function POST(req) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;

    if (!token) return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });

    const userId = decoded.sub;

    const body = await req.json();
    const { keyword, message } = body;

    if (!keyword || !message) {
      return NextResponse.json({ error: "Keyword and message are required" }, { status: 400 });
    }

    // Step 1: Check if campaign already exists
    const { data: existingCampaign, error: fetchError } = await supabase
      .from("campaigns")
      .select("id")
      .eq("user_id", userId)
      .eq("campaign_name", keyword)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // any error other than "no rows found"
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (existingCampaign) {
      // Step 2: Return message if already exists
      return NextResponse.json({ message: "Campaign already exists" }, { status: 400 });
    }

    // Step 3: Insert new campaign if not exists
    const { data, error } = await supabase
      .from("campaigns")
      .insert([{
        user_id: userId,
        campaign_name: keyword,
        message_template: message,
        status: "active",
      }])
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Campaign created successfully", data });
  } catch (error) {
    console.error("POST /campaigns error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// DELETE: Delete a campaign by ID
export async function DELETE(req) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;

    if (!token) return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });

    const userId = decoded.sub;

    const body = await req.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });

    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("DELETE /campaigns error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// PATCH: Update campaign (edit or toggle status)
export async function PATCH(req) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;

    if (!token) return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });

    const userId = decoded.sub;

    const body = await req.json();
    const { id, keyword, message, status } = body;

    if (!id) return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });

    const updateData = {};
    if (keyword) updateData.campaign_name = keyword;
    if (message) updateData.message_template = message;
    if (status) updateData.status = status;

    const { data, error } = await supabase
      .from("campaigns")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ message: "Campaign updated successfully", data });
  } catch (error) {
    console.error("PATCH /campaigns error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
