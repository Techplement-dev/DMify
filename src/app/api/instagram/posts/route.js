// src/app/api/instagram/posts/route.js

export async function GET() {
  const IG_BUSINESS_ACCOUNT_ID = process.env.IG_BUSINESS_ACCOUNT_ID;
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v23.0/${IG_BUSINESS_ACCOUNT_ID}/media?fields=id,caption,media_url,permalink,media_type,timestamp&access_token=${PAGE_ACCESS_TOKEN}`
    );

    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// CREATE a new Instagram Post
export async function POST(req) {
  const IG_BUSINESS_ACCOUNT_ID = "17841476675587516";
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

  try {
    const body = await req.json();
    const { imageUrl, caption } = body;

    if (!imageUrl || !caption) {
      return new Response(
        JSON.stringify({ error: "imageUrl and caption are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Step 1: Create container
    const containerRes = await fetch(
      `https://graph.facebook.com/v23.0/${IG_BUSINESS_ACCOUNT_ID}/media?image_url=${encodeURIComponent(
        imageUrl
      )}&caption=${encodeURIComponent(caption)}&access_token=${PAGE_ACCESS_TOKEN}`,
      { method: "POST" }
    );

    const containerData = await containerRes.json();

    if (containerData.error) {
      return new Response(JSON.stringify({ error: containerData.error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const creationId = containerData.id;

    // Step 2: Publish container
    const publishRes = await fetch(
      `https://graph.facebook.com/v23.0/${IG_BUSINESS_ACCOUNT_ID}/media_publish?creation_id=${creationId}&access_token=${PAGE_ACCESS_TOKEN}`,
      { method: "POST" }
    );

    const publishData = await publishRes.json();

    if (publishData.error) {
      return new Response(JSON.stringify({ error: publishData.error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, postId: publishData.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
