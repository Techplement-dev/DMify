/**
 * API helper functions
 * - signup: calls POST /api/auth/signup
 * - login: calls POST /api/auth/login
 * - getProfile: calls GET /api/auth/profile with Bearer token
 */

// Signup request
export async function signup(email, password) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return res.json(); // returns { message, user } OR { error }
}

// Login request
export async function login(email, password) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json(); // returns { token, user } or error
}

// Get profile request
export async function getProfile(token) {
  const res = await fetch("/api/auth/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json(); // returns { id, email } or error
}
