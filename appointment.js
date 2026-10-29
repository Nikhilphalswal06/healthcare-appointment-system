/* =========================================================
   MediCare+ appointment.js
   Used on: book-appointment.html, appointments.html
   ========================================================= */

/* ---------- Local storage helpers for demo appointments ---------- */
function loadAppointments(){
  let stored;
  try { stored = JSON.parse(localStorage.getItem("mc_appointments")); } catch {}
  return stored || APPOINTMENTS_SEED;
}
function saveAppointments(list){
  localStorage.setItem("mc_appointments", JSON.stringify(list));
}
function loadBookedSlots(){
  let stored;
  try { stored = JSON.parse(localStorage.getItem("mc_booked_slots")); } catch {}
  return stored || {};
}

/* ---------- Booking flow state ---------- */
const bookingState = { step: 1, doctor: null, type: null, date: null, slot: null };

function initBookingPage(){
  const root = document.getElementById("bookingRoot");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  bookingState.doctor = getDoctorById(params.get("doctor")) || DOCTORS[0];
  renderDoctorSummary();

  buildDateStrip();
  buildTypeChoices();
  goToStep(1);

  document.querySelectorAll("[data-next]").forEach(btn => btn.addEventListener("click", () => validateAndAdvance(Number(btn.dataset.next))));
  document.querySelectorAll("[data-prev]").forEach(btn => btn.addEventListener("click", () => goToStep(Number(btn.dataset.prev))));

  const form = document.getElementById("patientInfoForm");
  form.addEventListener("submit", (e) => { e.preventDefault(); if (validatePatientForm()) { goToStep(6); renderSummary(); } });

  document.getElementById("confirmBookingBtn").addEventListener("click", confirmBooking);
}

function renderDoctorSummary(){
  const d = bookingState.doctor;
  document.querySelectorAll(".summary-doc-name").forEach(el => el.textContent = d.name);
  document.querySelectorAll(".summary-doc-spec").forEach(el => el.textContent = d.specialization);
  document.querySelectorAll(".summary-doc-img").forEach(el => { el.src = d.img; el.onerror = function(){this.onerror=null; this.src = initialsAvatar(d.name);}; });
  document.querySelectorAll(".summary-doc-fee").forEach(el => el.textContent = `₹${d.fee}`);
}

function buildTypeChoices(){
  document.querySelectorAll(".type-choice").forEach(card => {
    card.addEventListener("click", () => {
      document.querySelectorAll(".type-choice").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      bookingState.type = card.dataset.type;
    });
  });
}

function buildDateStrip(){
  const strip = document.getElementById("dateStrip");
  const doc = bookingState.doctor;
  const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let html = "";
  for (let i = 0; i < 14; i++){
    const d = new Date(); d.setDate(d.getDate() + i);
    const dow = days[d.getDay()];
    const isAvailableDay = doc.days.includes(dow === "Sun" ? "Sun" : dow);
    html += `<div class="date-chip ${i === 0 ? "selected" : ""}" data-date="${d.toISOString().slice(0,10)}" data-available="${isAvailableDay}">
      <span class="dow">${dow}</span><span class="dnum">${d.getDate()}</span><span class="dmon">${months[d.getMonth()]}</span>
    </div>`;
  }
  strip.innerHTML = html;
  bookingState.date = strip.querySelector(".date-chip").dataset.date;
  buildSlots();

  strip.querySelectorAll(".date-chip").forEach(chip => chip.addEventListener("click", () => {
    strip.querySelectorAll(".date-chip").forEach(c => c.classList.remove("selected"));
    chip.classList.add("selected");
    bookingState.date = chip.dataset.date;
    bookingState.slot = null;
    buildSlots();
  }));
}

function buildSlots(){
  const grid = document.getElementById("slotGrid");
  const booked = loadBookedSlots()[`${bookingState.doctor.id}_${bookingState.date}`] || [];
  // deterministic pseudo-random booked slots for realism
  const seed = bookingState.date.split("-").join("") - 0 + bookingState.doctor.id.charCodeAt(1);
  grid.innerHTML = TIME_SLOTS.map((t, i) => {
    const isBooked = booked.includes(t) || (seed + i) % 5 === 0;
    return `<div class="slot ${isBooked ? "booked" : ""}" data-slot="${t}">${t}</div>`;
  }).join("");
  grid.querySelectorAll(".slot:not(.booked)").forEach(s => s.addEventListener("click", () => {
    grid.querySelectorAll(".slot").forEach(x => x.classList.remove("selected"));
    s.classList.add("selected");
    bookingState.slot = s.dataset.slot;
  }));
}

