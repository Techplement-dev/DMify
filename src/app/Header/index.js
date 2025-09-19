"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";

export default function Header() {
  const pathname = usePathname(); // <- usePathname instead of router.pathname
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
  { href: "/welcomePage", label: "Home" },
  { href: "/create-view-campaign", label: "Create Campaign" },
  { href: "/analytics", label: "Analytics" },
];


  return (
    <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-gray-200 shadow-lg p-4 flex justify-between items-center backdrop-blur-md relative">
      <div className="text-2xl font-extrabold tracking-wide text-white hover:scale-105 transform transition">
        <Link href="/welcomePage">Auto DM</Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 text-lg">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-semibold transition-colors duration-300 hover:text-indigo-400 ${
              pathname === link.href ? "text-indigo-400 underline" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-semibold transition-colors duration-300 hover:text-indigo-400 ${
                pathname === link.href ? "text-indigo-400 underline" : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
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
