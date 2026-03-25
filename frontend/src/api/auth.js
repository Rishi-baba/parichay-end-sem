const BASE_URL = "http://localhost:5000/api/auth";

/**
 * Internal helper — sends a request and safely parses the response.
 * Handles both JSON and plain-text responses to avoid "Unexpected token" errors.
 * Throws an Error with a readable message on non-2xx status.
 */
async function request(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    credentials: "include", // always send/receive cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  // Read as text first — avoids "Unexpected token" if server returns HTML/plain-text
  const text = await response.text();

  // Safely attempt JSON parse
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    // Server returned non-JSON (e.g. HTML error page, plain-text)
    if (!response.ok) {
      throw new Error(`Server error (${response.status}): ${text.slice(0, 200)}`);
    }
    throw new Error("Unexpected response format from server");
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

/**
 * Log in an existing user.
 * @param {{ email: string, password: string }} data
 */
export async function loginUser(data) {
  return request("/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string }} data
 */
export async function registerUser(data) {
  return request("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Log out the current user (clears httpOnly cookies server-side).
 */
export async function logoutUser() {
  return request("/logout", {
    method: "POST",
  });
}

/**
 * Fetch the authenticated user's profile.
 * Requires a valid access token cookie to be present.
 */
export async function getProfile() {
  return request("/profile", {
    method: "GET",
  });
}
