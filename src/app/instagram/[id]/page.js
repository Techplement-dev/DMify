"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../Header";

export default function InstagramPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Campaign fields (align with schema)
  const [campaignName, setCampaignName] = useState("");
  const [messageTemplate, setMessageTemplate] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonUrl, setButtonUrl] = useState("");

  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Fetch post details
  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/instagram/post/${id}`);
      const data = await res.json();

      if (res.ok) {
        const singlePost = data;
        setPost(singlePost);

        // Pre-fill campaign name from caption if available
        if (singlePost?.caption) {
          const captionText = singlePost.caption;

          // Try extracting keyword in quotes for campaign name
          const match = captionText.match(/["“”']([^"“”']+)["“”']/);
          if (match) setCampaignName(match[1]);

          // If caption contains a link → preload into button URL
          const linkMatch = captionText.match(/https?:\/\/\S+/);
          if (linkMatch) {
            setButtonUrl(linkMatch[0]);
          }
        }
      } else {
        setError(data.error || "Failed to fetch post");
      }
    } catch (err) {
      setError("Something went wrong while fetching post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  // Save campaign
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign_name: campaignName,
          message_template: messageTemplate,
          button_text: buttonText,
          button_url: buttonUrl,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Campaign saved successfully!");
      } else {
        setStatus("❌ " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      setStatus("❌ Failed to save campaign");
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col md:pb-8 pb-25 gap-10 pt-10 p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {loading && (
          <p className="text-gray-300 text-center">Loading post...</p>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}

        {post && (
          <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left side - Post details */}
            <div className="bg-gray-900/80 rounded-2xl p-6 shadow-2xl">
              {post.media_type === "IMAGE" && (
                <img
                  src={post.media_url}
                  alt="Instagram Post"
                  className="w-full h-80 object-cover rounded-lg mb-4"
                />
              )}
              <p className="text-gray-300 whitespace-pre-line">
                {post.caption}
              </p>
              <p className="text-xs text-gray-500 mt-3">
                {post.timestamp
                  ? new Date(post.timestamp).toLocaleString()
                  : "No timestamp available"}
              </p>
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:underline text-sm mt-2 block"
              >
                View on Instagram
              </a>
            </div>

            {/* Right side - Campaign Form */}
            <div className="flex flex-col bg-gray-900/80 rounded-2xl p-6 shadow-2xl">
              <button
                onClick={() => setShowForm((prev) => !prev)}
                className="w-full py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white transition-all"
              >
                {showForm ? "Close Form" : "Enable Auto DM"}
              </button>
              <p className="text-gray-400 text-sm mt-3 text-center">
                Create a campaign: when a user comments a keyword, they’ll
                receive your message with a button. After clicking the button,
                they’ll be redirected to your link.
              </p>

              {showForm && (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5 w-full">
                  <div>
                    <label className="block mb-1 text-sm text-gray-300">
                      Campaign Name
                    </label>
                    <input
                      type="text"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white"
                      placeholder="e.g. October Promo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm text-gray-300">
                      Message Template
                    </label>
                    <textarea
                      value={messageTemplate}
                      onChange={(e) => setMessageTemplate(e.target.value)}
                      className="w-full px-2 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white"
                      placeholder="This is the DM text."
                      rows="3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm text-gray-300">
                      Button Text
                    </label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white"
                      placeholder="e.g. Get Link"
                      required
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm text-gray-300">
                      Button URL
                    </label>
                    <input
                      type="url"
                      value={buttonUrl}
                      onChange={(e) => setButtonUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white"
                      placeholder="https://example.com"
                      required
                    />
                  </div>

                  {status && (
                    <p
                      className={`mt-3 text-sm text-center ${
                        status.includes("❌")
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {status}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white"
                  >
                    {status === "Saving..." ? "Saving..." : "Save Campaign"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
