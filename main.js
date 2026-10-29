/* =========================================================
   MediCare+ main.js
   Shared utilities loaded on every page: navbar scroll state,
   mobile drawer, toast system, modal helpers, theme toggle,
   and the logged-in/guest navbar state.
   ========================================================= */

/* ---------- Theme (light/dark) ---------- */
(function initTheme(){
  const saved = localStorage.getItem("mc_theme");
  if (saved === "dark") document.documentElement.setAttribute("data-theme", "dark");
})();

function toggleTheme(){
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  if (isDark){
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("mc_theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("mc_theme", "dark");
  }
  document.querySelectorAll(".theme-toggle i").forEach(i=>{
    i.className = document.documentElement.getAttribute("data-theme") === "dark" ? "fa-solid fa-sun" : "fa-regular fa-moon";
  });
}

/* ---------- Toasts ---------- */
function ensureToastStack(){
  let stack = document.querySelector(".toast-stack");
  if (!stack){
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  return stack;
}
const TOAST_ICONS = { success: "fa-circle-check", error: "fa-circle-exclamation", warning: "fa-triangle-exclamation", info: "fa-circle-info" };
function showToast(message, type = "info", duration = 4000){
  const stack = ensureToastStack();
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fa-solid ${TOAST_ICONS[type] || TOAST_ICONS.info}"></i><span>${message}</span><button class="toast-close" aria-label="Dismiss"><i class="fa-solid fa-xmark"></i></button>`;
  el.querySelector(".toast-close").addEventListener("click", () => dismissToast(el));
  stack.appendChild(el);
  setTimeout(() => dismissToast(el), duration);
}
function dismissToast(el){
  if (!el || el.classList.contains("leaving")) return;
  el.classList.add("leaving");
  setTimeout(() => el.remove(), 220);
}

/* ---------- Modals ---------- */
function openModal(id){
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal(id){
  const overlay = document.getElementById(id);
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.style.overflow = "";
}
document.addEventListener("click", (e) => {
  if (e.target.classList && e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("open");
    document.body.style.overflow = "";
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape"){
    document.querySelectorAll(".modal-overlay.open").forEach(m => { m.classList.remove("open"); });
    document.body.style.overflow = "";
  }
});

/* ---------- Navbar scroll + mobile drawer ---------- */
function initNavbar(){
  const navbar = document.querySelector(".navbar");
  if (navbar){
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 8);
    }, { passive: true });
  }
  const hamburger = document.querySelector(".hamburger");
  const drawer = document.querySelector(".mobile-drawer");
  const overlay = document.querySelector(".drawer-overlay");
  function closeDrawer(){
    hamburger && hamburger.classList.remove("active");
    drawer && drawer.classList.remove("open");
    overlay && overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  function openDrawer(){
    hamburger && hamburger.classList.add("active");
    drawer && drawer.classList.add("open");
    overlay && overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  if (hamburger){
    hamburger.addEventListener("click", () => {
      hamburger.classList.contains("active") ? closeDrawer() : openDrawer();
    });
  }
  overlay && overlay.addEventListener("click", closeDrawer);
  document.querySelectorAll(".mobile-drawer a").forEach(a => a.addEventListener("click", closeDrawer));

  // Mark active link based on current page
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-drawer a, .side-nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === current) a.classList.add("active");
  });
}

/* ---------- Auth-state navbar chip (demo only, localStorage) ---------- */
function getCurrentUser(){
  try { return JSON.parse(localStorage.getItem("mc_user")); } catch { return null; }
}
function renderAuthState(){
  const user = getCurrentUser();
  document.querySelectorAll("[data-auth='guest']").forEach(el => el.style.display = user ? "none" : "");
  document.querySelectorAll("[data-auth='user']").forEach(el => el.style.display = user ? "" : "none");
  if (user){
    document.querySelectorAll(".user-chip-name").forEach(el => el.textContent = user.name.split(" ")[0]);
    document.querySelectorAll(".user-chip-avatar").forEach(el => el.src = user.avatar || initialsAvatar(user.name));
  }
}
function logoutUser(){
  localStorage.removeItem("mc_user");
  showToast("You have been logged out.", "success");
  setTimeout(() => { window.location.href = "index.html"; }, 700);
}
document.querySelectorAll(".logout-trigger").forEach(btn => btn.addEventListener("click", (e) => { e.preventDefault(); logoutUser(); }));

/* ---------- Notification bell dot (based on unread demo notifications) ---------- */
function refreshNotifBadge(){
  const dots = document.querySelectorAll(".notif-dot");
  if (typeof NOTIFICATIONS_SEED === "undefined") return;
  let stored;
  try { stored = JSON.parse(localStorage.getItem("mc_notifications")); } catch {}
  const list = stored || NOTIFICATIONS_SEED;
  const hasUnread = list.some(n => !n.read);
  dots.forEach(d => d.style.display = hasUnread ? "block" : "none");
}

/* ---------- Footer year ---------- */
document.querySelectorAll(".current-year").forEach(el => el.textContent = new Date().getFullYear());

/* ---------- Init on every page ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  renderAuthState();
  refreshNotifBadge();
  document.querySelectorAll(".logout-trigger").forEach(btn => btn.addEventListener("click", (e) => { e.preventDefault(); logoutUser(); }));
  document.querySelectorAll(".theme-toggle").forEach(btn => btn.addEventListener("click", toggleTheme));
  if (document.documentElement.getAttribute("data-theme") === "dark"){
    document.querySelectorAll(".theme-toggle i").forEach(i => i.className = "fa-solid fa-sun");
  }
});
