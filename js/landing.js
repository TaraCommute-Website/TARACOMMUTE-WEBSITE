// Auto-redirect if already logged in (safe)
document.addEventListener("DOMContentLoaded", () => {
  window.TaraAuth?.redirectIfLoggedIn?.();
});

const modalBackdrop = document.getElementById("modalBackdrop");
const authModal = document.getElementById("authModal");
const modalTitle = document.getElementById("modalTitle");
const switchModeBtn = document.getElementById("switchModeBtn");
const submitAuthBtn = document.getElementById("submitAuthBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const authForm = document.getElementById("authForm");

const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const getStartedBtn = document.getElementById("getStartedBtn");

// ❗ viewDemoBtn is not in your HTML, so guard it
const viewDemoBtn = document.getElementById("viewDemoBtn");

const signupBtn2 = document.getElementById("signupBtn2");
const loginBtn2 = document.getElementById("loginBtn2");

let mode = "login";

function openModal(nextMode) {
  mode = nextMode;
  const isLogin = mode === "login";

  modalTitle.textContent = isLogin ? "Login" : "Register";
  submitAuthBtn.textContent = isLogin ? "Login" : "Create account";
  switchModeBtn.textContent = isLogin ? "Switch to Register" : "Switch to Login";

  modalBackdrop.hidden = false;
  authModal.hidden = false;
}

function closeModal() {
  modalBackdrop.hidden = true;
  authModal.hidden = true;
}

// Buttons (guard in case any element is missing)
if (loginBtn) loginBtn.onclick = () => openModal("login");
if (signupBtn) signupBtn.onclick = () => openModal("signup");
if (getStartedBtn) getStartedBtn.onclick = () => openModal("signup");

if (signupBtn2) signupBtn2.onclick = () => openModal("signup");
if (loginBtn2) loginBtn2.onclick = () => openModal("login");

if (closeModalBtn) closeModalBtn.onclick = closeModal;
if (modalBackdrop) modalBackdrop.onclick = closeModal;

if (switchModeBtn) {
  switchModeBtn.onclick = () => openModal(mode === "login" ? "signup" : "login");
}

if (viewDemoBtn) {
  viewDemoBtn.onclick = () => {
    alert("Demo: Dashboard map is locked until Login/Register.");
  };
}

// ✅ FIXED: submit saves { email, loggedIn, ts } then redirects
if (authForm) {
  authForm.onsubmit = (e) => {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim() || "";
    const password = document.getElementById("password")?.value || "";

    if (!email) {
      alert("Please enter your email.");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    // Demo auth: we accept any email+password
    TaraAuth.setAuth({
  email,
  name: email.split("@")[0] // simple “name” demo; replace with real name field if you have one
  }, 30); 

    window.location.replace("dashboard.html");
  };
}

// Weather (Open-Meteo)
const weatherEl = document.getElementById("weatherPill");

async function loadWeather(lat, lon) {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,wind_speed_10m&timezone=Asia%2FManila`;

  const res = await fetch(url);
  const data = await res.json();

  const temp = Math.round(data.current?.temperature_2m ?? 0);
  const wind = Math.round(data.current?.wind_speed_10m ?? 0);

  if (weatherEl) weatherEl.textContent = `Metro Manila: ${temp}°C • Wind ${wind} km/h`;
}

loadWeather(14.5995, 120.9842).catch(() => {
  if (weatherEl) weatherEl.textContent = "Weather unavailable";
});

// News ticker (fallback rotating)
const ticker = document.getElementById("newsTicker");
let headlines = [
  "MMDA traffic advisory updates today",
  "Public transport service changes this week",
  "Commuter tips: best travel times in Metro Manila"
];
let i = 0;

function rotateTicker() {
  if (!ticker) return;
  ticker.textContent = headlines[i % headlines.length];
  i++;
}

rotateTicker();
setInterval(rotateTicker, 5000);
