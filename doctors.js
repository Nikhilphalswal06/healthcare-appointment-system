/* =========================================================
   MediCare+ doctors.js
   Used on: index.html (featured section), doctors.html
   (search/filter/sort/paginate), doctor-details.html
   ========================================================= */

function starRating(rating){
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let html = "";
  for (let i = 0; i < full; i++) html += `<i class="fa-solid fa-star"></i>`;
  if (half) html += `<i class="fa-solid fa-star-half-stroke"></i>`;
  for (let i = full + (half ? 1 : 0); i < 5; i++) html += `<i class="fa-regular fa-star"></i>`;
  return html;
}

function renderDoctorCard(doc){
  return `
  <article class="doctor-card">
    <div class="doc-photo-wrap">
      <img src="${doc.img}" alt="Photo of ${doc.name}" loading="lazy"
           onerror="this.onerror=null;this.src='${initialsAvatar(doc.name)}'">
      <span class="badge ${doc.available ? 'badge-success' : 'badge-danger'} doc-avail-badge">
        <span class="badge-dot"></span>${doc.available ? 'Available Today' : 'Fully Booked'}
      </span>
    </div>
    <div class="doc-body">
      <div class="doc-name-row">
        <div>
          <h4>${doc.name}</h4>
        </div>
        <span class="rating"><i class="fa-solid fa-star"></i> ${doc.rating}</span>
      </div>
      <div class="doc-spec">${doc.specialization} &middot; ${doc.qualification}</div>
      <div class="doc-meta-row">
        <span><i class="fa-regular fa-clock"></i> ${doc.experience} yrs exp.</span>
        <span><i class="fa-solid fa-location-dot"></i> ${doc.location}</span>
      </div>
      <div class="doc-meta-row" style="margin-bottom:16px;">
        <span class="doc-fee">₹${doc.fee} <span style="color:var(--ink-faint); font-weight:400;">/ visit</span></span>
        <span class="text-muted">${doc.reviews} reviews</span>
      </div>
      <div class="doc-actions">
        <a class="btn btn-outline btn-sm" href="doctor-details.html?id=${doc.id}">View Profile</a>
        <a class="btn btn-primary btn-sm" href="book-appointment.html?doctor=${doc.id}">Book Now</a>
      </div>
    </div>
  </article>`;
}

/* ---------- Homepage dynamic sections ---------- */
function renderSpecializationsGrid(){
  const el = document.getElementById("specGrid");
  if (!el) return;
  el.innerHTML = SPECIALIZATIONS.map(s => `
    <a class="spec-card" href="doctors.html?spec=${encodeURIComponent(s.name)}">
      <div class="spec-icon"><i class="fa-solid ${s.icon}"></i></div>
      <h4>${s.name}</h4>
      <span>${s.count} doctors</span>
    </a>`).join("");
}

function renderFeaturedDoctors(){
  const el = document.getElementById("featuredDoctorsGrid");
  if (!el) return;
  const featured = [...DOCTORS].sort((a,b) => b.rating - a.rating).slice(0, 6);
  el.innerHTML = featured.map(renderDoctorCard).join("");
}

function renderTestimonials(){
  const el = document.getElementById("testimonialGrid");
  if (!el) return;
  el.innerHTML = TESTIMONIALS.map(t => `
    <div class="card card-pad testi-card">
      <div class="rating mb-16">${starRating(5)}</div>
      <p class="testi-quote">"${t.quote}"</p>
      <div class="testi-person">
        <img class="avatar" src="${t.img}" alt="${t.name}">
        <div><strong>${t.name}</strong><span>${t.role}</span></div>
      </div>
    </div>`).join("");
}

function initHeroSearch(){
  const form = document.getElementById("heroSearchForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = document.getElementById("heroSearchQuery").value.trim();
    const loc = document.getElementById("heroSearchLocation").value.trim();
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (loc) params.set("location", loc);
    window.location.href = `doctors.html?${params.toString()}`;
  });
}

