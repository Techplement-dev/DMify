import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* 1. VERIFY WEBHOOK (GET) */
export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
    console.log("Webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("Webhook verification failed ❌");
  return new NextResponse("Verification failed", { status: 403 });
}

/* 2. HANDLE INCOMING COMMENTS (POST) */
export async function POST(req) {
  try {
    const body = await req.json();

    // Log the full payload for debugging
    console.log("Full webhook payload received:\n", JSON.stringify(body, null, 2));

    const entry = body.entry?.[0];
    const change = entry?.changes?.[0]?.value;

    if (change && change.comment_id) {
      const commentId = change.comment_id;
      const commenterId = change.from?.id;
      const commenterName = change.from?.username || "Unknown";
      const commentText = change.text;
      const mediaId = change.media_id;

      console.log(`Processing comment: "${commentText}" (ID: ${commentId}) from ${commenterName}`);

      // Avoid duplicate insertion
      const { data: existing } = await supabase
        .from("comments")
        .select("id")
        .eq("comment_id", commentId)
        .maybeSingle();

      if (existing) {
        console.log(`Duplicate comment detected, skipping insert: ${commentId}`);
        return NextResponse.json({ success: true, message: "Duplicate comment" });
      }

      // Fetch active campaigns
      const { data: campaigns, error: campaignError } = await supabase
        .from("campaigns")
        .select("*")
        .eq("status", "active");

      if (campaignError) console.error("Error fetching campaigns:", campaignError);

      console.log("Active campaigns:", campaigns?.map(c => c.campaign_name));

      // Check for keyword match
      let matchedCampaign = null;
      for (let c of campaigns || []) {
        if (commentText.toLowerCase().includes(c.campaign_name.toLowerCase())) {
          matchedCampaign = c;
          console.log(`Keyword matched: "${c.campaign_name}" in comment "${commentText}"`);
          break; // Stop at first match
        }
      }

      if (!matchedCampaign) {
        console.log("No campaign keywords matched for this comment.");
      }

      // Insert comment
      const { data: commentInsert, error: insertError } = await supabase
        .from("comments")
        .insert([{
          user_id: matchedCampaign ? matchedCampaign.user_id : null,
          campaign_id: matchedCampaign ? matchedCampaign.id : null,
          comment_id: commentId,
          commenter_id: commenterId,
          commenter_name: commenterName,
          comment_text: commentText,
          media_id: mediaId,
          replied: false,
        }])
        .select()
        .single();

      if (insertError) {
        console.error("DB insert error:", insertError);
        return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
      }

      console.log("Inserted comment into DB:", commentInsert);

      // Send auto-DM if campaign matched
      if (matchedCampaign) {
        const sendDM = await fetch(
          `https://graph.facebook.com/v21.0/me/messages?access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipient: { id: commenterId },
              message: { text: matchedCampaign.message_template },
            }),
          }
        );

        const dmResult = await sendDM.json();
        console.log("Auto DM sent:", dmResult);

        // Update comment as replied
        await supabase
          .from("comments")
          .update({ replied: true, replied_at: new Date() })
          .eq("id", commentInsert.id);

        console.log("Comment updated as replied");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
