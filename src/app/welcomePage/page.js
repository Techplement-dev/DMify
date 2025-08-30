"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "src/lib/supabaseClient";

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Not logged in, redirect to login page
        router.push("/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleConnect = () => {
    // Here you can later trigger Instagram OAuth flow
    // For now, just redirect to /home
    router.push("/home");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white bg-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center p-6">
      <h1 className="text-3xl font-bold mb-4 text-white">Welcome Client</h1>
      <p className="text-gray-400 mb-6 max-w-md">
        This is your Auto DM tool. With this, you can set up custom rules to 
        automatically reply to Instagram messages with ease.
      </p>
      <button
        onClick={handleConnect}
        className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition cursor-pointer"
      >
        Connect to Instagram
      </button>
    </div>
  );
}
