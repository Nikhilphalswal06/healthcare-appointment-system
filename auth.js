/* =========================================================
   MediCare+ auth.js — login.html & register.html
   ========================================================= */

function togglePasswordVisibility(inputId, btn){
  const input = document.getElementById(inputId);
  const icon = btn.querySelector("i");
  if (input.type === "password"){
    input.type = "text";
    icon.className = "fa-regular fa-eye-slash";
  } else {
    input.type = "password";
    icon.className = "fa-regular fa-eye";
  }
}

function setFieldError(inputEl, errorEl, message){
  if (message){
    inputEl.classList.add("error");
    errorEl.textContent = message;
    errorEl.classList.add("show");
  } else {
    inputEl.classList.remove("error");
    errorEl.classList.remove("show");
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{10}$/;

/* ---------- Login ---------- */
function initLoginForm(){
  const form = document.getElementById("loginForm");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail");
    const password = document.getElementById("loginPassword");
    let valid = true;

    if (!EMAIL_RE.test(email.value.trim())){
      setFieldError(email, document.getElementById("loginEmailError"), "Enter a valid email address");
      valid = false;
    } else setFieldError(email, document.getElementById("loginEmailError"), "");

    if (password.value.length < 6){
      setFieldError(password, document.getElementById("loginPasswordError"), "Password must be at least 6 characters");
      valid = false;
    } else setFieldError(password, document.getElementById("loginPasswordError"), "");

    if (!valid) return;

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Signing in...`;

    setTimeout(() => {
      const name = email.value.split("@")[0].replace(/[^a-zA-Z ]/g, " ").trim() || "Nikhil Rawat";
      const user = { name: toTitleCase(name || "Nikhil Rawat"), email: email.value.trim(), avatar: initialsAvatar(name || "Nikhil Rawat") };
      localStorage.setItem("mc_user", JSON.stringify(user));
      showToast("Welcome back! Redirecting to your dashboard...", "success");
      setTimeout(() => { window.location.href = "patient-dashboard.html"; }, 900);
    }, 900);
  });
}

function toTitleCase(str){
  return str.split(" ").filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

/* ---------- Register ---------- */
function passwordStrength(pw){
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

function initRegisterForm(){
  const form = document.getElementById("registerForm");
  if (!form) return;

  const pwInput = document.getElementById("regPassword");
  const bars = document.querySelectorAll(".pw-strength span");
  const label = document.querySelector(".pw-strength-label");
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["var(--danger)", "var(--danger)", "var(--amber)", "var(--teal-500)", "var(--success)"];

  pwInput && pwInput.addEventListener("input", () => {
    const score = passwordStrength(pwInput.value);
    bars.forEach((bar, i) => { bar.style.background = i < score ? colors[score] : "var(--border)"; });
    label.textContent = pwInput.value ? `Password strength: ${labels[score]}` : "";
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    const fullName = document.getElementById("regFullName");
    const email = document.getElementById("regEmail");
    const phone = document.getElementById("regPhone");
    const dob = document.getElementById("regDob");
    const gender = document.getElementById("regGender");
    const password = document.getElementById("regPassword");
    const confirm = document.getElementById("regConfirm");
    const terms = document.getElementById("regTerms");

    if (fullName.value.trim().length < 3){
      setFieldError(fullName, document.getElementById("regFullNameError"), "Enter your full name"); valid = false;
    } else setFieldError(fullName, document.getElementById("regFullNameError"), "");

    if (!EMAIL_RE.test(email.value.trim())){
      setFieldError(email, document.getElementById("regEmailError"), "Enter a valid email address"); valid = false;
    } else setFieldError(email, document.getElementById("regEmailError"), "");

    if (!PHONE_RE.test(phone.value.trim())){
      setFieldError(phone, document.getElementById("regPhoneError"), "Enter a valid 10-digit phone number"); valid = false;
    } else setFieldError(phone, document.getElementById("regPhoneError"), "");

    if (!dob.value){
      setFieldError(dob, document.getElementById("regDobError"), "Select your date of birth"); valid = false;
    } else setFieldError(dob, document.getElementById("regDobError"), "");

    if (!gender.value){
      setFieldError(gender, document.getElementById("regGenderError"), "Select your gender"); valid = false;
    } else setFieldError(gender, document.getElementById("regGenderError"), "");

    if (password.value.length < 6){
      setFieldError(password, document.getElementById("regPasswordError"), "Password must be at least 6 characters"); valid = false;
    } else setFieldError(password, document.getElementById("regPasswordError"), "");

    if (confirm.value !== password.value || !confirm.value){
      setFieldError(confirm, document.getElementById("regConfirmError"), "Passwords do not match"); valid = false;
    } else setFieldError(confirm, document.getElementById("regConfirmError"), "");

    if (!terms.checked){
      showToast("Please accept the Terms & Conditions to continue.", "warning");
      valid = false;
    }

    if (!valid) return;

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Creating account...`;

    setTimeout(() => {
      const user = { name: toTitleCase(fullName.value.trim()), email: email.value.trim(), phone: phone.value.trim(), dob: dob.value, gender: gender.value, address: "", avatar: initialsAvatar(fullName.value.trim()) };
      localStorage.setItem("mc_user", JSON.stringify(user));
      showToast("Account created successfully! Redirecting...", "success");
      setTimeout(() => { window.location.href = "patient-dashboard.html"; }, 900);
    }, 1000);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLoginForm();
  initRegisterForm();
});
