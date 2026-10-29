/* =========================================================
   MediCare+ notifications.js
   Storage helpers used by dashboard.js + navbar badge, and the
   full notifications.html page.
   ========================================================= */

function getNotifications(){
  let stored;
  try { stored = JSON.parse(localStorage.getItem("mc_notifications")); } catch {}
  return stored || NOTIFICATIONS_SEED;
}
function saveNotifications(list){
  localStorage.setItem("mc_notifications", JSON.stringify(list));
}

const NOTIF_ICON_MAP = {
  confirmed: ["fa-calendar-check", "badge-success"],
  reminder: ["fa-bell", "badge-amber"],
  prescription: ["fa-file-prescription", "badge-teal"],
  cancelled: ["fa-calendar-xmark", "badge-danger"],
  available: ["fa-user-doctor", "badge-teal"]
};

function initNotificationsPage(){
  const root = document.getElementById("notificationsList");
  if (!root) return;

  function render(){
    const notifs = getNotifications();
    document.getElementById("unreadCount").textContent = notifs.filter(n => !n.read).length;

    if (!notifs.length){
      root.innerHTML = `<div class="state-block"><i class="fa-regular fa-bell-slash"></i><h4>You're all caught up</h4><p>No notifications right now.</p></div>`;
      return;
    }
    root.innerHTML = notifs.map(n => {
      const [icon, cls] = NOTIF_ICON_MAP[n.type] || ["fa-bell", "badge-teal"];
      return `<div class="notif-page-item ${n.read ? "" : "unread"}">
        <div class="ni-icon ${cls}"><i class="fa-solid ${icon}"></i></div>
        <div style="flex:1;">
          <h4 style="margin-bottom:2px;">${n.title}</h4>
          <p class="text-muted" style="margin:0 0 6px;">${n.message}</p>
          <span class="text-muted" style="font-size:.76rem;">${n.time}</span>
        </div>
        <div class="np-actions">
          ${!n.read ? `<button class="btn-icon" title="Mark as read" data-action="read" data-id="${n.id}"><i class="fa-solid fa-check"></i></button>` : ""}
          <button class="btn-icon" title="Delete" data-action="delete" data-id="${n.id}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`;
    }).join("");

    root.querySelectorAll("[data-action='read']").forEach(btn => btn.addEventListener("click", () => {
      const list = getNotifications().map(n => n.id === btn.dataset.id ? { ...n, read: true } : n);
      saveNotifications(list); render(); refreshNotifBadge();
    }));
    root.querySelectorAll("[data-action='delete']").forEach(btn => btn.addEventListener("click", () => {
      const list = getNotifications().filter(n => n.id !== btn.dataset.id);
      saveNotifications(list); render(); refreshNotifBadge();
      showToast("Notification deleted.", "success");
    }));
  }

  document.getElementById("markAllReadBtn").addEventListener("click", () => {
    saveNotifications(getNotifications().map(n => ({ ...n, read: true })));
    render(); refreshNotifBadge();
    showToast("All notifications marked as read.", "success");
  });
  document.getElementById("clearAllBtn").addEventListener("click", () => {
    saveNotifications([]);
    render(); refreshNotifBadge();
    showToast("All notifications cleared.", "success");
  });

  render();
}

document.addEventListener("DOMContentLoaded", initNotificationsPage);
