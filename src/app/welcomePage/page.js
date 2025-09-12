"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../Header";

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // ⏳ Fake loading effect (you can replace with real auth check later)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // 1.2s
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <p className="text-white text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <>
    <Header />

     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-lg perspective">
        <div className="bg-gray-900/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl transform transition-transform duration-500 hover:rotate-y-6">
          
          {/* Heading */}
          <h1 className="text-4xl font-extrabold text-center text-white mb-4 tracking-wide">
            Welcome!
          </h1>
          <p className="text-gray-300 text-center mb-8 text-lg">
            Manage your campaigns with ease. Let’s get started
          </p>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={() => router.push("/create-campaign")}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 
              shadow-lg hover:shadow-indigo-500/40 transform transition-all duration-300 hover:scale-105 cursor-pointer"
            >
            Create Campaign
            </button>

            <button
              onClick={() => router.push("/view-campaigns")}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-gray-700 hover:bg-gray-600 
              shadow-lg hover:shadow-gray-500/40 transform transition-all duration-300 hover:scale-105 cursor-pointer"
            >
            View Campaigns
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
   
  );
}
