// pages/api/instagram.js
export default async function handler(req, res) {
  try {
    const { code } = req.query; // OAuth "code" returned from FB Login redirect

    if (!code) {
      return res.status(400).json({ error: "Missing code from Facebook OAuth" });
    }

    // Step 1. Exchange code for short-lived token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v23.0/oauth/access_token?client_id=${process.env.FB_APP_ID}&redirect_uri=${process.env.FB_REDIRECT_URI}&client_secret=${process.env.FB_APP_SECRET}&code=${code}`
    );

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return res.status(400).json({ error: tokenData.error });
    }

    const shortLivedToken = tokenData.access_token;

    // Step 2. Exchange short-lived token for long-lived token
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.FB_APP_ID}&client_secret=${process.env.FB_APP_SECRET}&fb_exchange_token=${shortLivedToken}`
    );

    const longTokenData = await longTokenRes.json();
    const longLivedToken = longTokenData.access_token;

    // Step 3. Get user’s pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v23.0/me/accounts?access_token=${longLivedToken}`
    );
    const pagesData = await pagesRes.json();

    if (!pagesData.data || pagesData.data.length === 0) {
      return res.status(400).json({ error: "No Facebook Pages found." });
    }

    // Take first page
    const page = pagesData.data[0];
    const pageToken = page.access_token;
    const pageId = page.id;

    // Step 4. Get connected IG account
    const igRes = await fetch(
      `https://graph.facebook.com/v23.0/${pageId}?fields=connected_instagram_account&access_token=${pageToken}`
    );
    const igData = await igRes.json();

    if (!igData.connected_instagram_account) {
      return res.status(400).json({ error: "No Instagram account connected." });
    }

    const igId = igData.connected_instagram_account.id;

    // Step 5. Get IG details
    const igUserRes = await fetch(
      `https://graph.facebook.com/v23.0/${igId}?fields=username,profile_picture_url&access_token=${pageToken}`
    );
    const igUserData = await igUserRes.json();

    return res.status(200).json({
      page: {
        id: pageId,
        name: page.name,
      },
      instagram: igUserData,
      tokens: {
        longLivedToken,
        pageToken,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
