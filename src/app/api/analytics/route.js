import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || (() => { throw new Error("SUPABASE_URL is not defined"); })(),
  process.env.SUPABASE_SERVICE_ROLE_KEY || (() => { throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined"); })()
);

function parseCookies(cookieHeader) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [name, ...rest] = cookie.split("=");
      return [name, rest.join("=")];
    })
  );
}

export async function GET(req) {
  try {
    // 1. Read token from cookies
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const userId = decoded.sub;

    // 2. Fetch campaigns for this user
    const { data: campaigns, error: campaignsError } = await supabase
      .from("campaigns")
      .select("id, campaign_name, message_template")
      .eq("user_id", userId);

    if (campaignsError) {
      console.error("Error fetching campaigns:", campaignsError);
      return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
    }

    // 3. For each campaign, fetch logs and calculate stats
    const results = [];
    for (let campaign of campaigns) {
      const { data: logs, error: logsError } = await supabase
        .from("message_logs")
        .select("status")
        .eq("campaign_id", campaign.id)
        .eq("user_id", userId);

      if (logsError) {
        console.error("Error fetching logs:", logsError);
        continue;
      }

      const totalDMs = logs.length;
      const sentDMs = logs.filter((l) => l.status === "sent").length;
      const failedDMs = logs.filter((l) => l.status === "failed").length;

      // Engagement rate = (sent / total) * 100
      const engagementRate = totalDMs > 0 ? ((sentDMs / totalDMs) * 100).toFixed(2) : 0;

      results.push({
        campaignId: campaign.id,
        campaignName: campaign.campaign_name,
        campaignMessage: campaign.message_template,
        totalDMs,
        sentDMs,
        failedDMs,
        engagementRate,
      });
    }

    // 4. Return results
    return NextResponse.json(results);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
