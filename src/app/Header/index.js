"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "src/lib/supabaseClient";

export default function Header() {
  const router = useRouter();

  // Handle Logout → Sign out from Supabase and redirect to login page
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <header className="bg-black text-gray-200 shadow-md p-4 flex justify-between items-center">
      {/* Logo / Title */}
      <div className="text-2xl font-bold">
        <Link href="/home">Auto DM</Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex gap-6">
        <Link href="/home" className="hover:text-green-400 font-bold">Home</Link>
        <Link href="/allposts" className="hover:text-green-400 font-bold">All Posts</Link>
        <Link href="/dashboard/1" className="hover:text-green-400 font-bold">Dashboard</Link>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-800 transition text-white font-semibold cursor-pointer"
      >
        Logout
      </button>
    </header>
  );
}
