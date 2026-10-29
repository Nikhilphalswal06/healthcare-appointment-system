/* =========================================================
   MediCare+ records.js — medical-records.html & prescriptions.html
   ========================================================= */

const RECORD_TYPE_ICON = { "Lab Report": "fa-flask", "Diagnostic": "fa-x-ray", "Doctor Notes": "fa-notes-medical", "Document": "fa-file-medical" };

function loadRecords(){
  let stored;
  try { stored = JSON.parse(localStorage.getItem("mc_records")); } catch {}
  return stored || RECORDS_SEED;
}
function saveRecords(list){ localStorage.setItem("mc_records", JSON.stringify(list)); }

function initMedicalRecordsPage(){
  const root = document.getElementById("recordsList");
  if (!root) return;

  let activeType = "All";

  function render(){
    const records = loadRecords().filter(r => activeType === "All" || r.type === activeType);
    if (!records.length){
      root.innerHTML = `<div class="state-block"><i class="fa-regular fa-folder-open"></i><h4>No records found</h4><p>Upload a document to see it here.</p></div>`;
      return;
    }
    root.innerHTML = records.map(r => `
      <div class="card doc-record-card">
        <div class="dr-icon"><i class="fa-solid ${RECORD_TYPE_ICON[r.type] || "fa-file-medical"}"></i></div>
        <div class="dr-info">
          <h4 style="margin-bottom:2px;">${r.name}</h4>
          <span>${r.type} &middot; ${r.date} &middot; ${r.doctor}</span>
        </div>
        <div class="dr-actions">
          <button class="btn btn-outline btn-sm" onclick="showToast('Opening document preview...', 'info')"><i class="fa-regular fa-eye"></i> View</button>
          <button class="btn btn-primary btn-sm" onclick="showToast('Download started (demo).', 'success')"><i class="fa-solid fa-download"></i> Download</button>
        </div>
      </div>`).join("");
  }

  document.querySelectorAll(".record-tabs button").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".record-tabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeType = btn.dataset.type;
    render();
  }));

  // Upload simulation
  const dropZone = document.getElementById("uploadDrop");
  const fileInput = document.getElementById("uploadFileInput");
  if (dropZone && fileInput){
    dropZone.addEventListener("click", () => fileInput.click());
    ["dragenter","dragover"].forEach(evt => dropZone.addEventListener(evt, (e) => { e.preventDefault(); dropZone.classList.add("dragover"); }));
    ["dragleave","drop"].forEach(evt => dropZone.addEventListener(evt, (e) => { e.preventDefault(); dropZone.classList.remove("dragover"); }));
    dropZone.addEventListener("drop", (e) => handleUpload(e.dataTransfer.files));
    fileInput.addEventListener("change", (e) => handleUpload(e.target.files));
  }

  function handleUpload(files){
    if (!files || !files.length) return;
    const file = files[0];
    const records = loadRecords();
    records.unshift({ id: "R" + Date.now(), name: file.name, type: "Document", date: new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}), doctor: "Self Uploaded" });
    saveRecords(records);
    showToast(`"${file.name}" uploaded successfully.`, "success");
    activeType = "All";
    document.querySelectorAll(".record-tabs button").forEach(b => b.classList.toggle("active", b.dataset.type === "All"));
    render();
  }

  render();
}

/* ---------- Prescriptions page ---------- */
function initPrescriptionsPage(){
  const root = document.getElementById("prescriptionsList");
  if (!root) return;

  root.innerHTML = PRESCRIPTIONS_SEED.map(rx => {
    const doc = getDoctorById(rx.doctorId) || {};
    return `<div class="card prescription-card">
      <div class="rx-head">
        <div>
          <h4 style="margin-bottom:2px;">${doc.name || "Doctor"}</h4>
          <span class="text-muted">${rx.date} &middot; ${doc.specialization || ""}</span>
        </div>
        <span class="badge badge-teal">${rx.id}</span>
      </div>
      <p class="text-muted" style="margin-bottom:14px;"><strong style="color:var(--ink);">Diagnosis:</strong> ${rx.diagnosis}</p>
      <div class="rx-medlist">
        ${rx.medicines.map(m => `<div class="rx-med-row"><div><strong>${m.name}</strong><span>${m.dosage}</span></div><span>${m.duration}</span></div>`).join("")}
      </div>
      <div class="rx-actions">
        <button class="btn btn-outline btn-sm" onclick="viewPrescription('${rx.id}')"><i class="fa-regular fa-eye"></i> View Prescription</button>
        <button class="btn btn-primary btn-sm" onclick="showToast('Prescription PDF downloaded (demo).', 'success')"><i class="fa-solid fa-download"></i> Download</button>
      </div>
    </div>`;
  }).join("");

  window.viewPrescription = function(id){
    const rx = PRESCRIPTIONS_SEED.find(r => r.id === id);
    const doc = getDoctorById(rx.doctorId) || {};
    document.getElementById("rxModalBody").innerHTML = `
      <div class="summary-row"><span>Prescription ID</span><strong>${rx.id}</strong></div>
      <div class="summary-row"><span>Doctor</span><strong>${doc.name || ""}</strong></div>
      <div class="summary-row"><span>Date</span><strong>${rx.date}</strong></div>
      <div class="summary-row"><span>Diagnosis</span><strong>${rx.diagnosis}</strong></div>
      <hr class="divider">
      <h4 style="margin-bottom:10px;">Medicines</h4>
      <ul class="rx-detail-medlist">
        ${rx.medicines.map(m => `<li><span>${m.name} <br><span class="text-muted" style="font-size:.78rem;">${m.dosage}</span></span><strong>${m.duration}</strong></li>`).join("")}
      </ul>
      <hr class="divider">
      <p><strong style="color:var(--ink);">Instructions:</strong> ${rx.instructions}</p>`;
    openModal("rxModal");
  };
}

document.addEventListener("DOMContentLoaded", () => {
  initMedicalRecordsPage();
  initPrescriptionsPage();
});
