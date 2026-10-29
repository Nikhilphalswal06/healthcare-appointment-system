/* =========================================================
   MediCare+ dashboard.js — patient-dashboard.html
   ========================================================= */

function greetingForNow(){
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function initSidebarDrawer(){
  const toggle = document.getElementById("sidebarToggle");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.querySelector(".drawer-overlay");
  if (!toggle || !sidebar) return;
  toggle.addEventListener("click", () => {
    sidebar.classList.add("drawer-open");
    overlay && overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  });
  function close(){
    sidebar.classList.remove("drawer-open");
    overlay && overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  overlay && overlay.addEventListener("click", close);
  document.querySelectorAll(".sidebar a").forEach(a => a.addEventListener("click", close));
}

function initDashboardHome(){
  const root = document.getElementById("dashboardHome");
  if (!root) return;

  const user = getCurrentUser();
  document.getElementById("dashGreetingName").textContent = user ? user.name.split(" ")[0] : "Nikhil";
  document.getElementById("dashGreetingWord").textContent = greetingForNow();

  const appts = loadAppointments();
  const upcoming = appts.filter(a => a.status === "upcoming");
  const completed = appts.filter(a => a.status === "completed");
  const cancelled = appts.filter(a => a.status === "cancelled");

  document.getElementById("statUpcoming").textContent = upcoming.length;
  document.getElementById("statCompleted").textContent = completed.length;
  document.getElementById("statPending").textContent = upcoming.length;
  document.getElementById("statCancelled").textContent = cancelled.length;

  // Next upcoming appointment
  const nextAppt = upcoming[0];
  const upcomingWrap = document.getElementById("upcomingApptWrap");
  if (nextAppt){
    const doc = getDoctorById(nextAppt.doctorId) || {};
    upcomingWrap.innerHTML = `
      <div class="card upcoming-card">
        <img class="avatar" src="${doc.img || ''}" onerror="this.onerror=null;this.src='${initialsAvatar(doc.name || 'Doctor')}'" alt="${doc.name || ''}">
        <div class="ua-info">
          <span class="badge badge-teal mb-8">${nextAppt.type}</span>
          <h4>${doc.name || "Doctor"}</h4>
          <span class="text-muted">${doc.specialization || ""}</span>
          <div class="upcoming-meta">
            <span><i class="fa-regular fa-calendar"></i> ${formatDate(nextAppt.date)}</span>
            <span><i class="fa-regular fa-clock"></i> ${nextAppt.time}</span>
          </div>
        </div>
        <a href="appointments.html" class="btn btn-primary btn-sm">${nextAppt.type === "Video" ? "Join Call" : "View Details"}</a>
      </div>`;
  } else {
    upcomingWrap.innerHTML = `<div class="card state-block"><i class="fa-regular fa-calendar-plus"></i><h4>No upcoming appointments</h4><p>Book your next visit with a doctor you trust.</p><a href="doctors.html" class="btn btn-primary btn-sm">Find a Doctor</a></div>`;
  }

  // Recent appointments table
  const tbody = document.getElementById("recentApptTableBody");
  const recent = appts.slice(0, 5);
  tbody.innerHTML = recent.map(a => {
    const doc = getDoctorById(a.doctorId) || {};
    const statusBadge = a.status === "upcoming" ? "badge-teal" : a.status === "completed" ? "badge-success" : "badge-danger";
    return `<tr>
      <td><div class="table-doc"><img class="avatar" src="${doc.img || ''}" onerror="this.onerror=null;this.src='${initialsAvatar(doc.name || 'Doctor')}'" alt="">${doc.name || "Doctor"}</div></td>
      <td>${formatDate(a.date)}</td>
      <td>${a.time}</td>
      <td>${a.type}</td>
      <td><span class="badge ${statusBadge}">${a.status}</span></td>
      <td><div class="table-actions"><a href="appointments.html" class="btn btn-outline btn-sm">View</a></div></td>
    </tr>`;
  }).join("");

  // Recommended doctors
  const recWrap = document.getElementById("recommendedDoctorsGrid");
  const recommended = [...DOCTORS].sort((a,b) => b.rating - a.rating).slice(0, 3);
  recWrap.innerHTML = recommended.map(renderDoctorCard).join("");

  // Mini notifications
  const notifWrap = document.getElementById("dashNotifList");
  const notifs = getNotifications().slice(0, 4);
  const iconMap = { confirmed: ["fa-calendar-check","badge-success"], reminder: ["fa-bell","badge-amber"], prescription: ["fa-file-prescription","badge-teal"], cancelled: ["fa-calendar-xmark","badge-danger"], available: ["fa-user-doctor","badge-teal"] };
  notifWrap.innerHTML = notifs.map(n => {
    const [icon, cls] = iconMap[n.type] || ["fa-bell","badge-teal"];
    return `<div class="notif-mini"><div class="ni-icon ${cls}"><i class="fa-solid ${icon}"></i></div><div><p>${n.title}</p><span>${n.time}</span></div></div>`;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initSidebarDrawer();
  initDashboardHome();
});