function goToStep(step){
  bookingState.step = step;
  document.querySelectorAll(".book-section").forEach(s => s.classList.remove("active"));
  document.getElementById(`step${step}`).classList.add("active");
  document.querySelectorAll(".progress-step").forEach((el, i) => {
    el.classList.remove("active", "done");
    if (i + 1 < step) el.classList.add("done");
    else if (i + 1 === step) el.classList.add("active");
  });
  window.scrollTo({ top: document.getElementById("bookingRoot").offsetTop - 100, behavior: "smooth" });
}

function validateAndAdvance(nextStep){
  if (bookingState.step === 2 && !bookingState.type){ showToast("Please select an appointment type.", "warning"); return; }
  if (bookingState.step === 3 && !bookingState.date){ showToast("Please select a date.", "warning"); return; }
  if (bookingState.step === 4 && !bookingState.slot){ showToast("Please select a time slot.", "warning"); return; }
  goToStep(nextStep);
}

function validatePatientForm(){
  let valid = true;
  const fields = [
    ["patientName", "patientNameError", v => v.trim().length > 2, "Enter the patient's full name"],
    ["patientPhone", "patientPhoneError", v => /^[0-9]{10}$/.test(v.trim()), "Enter a valid 10-digit phone number"],
    ["patientEmail", "patientEmailError", v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), "Enter a valid email address"],
    ["patientAge", "patientAgeError", v => Number(v) > 0 && Number(v) < 120, "Enter a valid age"],
    ["patientGender", "patientGenderError", v => !!v, "Select a gender"],
    ["patientReason", "patientReasonError", v => v.trim().length > 4, "Tell us the reason for your visit"]
  ];
  fields.forEach(([id, errId, test, msg]) => {
    const input = document.getElementById(id);
    const errEl = document.getElementById(errId);
    if (!test(input.value)){ setFieldError(input, errEl, msg); valid = false; }
    else setFieldError(input, errEl, "");
  });
  return valid;
}

function renderSummary(){
  const d = bookingState.doctor;
  document.getElementById("sumDoctor").textContent = d.name;
  document.getElementById("sumDate").textContent = formatDate(bookingState.date);
  document.getElementById("sumTime").textContent = bookingState.slot;
  document.getElementById("sumType").textContent = bookingState.type === "video" ? "Video Consultation" : "In-person Visit";
  document.getElementById("sumFee").textContent = `₹${d.fee}`;
  document.getElementById("sumPatient").textContent = document.getElementById("patientName").value;
}

