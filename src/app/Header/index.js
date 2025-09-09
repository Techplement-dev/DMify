
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";

export default function Header() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  
const handleLogout = async () => {
  try {
    const res = await fetch("/api/auth/logout", { method: "POST" });
    if (res.ok) {
      // Redirect & hard reload to ensure cookie cleared
      window.location.href = "/login";
    }
  } catch (err) {
    console.error("Logout failed:", err);
  }
};



  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-gray-200 shadow-lg p-4 flex justify-between items-center backdrop-blur-md relative">
      <div className="text-2xl font-extrabold tracking-wide text-white hover:scale-105 transform transition">
        <Link href="/welcomePage">Auto DM</Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 text-lg">
        <Link
          href="/welcomePage"
          className="hover:text-indigo-400 font-semibold transition-colors duration-300"
        >
          Home
        </Link>
        <Link
          href="/create-campaign"
          className="hover:text-indigo-400 font-semibold transition-colors duration-300"
        >
          Create Campaign
        </Link>
        <Link
          href="/view-campaigns"
          className="hover:text-indigo-400 font-semibold transition-colors duration-300"
        >
          View Campaigns
        </Link>
      </nav>

      {/* Desktop Logout */}
      <button
        onClick={handleLogout}
        className="hidden md:block bg-red-500 hover:bg-red-400 shadow-md hover:shadow-red-500/40 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer transform transition-all duration-300 hover:scale-105"
      >
        Logout
      </button>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-3xl text-white"
      >
        {menuOpen ? <IoMdClose /> : <IoMdMenu />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 text-white shadow-lg flex flex-col items-center py-6 space-y-4 md:hidden z-50">
          <Link
            href="/welcomePage"
            className="hover:text-indigo-400 font-semibold transition-colors duration-300"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/create-campaign"
            className="hover:text-indigo-400 font-semibold transition-colors duration-300"
            onClick={() => setMenuOpen(false)}
          >
            Create Campaign
          </Link>
          <Link
            href="/view-campaigns"
            className="hover:text-indigo-400 font-semibold transition-colors duration-300"
            onClick={() => setMenuOpen(false)}
          >
            View Campaigns
          </Link>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="bg-red-500 hover:bg-red-400 shadow-md hover:shadow-red-500/40 px-4 py-2 rounded-lg text-white font-semibold cursor-pointer transform transition-all duration-300 hover:scale-105"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
