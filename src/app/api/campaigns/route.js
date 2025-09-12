import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL || (() => { throw new Error("SUPABASE_URL is not defined"); })(),
  process.env.SUPABASE_SERVICE_ROLE_KEY || (() => { throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined"); })() // only use in server environment
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

// GET: Fetch campaigns for logged-in user
export async function GET(req) {
  try {
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
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// POST: Create a new campaign for logged-in user
export async function POST(req) {
  try {
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

    const body = await req.json();
    const { keyword, message } = body;

    if (!keyword || !message) {
      return NextResponse.json({ error: "Keyword and message are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("campaigns")
      .insert([
        {
          user_id: userId,
          campaign_name: keyword,         // ✅ match to campaign_name column
          message_template: message,      // ✅ match to message_template column
          status: "active",
        },
      ])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Campaign created successfully", data });
  } catch (error) {
    console.error("POST /campaigns error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// DELETE: Delete a campaign by ID for the logged-in user
export async function DELETE(req) {
  try {
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

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    // Delete campaign where user_id matches and id matches
    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("DELETE /campaigns error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}





// // app/api/campaigns/route.js

// let campaigns = []; // temporary in-memory storage

// // ✅ Save new campaign
// export async function POST(req) {
//   try {
//     const { keyword, message } = await req.json();

//     if (!keyword || !message) {
//       return new Response(JSON.stringify({ error: "Keyword and message are required" }), {
//         status: 400,
//       });
//     }

//     const newCampaign = { id: campaigns.length + 1, keyword, message };
//     campaigns.push(newCampaign);

//     return new Response(JSON.stringify(newCampaign), { status: 201 });
//   } catch (error) {
//     console.error("POST Error:", error);
//     return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
//   }
// }

// // ✅ Get all saved campaigns
// export async function GET() {
//   try {
//     return new Response(JSON.stringify(campaigns), { status: 200 });
//   } catch (error) {
//     console.error("GET Error:", error);
//     return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
//   }
// }
