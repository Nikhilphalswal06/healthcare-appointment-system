/* =========================================================
   MediCare+ profile.js — profile.html
   ========================================================= */

const DEFAULT_PROFILE = {
  name: "Nikhil Rawat", email: "nikhil.rawat@example.com", phone: "9876543210",
  dob: "1994-03-12", gender: "Male", address: "24 Rajpur Road, Dehradun, Uttarakhand"
};

function loadProfile(){
  const user = getCurrentUser();
  return { ...DEFAULT_PROFILE, ...(user || {}) };
}

function initProfilePage(){
  const root = document.getElementById("profileRoot");
  if (!root) return;

  function render(){
    const p = loadProfile();
    document.getElementById("profileAvatar").src = p.avatar || initialsAvatar(p.name);
    document.getElementById("profileName").textContent = p.name;
    document.getElementById("profileEmailSub").textContent = p.email;
    document.getElementById("profilePhoneSub").textContent = p.phone;

    document.getElementById("detailFullName").textContent = p.name;
    document.getElementById("detailEmail").textContent = p.email;
    document.getElementById("detailPhone").textContent = p.phone;
    document.getElementById("detailDob").textContent = p.dob ? new Date(p.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—";
    document.getElementById("detailGender").textContent = p.gender || "—";
    document.getElementById("detailAddress").textContent = p.address || "—";

    // Prefill edit form
    document.getElementById("editName").value = p.name;
    document.getElementById("editEmail").value = p.email;
    document.getElementById("editPhone").value = p.phone;
    document.getElementById("editDob").value = p.dob || "";
    document.getElementById("editGender").value = p.gender || "";
    document.getElementById("editAddress").value = p.address || "";
  }

  document.getElementById("openEditProfileBtn").addEventListener("click", () => openModal("editProfileModal"));

  document.getElementById("editProfileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const updated = {
      ...loadProfile(),
      name: document.getElementById("editName").value.trim(),
      email: document.getElementById("editEmail").value.trim(),
      phone: document.getElementById("editPhone").value.trim(),
      dob: document.getElementById("editDob").value,
      gender: document.getElementById("editGender").value,
      address: document.getElementById("editAddress").value.trim()
    };
    updated.avatar = initialsAvatar(updated.name);
    localStorage.setItem("mc_user", JSON.stringify(updated));
    closeModal("editProfileModal");
    showToast("Profile updated successfully.", "success");
    render();
    renderAuthState();
  });

  render();
}

document.addEventListener("DOMContentLoaded", initProfilePage);
