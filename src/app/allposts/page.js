"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "../Header";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Engagement data for Pie Chart (likes & comments summary)
const engagementSummary = [
  { name: "Average Likes", value: 915 },
  { name: "Average Comments", value: 190 },
];

// Custom colors for chart slices
const COLORS = ["#3b82f6", "#ffffff"];

// Dummy Instagram posts data
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

export default function AllPosts() {
  const scrollRef = useRef(null); // Reference for scrollable posts container
  const [engagementData] = useState(engagementSummary); // Engagement chart data state

  // Scroll function for navigating posts left/right
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <>
      <Header /> {/* Reusable Header */}

      {/* Main page wrapper */}
      <div
        className="p-6 min-h-screen text-gray-200 relative"
        style={{ background: "#000" }}
      >
        <h2 className="text-2xl font-bold mb-6">All Posts</h2>

        {/* Posts carousel section */}
        <div className="relative">
          {/* Left Arrow Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow z-10 cursor-pointer"
            style={{ background: "#2b2b2b" }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-full shadow z-10 cursor-pointer"
            style={{ background: "#2b2b2b" }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Instruction Text */}
          <p className="text-center font-bold text-gray-400 mb-4">
            Select a post to enable Auto DM
          </p>

          {/* Scrollable posts list */}
          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-hide scroll-smooth"
          >
            {posts.map((post) => (
              <Link key={post.id} href={`/dashboard/${post.id}`}>
                {/* Individual post card */}
                <div
                  className="min-w-[300px] p-4 rounded-lg shadow hover:scale-105 transition"
                  style={{ background: "#2b2b2b" }}
                >
                  <Image
                    src={post.image}
                    alt={post.caption}
                    width={400}
                    height={300}
                    className="rounded-lg mb-3"
                  />
                  <p className="mb-2">{post.caption}</p>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>❤️ {post.likes} Likes</span>
                    <span>💬 {post.comments} Comments</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

       {/* Create new post button */}
        <div className="mt-8 text-center">
          <Link href="/create-post">
            <button className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition">
              Create New Post
            </button>
          </Link>
        </div>


        {/* Engagement Pie Chart Section */}
        <div
          className="mt-10 p-6 rounded-2xl shadow w-full max-w-3xl mx-auto"
          style={{ background: "#2b2b2b" }}
        >
          <h3 className="text-xl font-bold mb-4 text-center">
            📊 Engagement Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={engagementData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={140}
                fill="#ffffff"
                label
              >
                {/* Dynamic slice coloring */}
                {engagementData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              {/* Dark themed tooltip */}
              <Tooltip
                contentStyle={{ backgroundColor: "#333", color: "#fff" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
