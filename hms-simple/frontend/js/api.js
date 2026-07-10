// ============================================================
// Shared API helper used by every page.
// Change this if your backend runs somewhere other than 8080.
// ============================================================
const API_BASE_URL = "http://localhost:8080/api";

async function apiRequest(path, { method = "GET", body } = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = "Bearer " + token;

  const res = await fetch(API_BASE_URL + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
    throw new Error("Unauthorized");
  }

  let data = null;
  try { data = await res.json(); } catch (e) { /* no JSON body, that's fine */ }

  if (!res.ok) {
    const message = (data && data.message) || "Request failed";
    throw new Error(message);
  }
  return data;
}
