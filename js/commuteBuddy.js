const buddyBtn = document.getElementById("commuteBuddyBtn");
const panel = document.getElementById("commuteBuddyPanel");
const backdrop = document.getElementById("cbBackdrop");
const closeBtn = document.getElementById("cbClose");
const sendBtn = document.getElementById("cbSend");
const input = document.getElementById("cbInput");
const messages = document.getElementById("cbMessages");

// ✅ Always start CLOSED
document.addEventListener("DOMContentLoaded", () => {
  panel.classList.add("cb-hidden");
  backdrop.classList.add("cb-hidden");
});

function openBuddy() {
  panel.classList.remove("cb-hidden");
  backdrop.classList.remove("cb-hidden");
  input?.focus();

  // 👋 Auto greeting (only once per page load)
  if (!panel.dataset.greeted) {
    addBubble("buddy", "Hi there! 👋✨ I'm **Commute Buddy** 🤖🌈\n\nI'm here to help you navigate Metro Manila! Ask me about:\n🚍 Bus & Jeepney routes\n🚝 MRT/LRT lines\n⛴️ Ferry schedules\n💰 Fare estimates\n🚦 Traffic updates\n🗺️ Best routes\n\nWhat would you like to know? 😊");
    panel.dataset.greeted = "true";
  }
}

function closeBuddy() {
  panel.classList.add("cb-hidden");
  backdrop.classList.add("cb-hidden");
}

buddyBtn.addEventListener("click", openBuddy);
closeBtn.addEventListener("click", closeBuddy);
backdrop.addEventListener("click", closeBuddy);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeBuddy();
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendBtn.click();
});

sendBtn.addEventListener("click", async () => {
  const text = input.value.trim();
  if (!text) return;

  addBubble("you", text);
  input.value = "";

  try {
    const reply = await window.CommuteBuddy.gemini(text);
    addBubble("buddy", reply);
  } catch (err) {
    console.error(err);
    addBubble("buddy", "Oops! 😅 Something went wrong on my end. Could you try asking again? 🔄");
  }
});

// Bubble UI helper
function addBubble(who, text) {
  const wrap = document.createElement("div");

  const bubble = document.createElement("div");
  bubble.className = `cb-bubble ${who === "you" ? "cb-you" : "cb-buddy"}`;

  // Simple markdown-ish bold support (**text**)
  const safe = escapeHtml(text).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  bubble.innerHTML = safe;

  const meta = document.createElement("div");
  meta.className = "cb-meta";
  meta.textContent = who === "you" ? "You" : "Commute Buddy";

  wrap.appendChild(bubble);
  wrap.appendChild(meta);

  wrap.style.display = "flex";
  wrap.style.flexDirection = "column";
  wrap.style.alignItems = who === "you" ? "flex-end" : "flex-start";

  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/* ==============================
   🔮 GEMINI PLACEHOLDER HERE
================================ */
window.CommuteBuddy = {};

window.CommuteBuddy.gemini = async function(userText) {
  const API_KEY = "AIzaSyDo-4r9N-xQJtnm8hJSh8ZQXS8W0u_u1TA";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "You are Commute Buddy 🤖, a super friendly and helpful AI assistant for Metro Manila commuters! " +
                  "Be warm, enthusiastic, and use plenty of emojis to make your responses fun and engaging. " +
                  "Use emojis like 🚍 for buses, 🚝 for trains, ⛴️ for ferries, 🚕 for jeepneys, 🗺️ for routes, " +
                  "💰 for fares, ⏱️ for time, 🌧️ for weather, 🚦 for traffic, ✨ for tips, and 👍 for encouragement. " +
                  "Keep answers practical, concise, and friendly. Always start with a warm greeting emoji!\n\n" +
                  "User: " + userText
              }
            ]
          }
        ]
      })
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error(data);
    throw new Error(data.error?.message || "Gemini request failed");
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No reply from Gemini.";
};



