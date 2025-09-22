"use client";
import { useEffect, useState } from "react";

export default function InstagramFeed() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/instagram?code=YOUR_OAUTH_CODE"); 
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error fetching Instagram data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading Instagram feed...</p>;
  if (!data || data.error) return <p className="text-center mt-10 text-red-500">Error loading feed.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={data.instagram.profile_picture_url}
          alt={data.instagram.username}
          className="w-16 h-16 rounded-full border"
        />
        <h2 className="text-2xl font-bold">{data.instagram.username}</h2>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.media.map((post) => (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="relative w-full h-64 bg-gray-100 overflow-hidden rounded-lg shadow">
              {post.media_type === "IMAGE" || post.media_type === "CAROUSEL_ALBUM" ? (
                <img
                  src={post.media_url}
                  alt={post.caption || "Instagram post"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : post.media_type === "VIDEO" ? (
                <video
                  src={post.media_url}
                  className="w-full h-full object-cover"
                  controls
                />
              ) : null}
            </div>
            <p className="mt-2 text-sm text-gray-700 truncate">
              {post.caption || "No caption"}
            </p>
            <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleDateString()}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
