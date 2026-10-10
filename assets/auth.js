const API = window.HFL_AUTH_API || "https://agentmesh-hfltech-api.onrender.com";
const PUBLIC_ACCOUNT_ACCESS_ENABLED = false;
const qs = new URLSearchParams(location.search);
let mode = qs.get("mode") || "login";
const $ = id => document.getElementById(id);
const form = $("auth-form"), nameField = $("name-field"), confirmField = $("confirm-field"), consent = $("consent"), title = $("title"), subtitle = $("subtitle"), eyebrow = $("eyebrow"), submit = $("submit"), switcher = $("switch"), error = $("error"), password = $("password"), toggle = $("toggle"), google = $("google");

function render() {
  const signup = mode === "signup", reset = mode === "reset";
  nameField.hidden = !signup;
  confirmField.hidden = !signup;
  consent.hidden = !signup;
  $("password-field").hidden = reset;
  google.hidden = reset;
  eyebrow.textContent = signup ? "GET STARTED" : reset ? "ACCOUNT RECOVERY" : "WELCOME BACK";
  title.textContent = signup ? "Create your account" : reset ? "Reset your password" : "Sign in";
  subtitle.textContent = signup ? "Create an account for HFL Tech services." : reset ? "Enter your email and we’ll send recovery instructions." : "Continue to your HFL Tech account.";
  submit.innerHTML = (signup ? "Create account" : reset ? "Send reset link" : "Sign in") + ' <span>→</span>';
  switcher.innerHTML = reset ? 'Remember your password? <a href="?mode=login">Sign in</a>' : signup ? 'Already have an account? <a href="?mode=login">Sign in</a>' : 'New to HFL Tech? <a href="?mode=signup">Create an account</a>';
  document.title = (signup ? "Create account" : reset ? "Reset password" : "Sign in") + " — HFL Tech";
  if (!PUBLIC_ACCOUNT_ACCESS_ENABLED) {
    form.hidden = true;
    google.hidden = true;
    document.querySelector(".divider").hidden = true;
    title.textContent = "Early access is invite-only";
    subtitle.textContent = "Public account creation and sign-in will open after persistent account storage and recovery are production-ready.";
    eyebrow.textContent = "EARLY ACCESS";
    switcher.hidden = false;
    switcher.innerHTML = 'Request early access through <a href="contact.html?topic=early-access">HFL Tech contact</a>.';
    document.title = "Request Early Access — HFL Tech";
  }
}

function showError(msg) { error.textContent = msg; error.hidden = false; }
function clearError() { error.hidden = true; error.textContent = ""; }

toggle.onclick = () => { password.type = password.type === "password" ? "text" : "password"; toggle.textContent = password.type === "password" ? "Show" : "Hide"; };

async function request(path, payload) {
  const response = await fetch(API + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.detail || data.error || "Unable to complete the request.");
  return data;
}

form.onsubmit = async e => {
  e.preventDefault(); clearError();
  const email = $("email").value.trim(), pw = password.value;
  if (!email || !email.includes("@")) return showError("Enter a valid email address.");
  if (mode !== "reset" && pw.length < 8) return showError("Password must be at least 8 characters.");
  if (mode === "signup" && pw !== $("confirm").value) return showError("Passwords do not match.");
  if (mode === "signup" && !$("agree").checked) return showError("Please accept the terms to continue.");
  submit.disabled = true;
  try {
    const endpoint = mode === "signup" ? "/auth/signup" : mode === "reset" ? "/auth/reset" : "/auth/login";
    const payload = mode === "signup" ? { name: $("name").value.trim(), email, password: pw } : { email, ...(mode !== "reset" ? { password: pw } : {}) };
    const data = await request(endpoint, payload);
    if (mode === "reset") {
      title.textContent = "Request received";
      subtitle.textContent = "If an account exists for that address, recovery instructions will be provided when email delivery is enabled.";
      form.hidden = true; google.hidden = true; $(".divider").hidden = true; switcher.hidden = true;
      return;
    }
    sessionStorage.setItem("hfltech_session", data.token);
    location.href = data.redirect || "account.html";
  } catch (err) { showError(err.message); }
  finally { submit.disabled = false; }
};

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve();
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error("Google sign-in could not be loaded. Check your connection and try again."));
    document.head.appendChild(script);
  });
}

async function googleSignIn() {
  clearError();
  google.disabled = true;
  google.textContent = "Connecting to Google…";
  try {
    const configResponse = await fetch(API + "/auth/google/config", { headers: { Accept: "application/json" } });
    const config = await configResponse.json().catch(() => ({}));
    if (!configResponse.ok || !config.enabled || !config.client_id) throw new Error("Google sign-in is not configured on HFL Tech yet.");
    await loadGoogleScript();
    window.google.accounts.id.initialize({
      client_id: config.client_id,
      callback: async response => {
        try {
          const data = await request("/auth/google/verify", { credential: response.credential });
          sessionStorage.setItem("hfltech_session", data.token);
          location.href = data.redirect || "account.html";
        } catch (err) {
          showError(err.message);
          google.disabled = false;
          google.textContent = "Continue with Google";
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_button: true
    });
    google.textContent = "Choose your Google account";
    window.google.accounts.id.prompt(notification => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        showError("Google account selection was unavailable. Please try again or use email and password.");
        google.disabled = false;
        google.textContent = "Continue with Google";
      }
    });
  } catch (err) {
    showError(err.message);
    google.disabled = false;
    google.textContent = "Continue with Google";
  }
}

google.onclick = googleSignIn;
render();