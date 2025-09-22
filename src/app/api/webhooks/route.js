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
  console.log("Query params:", Object.fromEntries(new URL(req.url).searchParams));


  if (mode === "subscribe" && token === process.env.INSTAGRAM_VERIFY_TOKEN) {
    console.log("Webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("Webhook verification failed ❌");
  return new NextResponse("Verification failed", { status: 403 });
}

/* 2. HANDLE INCOMING COMMENTS (POST) */
/* 2. HANDLE INCOMING COMMENTS (POST) */
export async function POST(req) {
  try {
    const body = await req.json();
    console.log("Full webhook payload received:\n", JSON.stringify(body, null, 2));

    const entry = body.entry?.[0];
    const change = entry?.changes?.[0]?.value;

    if (change && change.id) {
      const commentId = change.id;
      const commenterId = change.from?.id;
      const commenterName = change.from?.username || "Unknown";
      const commentText = change.text;
      const mediaId = change.media?.id;

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
          break;
        }
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
          dm_status: null,
        }])
        .select()
        .single();

      if (insertError) {
        console.error("DB insert error:", insertError);
        return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
      }

      console.log("Inserted comment into DB:", commentInsert);

      // Attempt Auto-DM if campaign matched
      if (matchedCampaign) {
        let dmSuccess = false;

        try {
          const IG_BUSINESS_ACCOUNT_ID = process.env.IG_BUSINESS_ACCOUNT_ID;

          const sendDM = await fetch(
            `https://graph.facebook.com/v17.0/${IG_BUSINESS_ACCOUNT_ID}/messages?access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
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
          console.log("Auto DM response status:", sendDM.status);
          console.log("Auto DM response body:", dmResult);

          if (sendDM.ok) dmSuccess = true;
        } catch (dmError) {
          console.error("Auto DM error:", dmError);
        }

        // If DM failed, fallback to comment reply
        if (!dmSuccess) {
          try {
            const sendCommentReply = await fetch(
              `https://graph.facebook.com/v17.0/${commentId}/replies?access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: matchedCampaign.message_template }),
              }
            );
            const replyResult = await sendCommentReply.json();
            console.log("Fallback comment reply result:", replyResult);
          } catch (replyError) {
            console.error("Fallback comment reply failed:", replyError);
          }
        }

        // Update comment with DM status
        await supabase
          .from("comments")
          .update({ replied: true, replied_at: new Date(), dm_status: dmSuccess ? "success" : "failed" })
          .eq("id", commentInsert.id);

        console.log("Comment updated as replied with DM status");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
