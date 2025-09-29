export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify({ error: "Missing code from Facebook" }), {
      status: 400,
    });
  }

  // Exchange code for access token
  const params = new URLSearchParams({
    client_id: process.env.FB_APP_ID,
    client_secret: process.env.FB_APP_SECRET,
    redirect_uri: process.env.FB_REDIRECT_URI, // must match exactly
    code,
  });

  const tokenRes = await fetch(
    `https://graph.facebook.com/v17.0/oauth/access_token?${params.toString()}`
  );
  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return new Response(JSON.stringify({ error: tokenData.error }), { status: 400 });
  }

  // Save or return the access token
  return new Response(JSON.stringify({ access_token: tokenData.access_token }), {
    status: 200,
  });
}
