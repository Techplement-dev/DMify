//CampaignId/route.js → Summary stats (total, sent, failed, engagement, campaignName, message).

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY 
);

export async function GET(request) {
  try {

    // 1. Get the current logged-in user from the request

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // 2. Fetch all campaigns for this user

    const { data: campaigns, error: campaignsError } = await supabase
      .from("campaigns")
      .select("id, campaign_name, message_template, created_at")
      .eq("user_id", userId);

    if (campaignsError) {
      console.error("Error fetching campaigns:", campaignsError);
      return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
    }

    // 3. Fetch message logs linked to those campaigns

    const campaignIds = campaigns.map(c => c.id);

    let logs = [];
    if (campaignIds.length > 0) {
      const { data: messageLogs, error: logsError } = await supabase
        .from("message_logs")
        .select("campaign_id, status")
        .in("campaign_id", campaignIds);

      if (logsError) {
        console.error("Error fetching logs:", logsError);
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
      }

      logs = messageLogs;
    }

    // 4. Build analytics response per campaign

    const analytics = campaigns.map(campaign => {
      const campaignLogs = logs.filter(l => l.campaign_id === campaign.id);

      const totalDMs = campaignLogs.length;
      const sentDMs = campaignLogs.filter(l => l.status === "sent").length;
      const failedDMs = campaignLogs.filter(l => l.status === "failed").length;

      // Engagement % = sent / total (if any DMs exist)

      const engagementRate = totalDMs > 0 ? ((sentDMs / totalDMs) * 100).toFixed(2) : 0;

      return {
        campaignId: campaign.id,
        campaignName: campaign.campaign_name,
        campaignMessage: campaign.message_template,
        createdAt: campaign.created_at,
        totalDMs,
        sentDMs,
        failedDMs,
        engagementRate: `${engagementRate}%`
      };
    });

    // 5. Return analytics JSON
    
    return NextResponse.json({ analytics });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}




//GET
//http://localhost:3000/api/analytics/CampaignId?userId=3e0dc382-21f3-4016-8466-0d02a7fcb5c0