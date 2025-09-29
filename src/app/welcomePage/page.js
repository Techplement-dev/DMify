"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Fake loading effect (you can replace with real auth check later)
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
  <div className="w-full max-w-lg perspective">
    <div className="bg-gray-900/80 backdrop-blur-md p-10 rounded-2xl shadow-2xl transform transition-transform duration-500 hover:rotate-y-6">
      
      <h1 className="text-4xl font-extrabold text-center text-white mb-3 tracking-wide drop-shadow-md">
        Welcome!
      </h1>

      <p className="text-center text-gray-400 mb-8 leading-relaxed">
        Connect your Instagram account and start creating campaigns directly 
        from your posts.
      </p>

      <div className="space-y-4">
        <button
          onClick={() => router.push("/instagram")}
          className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 
          shadow-lg hover:shadow-indigo-500/40 transform transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          Connect Instagram
        </button>
      </div>
    </div>
  </div>
</div>
    </>
   
  );
}
