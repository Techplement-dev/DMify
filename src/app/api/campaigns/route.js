// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";
// import jwt from "jsonwebtoken";

// // Initialize Supabase client using environment variables
// const supabase = createClient(
//   process.env.SUPABASE_URL || (() => { throw new Error("SUPABASE_URL is not defined"); })(),
//   process.env.SUPABASE_SERVICE_ROLE_KEY || (() => { throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined"); })() // only use in server environment
// );

// function parseCookies(cookieHeader) {
//   if (!cookieHeader) return {};
//   return Object.fromEntries(
//     cookieHeader.split("; ").map((cookie) => {
//       const [name, ...rest] = cookie.split("=");
//       return [name, rest.join("=")];
//     })
//   );
// }

// // GET: Fetch campaigns for logged-in user
// export async function GET(req) {
//   try {
//     const cookieHeader = req.headers.get("cookie");
//     const cookies = parseCookies(cookieHeader);
//     const token = cookies.token;

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
//     }

//     const decoded = jwt.decode(token);

//     if (!decoded || !decoded.sub) {
//       return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
//     }

//     const userId = decoded.sub;

//     const { data, error } = await supabase
//       .from("campaigns")
//       .select("*")
//       .eq("user_id", userId);

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("GET /campaigns error:", error);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }

// // POST: Create a new campaign for logged-in user
// export async function POST(req) {
//   try {
//     const cookieHeader = req.headers.get("cookie");
//     const cookies = parseCookies(cookieHeader);
//     const token = cookies.token;

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
//     }

//     const decoded = jwt.decode(token);

//     if (!decoded || !decoded.sub) {
//       return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
//     }

//     const userId = decoded.sub;

//     const body = await req.json();
//     const { keyword, message } = body;

//     if (!keyword || !message) {
//       return NextResponse.json({ error: "Keyword and message are required" }, { status: 400 });
//     }

//     const { data, error } = await supabase
//       .from("campaigns")
//       .insert([
//         {
//           user_id: userId,
//           campaign_name: keyword,         // ✅ match to campaign_name column
//           message_template: message,      // ✅ match to message_template column
//           status: "active",
//         },
//       ])
//       .select();

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json({ message: "Campaign created successfully", data });
//   } catch (error) {
//     console.error("POST /campaigns error:", error);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }

// // DELETE: Delete a campaign by ID for the logged-in user
// export async function DELETE(req) {
//   try {
//     const cookieHeader = req.headers.get("cookie");
//     const cookies = parseCookies(cookieHeader);
//     const token = cookies.token;

//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
//     }

//     const decoded = jwt.decode(token);

//     if (!decoded || !decoded.sub) {
//       return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
//     }

//     const userId = decoded.sub;

//     const body = await req.json();
//     const { id } = body;

//     if (!id) {
//       return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
//     }

//     // Delete campaign where user_id matches and id matches
//     const { error } = await supabase
//       .from("campaigns")
//       .delete()
//       .eq("id", id)
//       .eq("user_id", userId);

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json({ message: "Campaign deleted successfully" });
//   } catch (error) {
//     console.error("DELETE /campaigns error:", error);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }

// app/api/campaigns/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

// Initialize Supabase client using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL || (() => { throw new Error("SUPABASE_URL is not defined"); })(),
  process.env.SUPABASE_SERVICE_ROLE_KEY || (() => { throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined"); })() // only used on server
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

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return null;
  }
}

// GET: Fetch campaigns for logged-in user
export async function GET(req) {
  try {
    const cookies = parseCookies(req.headers.get("cookie"));
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .eq("user_id", decoded.sub);

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
    const cookies = parseCookies(req.headers.get("cookie"));
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const { keyword, message } = await req.json();
    if (!keyword || !message) {
      return NextResponse.json({ error: "Keyword and message are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("campaigns")
      .insert([
        {
          user_id: decoded.sub,
          campaign_name: keyword,
          message_template: message,
          status: "active",
        },
      ])
      .select();

    if (error || !data || data.length === 0) {
      return NextResponse.json({ error: error?.message || "Insert failed" }, { status: 500 });
    }

    return NextResponse.json({ message: "Campaign created successfully", data });
  } catch (error) {
    console.error("POST /campaigns error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// DELETE: Delete a campaign by ID (via query param)
export async function DELETE(req) {
  try {
    const cookies = parseCookies(req.headers.get("cookie"));
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized: Token missing" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id)
      .eq("user_id", decoded.sub);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("DELETE /campaigns error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
