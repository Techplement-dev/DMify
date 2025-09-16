import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Sends an auto-DM when a comment matches a keyword in the user's campaigns.
 * 
 * @param {string} userId - The ID of the user owning the campaign
 * @param {string} commentText - The comment text to check
 * @param {string} instagramUserId - The Instagram user ID to send the DM to
 */
export async function sendAutoDM(userId, commentText, instagramUserId) {
  try {
    // Fetch active campaigns for this user
    const { data: campaigns, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) throw error;

    // Check if any campaign matches the comment text
    const matchingCampaign = campaigns.find(campaign =>
      commentText.toLowerCase().includes(campaign.campaign_name.toLowerCase())
    );

    if (!matchingCampaign) {
      console.log("No matching campaign found.");
      return;
    }

    // Send the DM using Instagram Graph API
    const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    const url = `https://graph.facebook.com/v14.0/${instagramUserId}/messages`;

    const payload = {
      messaging_type: "MESSAGE_TAG",
      tag: "ACCOUNT_UPDATE",
      message: {
        text: matchingCampaign.message_template
      }
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${instagramAccessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Failed to send DM:", result);
    } else {
      console.log("DM sent successfully:", result);
    }

  } catch (err) {
    console.error("Error in sendAutoDM:", err.message);
  }
}
