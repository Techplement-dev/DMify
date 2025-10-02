import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

// Initialize Supabase client
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

// ✅ GET: Fetch campaigns (all or existence check)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignName = searchParams.get("campaign_name");

    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;

    if (!token) return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
    const decoded = jwt.decode(token);
    if (!decoded?.sub) return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });

    const userId = decoded.sub;

    // Existence check
    if (campaignName) {
      const { data, error } = await supabase
        .from("campaigns")
        .select("id")
        .eq("user_id", userId)
        .eq("campaign_name", campaignName)
        .maybeSingle();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ exists: !!data });
    }

    // Fetch all campaigns for user
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", userId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /campaigns error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// ✅ POST: Create new campaign
export async function POST(req) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;

    if (!token) return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
    const decoded = jwt.decode(token);
    if (!decoded?.sub) return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });

    const userId = decoded.sub;
    const body = await req.json();
    const { campaign_name, message_template, button_text, button_url } = body;

    if (!campaign_name || !message_template) {
      return NextResponse.json({ error: "Campaign name and message template are required" }, { status: 400 });
    }

    // Check for duplicates
    const { data: existingCampaign, error: fetchError } = await supabase
      .from("campaigns")
      .select("id")
      .eq("user_id", userId)
      .eq("campaign_name", campaign_name)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }
    if (existingCampaign) {
      return NextResponse.json({ message: "Campaign already exists" }, { status: 400 });
    }

    // Insert new campaign
    const { data, error } = await supabase
      .from("campaigns")
      .insert([{
        user_id: userId,
        campaign_name,
        message_template,
        button_text: button_text || null,
        button_url: button_url || null,
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

// ✅ PATCH: Update campaign
export async function PATCH(req) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;

    if (!token) return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
    const decoded = jwt.decode(token);
    if (!decoded?.sub) return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });

    const userId = decoded.sub;
    const body = await req.json();
    const { id, campaign_name, message_template, button_text, button_url, status } = body;

    if (!id) return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });

    const updateData = {};
    if (campaign_name) updateData.campaign_name = campaign_name;
    if (message_template) updateData.message_template = message_template;
    if (button_text !== undefined) updateData.button_text = button_text;
    if (button_url !== undefined) updateData.button_url = button_url;
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

// ✅ DELETE stays same
export async function DELETE(req) {
  try {
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;

    if (!token) return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
    const decoded = jwt.decode(token);
    if (!decoded?.sub) return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });

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
