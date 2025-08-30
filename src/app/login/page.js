"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "src/lib/supabaseClient";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Handle login with Supabase
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(`* ${error.message}`);
    } else {
      setMessage("");
      router.push("/welcomePage");
    }
  };

  // Handle signup with Supabase
  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMessage(`* ${error.message}`);
    } else {
      setMessage("* Check your email for verification link!");
      setIsLogin(true);
    }
  };

  const toggleAuth = () => {
    setMessage("");
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      {/* Container with 3D flip effect */}
      <div className="relative w-96 h-96 perspective">
        <div
          className={`absolute w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
            isLogin ? "" : "rotate-y-180"
          }`}
        >
          {/* Login Card */}
          <div className="absolute w-full h-full bg-gray-900 text-white p-6 rounded-xl shadow-lg [backface-visibility:hidden] flex flex-col justify-center items-center border border-gray-700">
            <h2 className="text-3xl font-bold underline mb-6">Login</h2>

            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* Inline Message */}
            {message && isLogin && (
              <p className="text-red-400 text-sm mb-2">{message}</p>
            )}

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-green-600 hover:bg-green-500 p-2 rounded mb-4 cursor-pointer transition"
            >
              Login
            </button>

            {/* Switch to Signup */}
            <p className="text-gray-400">
              Don’t have an account?{" "}
              <button
                onClick={toggleAuth}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Signup Card */}
          <div className="absolute w-full h-full bg-gray-900 text-white p-6 rounded-xl shadow-lg rotate-y-180 [backface-visibility:hidden] flex flex-col justify-center items-center border border-gray-700">
            <h2 className="text-3xl font-bold underline mb-6">Signup</h2>

            {/* Email Input */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Inline Message */}
            {message && !isLogin && (
              <p className="text-red-400 text-sm mb-2">{message}</p>
            )}

            {/* Signup Button */}
            <button
              onClick={handleSignup}
              className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded mb-4 cursor-pointer transition"
            >
              Sign Up
            </button>

            {/* Switch to Login */}
            <p className="text-gray-400">
              Already have an account?{" "}
              <button
                onClick={toggleAuth}
                className="text-blue-400 hover:underline cursor-pointer"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
