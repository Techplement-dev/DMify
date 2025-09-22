"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "../../Header";

export default function InstagramPostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false); // 👈 controls form visibility

  // ✅ Fetch single post details
  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/instagram/posts?id=${id}`);
      const data = await res.json();

      if (res.ok) {
        const singlePost = data.data ? data.data[0] : data;
        setPost(singlePost);

        // ✅ Extract keyword inside quotes ("link", “link”, etc.)
        if (singlePost?.caption) {
          const captionText = singlePost.caption;

          const match = captionText.match(/["“”']([^"“”']+)["“”']/);
          if (match) setKeyword(match[1]);

          // ✅ Extract http/https link
          const linkMatch = captionText.match(/https?:\/\/\S+/);
          if (linkMatch) {
            setMessage(
              `Hi! Thanks for engaging with our post. Here’s the link: ${linkMatch[0]}`
            );
          } else {
            setMessage(""); // leave blank if no link found
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

  // ✅ Handle campaign save
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, message }),
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
      <div className="flex flex-col gap-10 pt-20 p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {loading && <p className="text-gray-300 text-center">Loading post...</p>}
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
              <p className="text-gray-300 whitespace-pre-line">{post.caption}</p>
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

            {/* Right side - Auto DM Section */}
            <div className="flex flex-col bg-gray-900/80 rounded-2xl p-6 shadow-2xl">
              <button
                onClick={() => setShowForm((prev) => !prev)}
                className="w-full py-3 px-4 font-semibold rounded-lg shadow-md bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white transition-all"
              >
                {showForm ? "Close Form" : "Enable Auto DM"}
              </button>
              <p className="text-gray-400 text-sm mt-3 text-center">
                If you enable this option, the system will automatically send
                the respective link or message to the commentor's DM.
              </p>

              {/* Campaign form (only visible after clicking button) */}
              {showForm && (
                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-5 w-full"
                >
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white"
                    placeholder="Keyword"
                    required
                  />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-2 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white"
                    placeholder="Message"
                    rows="4"
                  />
                  {status && (
                    <p className="mt-3 text-sm text-center text-green-500">
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
