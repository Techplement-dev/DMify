// app/api/campaigns/route.js

let campaigns = []; // temporary in-memory storage

// ✅ Save new campaign
export async function POST(req) {
  try {
    const { keyword, message } = await req.json();

    if (!keyword || !message) {
      return new Response(JSON.stringify({ error: "Keyword and message are required" }), {
        status: 400,
      });
    }

    const newCampaign = { id: campaigns.length + 1, keyword, message };
    campaigns.push(newCampaign);

    return new Response(JSON.stringify(newCampaign), { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}

// ✅ Get all saved campaigns
export async function GET() {
  try {
    return new Response(JSON.stringify(campaigns), { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
