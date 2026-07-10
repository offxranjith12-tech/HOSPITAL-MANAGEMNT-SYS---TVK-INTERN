// ============================================================
// Auth guard + shared layout helpers used by every protected page.
// Include this AFTER api.js on every page except login.html / register.html.
// ============================================================

function getUser() {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
}

// Call this at the top of every protected page.
// Redirects to login.html if not signed in.
function requireAuth() {
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// Fills in the shared topbar (username/roles + logout button).
// Expects elements with ids "userInfo" and "logoutBtn" to exist on the page.
function initTopbar(user) {
  const info = document.getElementById("userInfo");
  if (info) {
    info.textContent = `Signed in as ${user.username} (${(user.roles || []).join(", ")})`;
  }
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}

// Highlights the active sidebar link based on the current page filename.
function highlightActiveNav() {
  const current = window.location.pathname.split("/").pop();
  document.querySelectorAll(".sidebar .nav-link").forEach((link) => {
    if (link.getAttribute("href") === current) {
      link.classList.add("active");
    }
  });
}

function badgeClass(status) {
  return "badge badge-" + (status || "").toLowerCase();
}
