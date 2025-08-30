"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "@/Header";

export default function DashboardPage() {
  const { id } = useParams(); // Grab [id] from URL
  const [hover, setHover] = useState(false);

  // Dummy posts (same as HomePage)
  const posts = [
    {
      id: 1,
      image: "/images/post1.jpg",
      caption: "Experimenting with automated direct messages",
      likes: 120,
      comments: 15,
      instaUrl: "https://instagram.com/p/POST1",
    },
    {
      id: 2,
      image: "/images/post2.jpg",
      caption: "Learning and exploring Next.js concepts",
      likes: 90,
      comments: 10,
      instaUrl: "https://instagram.com/p/POST2",
    },
    {
      id: 3,
      image: "/images/post3.jpg",
      caption: "Documenting the journey of building a new tool",
      likes: 150,
      comments: 20,
      instaUrl: "https://instagram.com/p/POST3",
    },
    {
      id: 4,
      image: "/images/post4.jpg",
      caption: "Captured a beautiful sunset over the horizon",
      likes: 120,
      comments: 30,
      instaUrl: "https://instagram.com/p/POST4",
    },
    {
      id: 5,
      image: "/images/post5.jpg",
      caption: "Weekend mountain trek and fresh air experience",
      likes: 95,
      comments: 18,
      instaUrl: "https://instagram.com/p/POST5",
    },
    {
      id: 6,
      image: "/images/post6.jpg",
      caption: "Enjoying a calm evening with a hot coffee",
      likes: 60,
      comments: 10,
      instaUrl: "https://instagram.com/p/POST6",
    },
    {
      id: 7,
      image: "/images/post7.jpg",
      caption: "The city skyline glowing under the night lights",
      likes: 200,
      comments: 40,
      instaUrl: "https://instagram.com/p/POST7",
    },
  ];

  // Find post by ID
  const post = posts.find((p) => p.id === parseInt(id));

  // Dummy tracking data
  const tracking = {
    sent: 45,
    pending: 5,
    failed: 2,
    lastRun: "2025-08-26 14:35",
  };

  // If post not found
  if (!post) {
    return (
      <div
        className="min-h-screen text-white flex items-center justify-center"
        style={{ background: "#2b2b2b" }}
      >
        <h2 className="text-xl">⚠️ Post not found</h2>
      </div>
    );
  }

  return (
    <>
      <Header />

      {/* Page Wrapper */}
      <div
        className="min-h-screen text-white p-6"
        style={{ background: "#000" }}
      >
        {/* Back button */}
        <Link href="/home" className="text-blue-400 hover:underline">
          ← Back to Home
        </Link>

        {/* Row Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Post Details Card */}
          <div
            className="p-6 rounded-lg shadow"
            style={{ background: "#2b2b2b" }}
          >
            <div
              className="relative inline-block w-full"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {/* Post Image */}
              <Image
                src={post.image}
                alt={post.caption}
                width={500}
                height={250}
                className="rounded-lg mb-4 w-full"
              />

              {/* Hover Button Overlay */}
              {hover && (
                <Link
                  href={post.instaUrl}
                  target="_blank"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-lg transition"
                >
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
                    View Post on Instagram
                  </span>
                </Link>
              )}
            </div>

            {/* Post Caption */}
            <h2 className="text-2xl font-bold mb-2">{post.caption}</h2>

            {/* Likes + Comments */}
            <div className="flex gap-6 text-gray-400">
              <span>❤️ {post.likes} Likes</span>
              <span>💬 {post.comments} Comments</span>
            </div>
          </div>

          {/* Automation Control Card */}
          <div
            className="p-6 rounded-lg shadow"
            style={{ background: "#2b2b2b" }}
          >
            <h3 className="text-lg font-semibold mb-2">Automation Control</h3>

            {/* Enable Auto DM */}
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-green-400" />
              Enable Auto DM
            </label>

            {/* Message Input */}
            <textarea
              className="w-full text-white p-2 rounded mt-3"
              style={{ background: "#3a3a3a" }}
              defaultValue="Thanks for following!!"
            />

            {/* Save Button */}
            <button className="mt-3 bg-green-500 px-4 py-2 rounded hover:bg-green-600">
              Save
            </button>

            {/* Tracking Section */}
            <div
              className="mt-6 border-t pt-4"
              style={{ borderColor: "#3a3a3a" }}
            >
              <h4 className="text-md font-semibold mb-2">📊 Tracking</h4>
              <div className="grid grid-cols-2 gap-4 text-gray-300">
                <div className="p-3 rounded" style={{ background: "#333" }}>
                  ✅ Sent:{" "}
                  <span className="font-bold text-green-400">
                    {tracking.sent}
                  </span>
                </div>
                <div className="p-3 rounded" style={{ background: "#333" }}>
                  ⏳ Pending:{" "}
                  <span className="font-bold text-yellow-400">
                    {tracking.pending}
                  </span>
                </div>
                <div className="p-3 rounded" style={{ background: "#333" }}>
                  ❌ Failed:{" "}
                  <span className="font-bold text-red-400">
                    {tracking.failed}
                  </span>
                </div>
                <div className="p-3 rounded" style={{ background: "#333" }}>
                  🕒 Last Run:{" "}
                  <span className="font-bold">{tracking.lastRun}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