function formatDate(iso){
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function confirmBooking(){
  const btn = document.getElementById("confirmBookingBtn");
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Confirming...`;

  setTimeout(() => {
    const apptId = "APT-" + Math.floor(40000 + Math.random() * 9999);
    const appointments = loadAppointments();
    appointments.unshift({
      id: apptId, doctorId: bookingState.doctor.id, date: bookingState.date, time: bookingState.slot,
      type: bookingState.type === "video" ? "Video" : "In-person", status: "upcoming",
      reason: document.getElementById("patientReason").value
    });
    saveAppointments(appointments);

    const slots = loadBookedSlots();
    const key = `${bookingState.doctor.id}_${bookingState.date}`;
    slots[key] = [...(slots[key] || []), bookingState.slot];
    localStorage.setItem("mc_booked_slots", JSON.stringify(slots));

    document.getElementById("successApptId").textContent = apptId;
    document.getElementById("successDocName").textContent = bookingState.doctor.name;
    document.getElementById("successDateTime").textContent = `${formatDate(bookingState.date)} · ${bookingState.slot}`;
    openModal("successModal");
    btn.disabled = false;
    btn.innerHTML = `Confirm Appointment`;
  }, 1100);
}

/* ---------- Appointments management page ---------- */
function initAppointmentsPage(){
  const list = document.getElementById("appointmentsList");
  if (!list) return;

  let activeTab = "upcoming";
  let targetApptId = null;

  function render(){
    const appts = loadAppointments().filter(a => a.status === activeTab);
    if (!appts.length){
      list.innerHTML = `<div class="state-block">
        <i class="fa-regular fa-calendar-xmark"></i>
        <h4>No ${activeTab} appointments</h4>
        <p>${activeTab === "upcoming" ? "Book a new appointment to see it here." : `You have no ${activeTab} appointments yet.`}</p>
        ${activeTab === "upcoming" ? '<a href="doctors.html" class="btn btn-primary btn-sm">Find a Doctor</a>' : ""}
      </div>`;
      return;
    }
    list.innerHTML = appts.map(a => {
      const doc = getDoctorById(a.doctorId) || {};
      return `<div class="card appt-card">
        <img class="avatar" src="${doc.img || initialsAvatar('Doctor')}" onerror="this.onerror=null;this.src='${initialsAvatar(doc.name || 'Doctor')}'" alt="${doc.name || ''}">
        <div class="ac-info">
          <h4>${doc.name || "Doctor"}</h4>
          <span class="text-muted">${doc.specialization || ""}</span>
          <div class="ac-meta">
            <span><i class="fa-regular fa-calendar"></i> ${formatDate(a.date)}</span>
            <span><i class="fa-regular fa-clock"></i> ${a.time}</span>
            <span><i class="fa-solid ${a.type === 'Video' ? 'fa-video' : 'fa-hospital'}"></i> ${a.type}</span>
            <span class="badge ${a.status === 'upcoming' ? 'badge-teal' : a.status === 'completed' ? 'badge-success' : 'badge-danger'}">${a.status}</span>
          </div>
        </div>
        <div class="ac-actions">
          <button class="btn btn-outline btn-sm" onclick="viewApptDetails('${a.id}')">View Details</button>
          ${a.status === "upcoming" ? `
            <button class="btn btn-outline btn-sm" onclick="openRescheduleModal('${a.id}')">Reschedule</button>
            <button class="btn btn-danger-outline btn-sm" onclick="openCancelModal('${a.id}')">Cancel</button>` : ""}
        </div>
      </div>`;
    }).join("");
  }

  document.querySelectorAll(".appt-tabs button").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".appt-tabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab;
    render();
  }));

  window.viewApptDetails = function(id){
    const a = loadAppointments().find(x => x.id === id);
    const doc = getDoctorById(a.doctorId) || {};
    document.getElementById("viewApptBody").innerHTML = `
      <div class="summary-row"><span>Appointment ID</span><strong>${a.id}</strong></div>
      <div class="summary-row"><span>Doctor</span><strong>${doc.name || ""}</strong></div>
      <div class="summary-row"><span>Specialization</span><strong>${doc.specialization || ""}</strong></div>
      <div class="summary-row"><span>Date</span><strong>${formatDate(a.date)}</strong></div>
      <div class="summary-row"><span>Time</span><strong>${a.time}</strong></div>
      <div class="summary-row"><span>Type</span><strong>${a.type}</strong></div>
      <div class="summary-row"><span>Reason</span><strong>${a.reason || "—"}</strong></div>
      <div class="summary-row"><span>Status</span><strong style="text-transform:capitalize;">${a.status}</strong></div>`;
    openModal("viewApptModal");
  };

  window.openRescheduleModal = function(id){
    targetApptId = id;
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const strip = document.getElementById("rescheduleDateStrip");
    let html = "";
    for (let i = 1; i <= 10; i++){
      const d = new Date(); d.setDate(d.getDate() + i);
      html += `<div class="date-chip ${i===1?"selected":""}" data-date="${d.toISOString().slice(0,10)}"><span class="dow">${days[d.getDay()]}</span><span class="dnum">${d.getDate()}</span><span class="dmon">${months[d.getMonth()]}</span></div>`;
    }
    strip.innerHTML = html;
    strip.querySelectorAll(".date-chip").forEach(c => c.addEventListener("click", () => {
      strip.querySelectorAll(".date-chip").forEach(x => x.classList.remove("selected"));
      c.classList.add("selected");
    }));
    const slotGrid = document.getElementById("rescheduleSlotGrid");
    slotGrid.innerHTML = TIME_SLOTS.slice(0,8).map((t,i) => `<div class="slot ${i===2?"booked":""}" data-slot="${t}">${t}</div>`).join("");
    slotGrid.querySelectorAll(".slot:not(.booked)").forEach(s => s.addEventListener("click", () => {
      slotGrid.querySelectorAll(".slot").forEach(x => x.classList.remove("selected"));
      s.classList.add("selected");
    }));
    openModal("rescheduleModal");
  };

  document.getElementById("confirmRescheduleBtn").addEventListener("click", () => {
    const newDate = document.querySelector("#rescheduleDateStrip .date-chip.selected")?.dataset.date;
    const newSlot = document.querySelector("#rescheduleSlotGrid .slot.selected")?.dataset.slot;
    if (!newDate || !newSlot){ showToast("Please choose a new date and time.", "warning"); return; }
    const appts = loadAppointments();
    const idx = appts.findIndex(a => a.id === targetApptId);
    if (idx > -1){ appts[idx].date = newDate; appts[idx].time = newSlot; saveAppointments(appts); }
    closeModal("rescheduleModal");
    showToast("Appointment rescheduled successfully.", "success");
    render();
  });

  window.openCancelModal = function(id){
    targetApptId = id;
    openModal("cancelModal");
  };
  document.getElementById("confirmCancelBtn").addEventListener("click", () => {
    const appts = loadAppointments();
    const idx = appts.findIndex(a => a.id === targetApptId);
    if (idx > -1){ appts[idx].status = "cancelled"; saveAppointments(appts); }
    closeModal("cancelModal");
    showToast("Appointment cancelled.", "success");
    render();
  });

  render();
}

document.addEventListener("DOMContentLoaded", () => {
  initBookingPage();
  initAppointmentsPage();
});
