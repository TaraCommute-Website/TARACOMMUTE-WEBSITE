// auth.js
const AUTH_KEY = "taracommute_auth";
const DEFAULT_SESSION_MINUTES = 30; // change to what you want

function _now() {
  return Date.now();
}

function setAuth(user, sessionMinutes = DEFAULT_SESSION_MINUTES) {
  const expiresAt = _now() + sessionMinutes * 60 * 1000;

  const payload = {
    email: user.email || "",
    name: user.name || "",        // optional
    loggedIn: true,
    ts: _now(),
    expiresAt
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
}

function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;

    const auth = JSON.parse(raw);

    // expired or invalid -> clear
    if (!auth?.loggedIn || !auth?.expiresAt || _now() > auth.expiresAt) {
      clearAuth();
      return null;
    }

    return auth;
  } catch {
    return null;
  }
}

function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

function extendSession(sessionMinutes = DEFAULT_SESSION_MINUTES) {
  const auth = getAuth();
  if (!auth) return;

  auth.expiresAt = _now() + sessionMinutes * 60 * 1000;
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

function redirectIfLoggedIn() {
  const auth = getAuth();
  if (auth) window.location.replace("dashboard.html");
}

window.TaraAuth = { setAuth, getAuth, clearAuth, extendSession, redirectIfLoggedIn };
