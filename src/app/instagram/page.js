"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../Header";
import { useRouter } from "next/navigation"; // ✅ Import useRouter

export default function InstagramPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const router = useRouter(); // ✅ Initialize router

  // Fetch posts from API route
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/instagram/posts");
      const data = await res.json();

      if (res.ok) {
        setPosts(data.data || []);
      } else {
        setError(data.error || "Failed to fetch Instagram posts");
      }
    } catch (err) {
      setError("Something went wrong while fetching Instagram posts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/instagram/profile");
      const data = await res.json();

      if (res.ok) {
        setUser(data);
      } else {
        setError(data.error || "Failed to fetch Instagram profile");
      }
    } catch (err) {
      setError("Something went wrong while fetching Instagram profile");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  // Function: make URLs in caption clickable
  const formatCaption = (caption) => {
    if (!caption) return null;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = caption.split(urlRegex);

    return parts.map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };

  return (
    <>
      <Header />
      <div className="flex z-0 flex-col md:pb-8 pb-25 gap-10 p-6 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex justify-center p-6 w-full">
          <div className="w-full max-w-5xl space-y-10">
            <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center space-y-4">
              <h1 className="text-3xl font-bold text-white">Instagram Profile</h1>

              {user && (
                <div className="text-gray-300">
                  <p className="text-lg">
                    <span className="font-semibold text-indigo-400">User:</span>{" "}
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-400">
                    <span className="font-semibold text-indigo-400">ID:</span>{" "}
                    {user.id}
                  </p>
                </div>
              )}
            </div>

            {loading && (
              <p className="text-gray-300 text-center bg-gray-800/50 rounded-lg py-2">
                Loading posts...
              </p>
            )}
            {error && (
              <p className="text-red-400 text-center bg-red-900/40 rounded-lg py-2">
                {error}
              </p>
            )}

            {!loading && posts.length > 0 ? (
              <>
              <p className="text-center text-gray-400 mb-8">Select a post to enable AutoDM.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 cursor-pointer">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/instagram/${post.id}`)} // ✅ Now works
                    className="bg-gray-800/80 border border-gray-700 rounded-xl shadow-md hover:shadow-indigo-500/40 transform transition duration-300 hover:scale-105 overflow-hidden flex flex-col cursor-pointer"
                  >
                    {/* Post Image */}
                    {post.media_type === "IMAGE" && (
                      <img
                        src={post.media_url}
                        alt="Instagram Post"
                        className="w-full h-64 object-cover"
                      />
                    )}

                    {/* Post Content */}
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      {/* Caption with clickable URLs */}
                      <p className="text-gray-300 text-sm mb-3 whitespace-pre-line">
                        {formatCaption(post.caption)}
                      </p>

                      {/* Post time */}
                      <p className="text-xs text-gray-500 mt-3">
                        {new Date(post.timestamp).toLocaleString()}
                      </p>

                      {/* Instagram link */}
                      <p className="text-sm mt-2 text-indigo-400 hover:underline">
                        <a
                          href={post.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View on Instagram
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              </>
                
            ) : (
              !loading && (
                <p className="text-gray-400 text-center">
                  No Instagram posts found.
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
