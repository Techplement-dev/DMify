"use client";
import cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, signup } from "src/lib/api"; // Custom API functions
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Eye icons for password toggle

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  // Handle auto-login via Supabase magic link
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        if (accessToken) {
          // Save token in cookies + localStorage
          cookies.set("token", accessToken, { secure: true, sameSite: "strict" });
          localStorage.setItem("token", accessToken);

          // Clean URL
          window.history.replaceState({}, document.title, "/login");

          // Redirect to welcome page
          router.push("/welcomePage");
        }
      }
    }
  }, []);

  // Handle signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const data = await signup(email, password);

    if (data.error) {
      setError(data.error);
    } else {
      setSuccess(data.message);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  // Handle login
const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  const data = await login(email, password);

  if (data.token) {
    cookies.set("token", data.token, { secure: true, sameSite: "strict" });
    localStorage.setItem("token", data.token);

    setSuccess("Login successful! Redirecting...");
    setTimeout(() => {
      router.push("/welcomePage");
    }, 1500);
  } else {
    setError(data.error || "Login failed");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-md perspective">
        <div className="bg-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl transform transition-transform duration-500 hover:rotate-y-6">
          <h1 className="text-3xl font-bold text-center text-white mb-6 mt-4">
            {isLogin ? "Login" : "Sign Up"}
          </h1>

          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-5 mt-8">
            {/* Email Input */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-400 flex items-center justify-center h-full cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password Input (Signup Only) */}
            {!isLogin && (
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute right-3 text-gray-400 flex items-center justify-center h-full cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <p className="mt-4 text-red-400 font-medium text-center">* {error}</p>
            )}
             {/* Signup Success Message */}
            {success && (
              <p className="mt-4 text-green-400 font-medium text-center">
                {success}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                isLogin ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {isLogin ? "Login" : "Sign Up"}
            </button>

            {/* Toggle Login/Signup */}
            <p className="mt-6 text-center text-gray-400 text-sm">
              {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