/* ---------- Doctors listing page ---------- */
const listingState = {
  query: "", specs: new Set(), genders: new Set(), minExperience: 0, maxFee: 1500,
  minRating: 0, availableOnly: false, sort: "rating", page: 1, perPage: 6, view: "grid"
};

function initDoctorsListingPage(){
  const grid = document.getElementById("doctorListGrid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  if (params.get("q")) listingState.query = params.get("q");
  if (params.get("spec")) listingState.specs.add(params.get("spec"));

  document.getElementById("searchInput").value = listingState.query;

  // Build specialization filter checkboxes
  const specWrap = document.getElementById("specFilterList");
  specWrap.innerHTML = SPECIALIZATIONS.map(s => `
    <label class="filter-option">
      <input type="checkbox" value="${s.name}" ${listingState.specs.has(s.name) ? "checked" : ""} data-filter="spec">
      ${s.name} <span class="count">${DOCTORS.filter(d=>d.specialization===s.name).length}</span>
    </label>`).join("");

  document.querySelectorAll("[data-filter='spec']").forEach(cb => cb.addEventListener("change", () => {
    cb.checked ? listingState.specs.add(cb.value) : listingState.specs.delete(cb.value);
    listingState.page = 1; renderListing();
  }));
  document.querySelectorAll("[data-filter='gender']").forEach(cb => cb.addEventListener("change", () => {
    cb.checked ? listingState.genders.add(cb.value) : listingState.genders.delete(cb.value);
    listingState.page = 1; renderListing();
  }));

  document.getElementById("experienceRange").addEventListener("input", (e) => {
    listingState.minExperience = Number(e.target.value);
    document.getElementById("experienceRangeValue").textContent = `${e.target.value}+ years`;
    listingState.page = 1; renderListing();
  });
  document.getElementById("feeRange").addEventListener("input", (e) => {
    listingState.maxFee = Number(e.target.value);
    document.getElementById("feeRangeValue").textContent = `Up to ₹${e.target.value}`;
    listingState.page = 1; renderListing();
  });
  document.querySelectorAll(".star-filter").forEach(sf => sf.addEventListener("click", () => {
    const val = Number(sf.dataset.rating);
    listingState.minRating = listingState.minRating === val ? 0 : val;
    document.querySelectorAll(".star-filter").forEach(s => s.classList.toggle("active", Number(s.dataset.rating) <= listingState.minRating && listingState.minRating > 0));
    listingState.page = 1; renderListing();
  }));
  document.getElementById("availableOnly").addEventListener("change", (e) => {
    listingState.availableOnly = e.target.checked; listingState.page = 1; renderListing();
  });

  document.getElementById("searchInput").addEventListener("input", debounce((e) => {
    listingState.query = e.target.value; listingState.page = 1; renderListing();
  }, 250));

  document.getElementById("sortSelect").addEventListener("change", (e) => {
    listingState.sort = e.target.value; renderListing();
  });

  document.getElementById("clearFiltersBtn").addEventListener("click", () => {
    listingState.specs.clear(); listingState.genders.clear();
    listingState.minExperience = 0; listingState.maxFee = 1500; listingState.minRating = 0; listingState.availableOnly = false; listingState.query = "";
    document.querySelectorAll("[data-filter='spec'],[data-filter='gender'],#availableOnly").forEach(cb => cb.checked = false);
    document.getElementById("experienceRange").value = 0;
    document.getElementById("feeRange").value = 1500;
    document.getElementById("experienceRangeValue").textContent = "0+ years";
    document.getElementById("feeRangeValue").textContent = "Up to ₹1500";
    document.getElementById("searchInput").value = "";
    document.querySelectorAll(".star-filter").forEach(s => s.classList.remove("active"));
    listingState.page = 1; renderListing();
  });

  document.querySelectorAll(".view-toggle button").forEach(btn => btn.addEventListener("click", () => {
    document.querySelectorAll(".view-toggle button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    listingState.view = btn.dataset.view;
    grid.classList.toggle("list-view", listingState.view === "list");
  }));

  renderListing();
}

function debounce(fn, wait){
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}

function getFilteredDoctors(){
  return DOCTORS.filter(d => {
    if (listingState.query && !(`${d.name} ${d.specialization} ${d.hospital}`.toLowerCase().includes(listingState.query.toLowerCase()))) return false;
    if (listingState.specs.size && !listingState.specs.has(d.specialization)) return false;
    if (listingState.genders.size && !listingState.genders.has(d.gender)) return false;
    if (d.experience < listingState.minExperience) return false;
    if (d.fee > listingState.maxFee) return false;
    if (d.rating < listingState.minRating) return false;
    if (listingState.availableOnly && !d.available) return false;
    return true;
  }).sort((a, b) => {
    switch (listingState.sort){
      case "rating": return b.rating - a.rating;
      case "experience": return b.experience - a.experience;
      case "fee-asc": return a.fee - b.fee;
      case "fee-desc": return b.fee - a.fee;
      default: return 0;
    }
  });
}

function renderListing(){
  const grid = document.getElementById("doctorListGrid");
  const results = getFilteredDoctors();
  const totalPages = Math.max(1, Math.ceil(results.length / listingState.perPage));
  if (listingState.page > totalPages) listingState.page = totalPages;
  const start = (listingState.page - 1) * listingState.perPage;
  const pageItems = results.slice(start, start + listingState.perPage);

  document.getElementById("resultsCount").innerHTML = `<strong>${results.length}</strong> doctors found`;

  renderActiveChips();

  if (!pageItems.length){
    grid.innerHTML = `<div class="state-block" style="grid-column:1/-1;">
      <i class="fa-solid fa-user-doctor"></i>
      <h4>No doctors match your filters</h4>
      <p>Try adjusting or clearing your filters to see more results.</p>
      <button class="btn btn-outline btn-sm" onclick="document.getElementById('clearFiltersBtn').click()">Clear Filters</button>
    </div>`;
  } else {
    grid.innerHTML = pageItems.map(renderDoctorCard).join("");
  }

  renderPagination(totalPages);
}

function renderActiveChips(){
  const wrap = document.getElementById("activeChips");
  if (!wrap) return;
  const chips = [];
  listingState.specs.forEach(s => chips.push({ label: s, remove: () => listingState.specs.delete(s) }));
  listingState.genders.forEach(g => chips.push({ label: g, remove: () => listingState.genders.delete(g) }));
  if (listingState.minRating) chips.push({ label: `${listingState.minRating}+ stars`, remove: () => listingState.minRating = 0 });
  if (listingState.availableOnly) chips.push({ label: "Available today", remove: () => { listingState.availableOnly = false; document.getElementById("availableOnly").checked = false; } });

  wrap.innerHTML = chips.map((c, i) => `<span class="chip">${c.label}<button data-idx="${i}" aria-label="Remove"><i class="fa-solid fa-xmark"></i></button></span>`).join("");
  wrap.querySelectorAll("button").forEach((btn, i) => btn.addEventListener("click", () => {
    chips[i].remove();
    // reflect checkbox state for specs/genders
    document.querySelectorAll("[data-filter='spec']").forEach(cb => cb.checked = listingState.specs.has(cb.value));
    document.querySelectorAll("[data-filter='gender']").forEach(cb => cb.checked = listingState.genders.has(cb.value));
    document.querySelectorAll(".star-filter").forEach(s => s.classList.remove("active"));
    listingState.page = 1; renderListing();
  }));
}

function renderPagination(totalPages){
  const wrap = document.getElementById("pagination");
  if (!wrap) return;
  if (totalPages <= 1){ wrap.innerHTML = ""; return; }
  let html = `<button ${listingState.page === 1 ? "disabled" : ""} data-page="${listingState.page - 1}"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let i = 1; i <= totalPages; i++){
    html += `<button class="${i === listingState.page ? "active" : ""}" data-page="${i}">${i}</button>`;
  }
  html += `<button ${listingState.page === totalPages ? "disabled" : ""} data-page="${listingState.page + 1}"><i class="fa-solid fa-chevron-right"></i></button>`;
  wrap.innerHTML = html;
  wrap.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
    listingState.page = Number(btn.dataset.page);
    renderListing();
    document.getElementById("doctorListGrid").scrollIntoView({ behavior: "smooth", block: "start" });
  }));
}

/* ---------- Doctor details page ---------- */
function initDoctorDetailsPage(){
  const root = document.getElementById("doctorDetailsRoot");
  if (!root) return;
  const params = new URLSearchParams(window.location.search);
  const doc = getDoctorById(params.get("id")) || DOCTORS[0];

  document.title = `${doc.name} — MediCare+`;
  document.getElementById("ddPhoto").src = doc.img;
  document.getElementById("ddPhoto").onerror = function(){ this.onerror=null; this.src = initialsAvatar(doc.name); };
  document.getElementById("ddName").textContent = doc.name;
  document.getElementById("ddQualification").textContent = doc.qualification;
  document.getElementById("ddSpecBadge").textContent = doc.specialization;
  document.getElementById("ddAvailBadge").textContent = doc.available ? "Available Today" : "Fully Booked";
  document.getElementById("ddAvailBadge").className = `badge ${doc.available ? "badge-success" : "badge-danger"}`;
  document.getElementById("ddRating").innerHTML = `${starRating(doc.rating)} <span style="color:var(--ink-soft); font-weight:600; margin-left:6px;">${doc.rating} (${doc.reviews} reviews)</span>`;
  document.getElementById("ddExperience").textContent = `${doc.experience} yrs`;
  document.getElementById("ddFee").textContent = `₹${doc.fee}`;
  document.getElementById("ddLocation").textContent = doc.location;
  document.getElementById("ddHospital").textContent = doc.hospital;
  document.getElementById("ddAbout").textContent = doc.about;
  document.getElementById("ddBookBtn").href = `book-appointment.html?doctor=${doc.id}`;
  document.getElementById("ddBookBtn2").href = `book-appointment.html?doctor=${doc.id}`;

  document.getElementById("ddEducation").innerHTML = doc.education.map(e => `<li><i class="fa-solid fa-graduation-cap"></i> ${e}</li>`).join("");
  document.getElementById("ddServices").innerHTML = doc.services.map(s => `<li><i class="fa-solid fa-check-circle"></i> ${s}</li>`).join("");
  document.getElementById("ddLanguages").textContent = doc.languages.join(", ");

  const allDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  document.getElementById("ddDays").innerHTML = allDays.map(d => `<span class="day-pill ${doc.days.includes(d) ? "available" : ""}">${d}</span>`).join("");

  document.getElementById("ddSlots").innerHTML = TIME_SLOTS.slice(0, 8).map(t => `<span class="badge badge-teal">${t}</span>`).join("");

  // Tabs
  document.querySelectorAll(".details-tabs button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".details-tabs button").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".details-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // Similar doctors
  const similar = DOCTORS.filter(d => d.specialization === doc.specialization && d.id !== doc.id).slice(0, 3);
  const simEl = document.getElementById("ddSimilar");
  if (simEl) simEl.innerHTML = similar.map(renderDoctorCard).join("") || `<p class="text-muted">No other doctors found in this specialization.</p>`;

  // Reviews (demo)
  const reviewNames = ["Anita Desai","Rakesh Kumar","Sanya Gupta","Manoj Tiwari"];
  const revEl = document.getElementById("ddReviews");
  if (revEl){
    revEl.innerHTML = reviewNames.slice(0,3).map((n,i) => `
      <div class="review-item">
        <img class="avatar" src="https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=DBEDE8&color=0F5C55&rounded=true" alt="${n}">
        <div style="flex:1;">
          <div class="review-head">
            <strong>${n}</strong>
            <span class="rating">${starRating(4 + (i%2))}</span>
          </div>
          <p class="text-muted" style="margin:0; font-size:.88rem;">Very attentive and explained everything clearly. Wait time was minimal and the clinic was clean.</p>
        </div>
      </div>`).join("");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderSpecializationsGrid();
  renderFeaturedDoctors();
  renderTestimonials();
  initHeroSearch();
  initDoctorsListingPage();
  initDoctorDetailsPage();
});
