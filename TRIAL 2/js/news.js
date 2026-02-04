const newsGrid = document.getElementById("newsGrid");
const newsStatus = document.getElementById("newsStatus");

// Demo items (replace with real APIs later)
const FALLBACK = [
  { title: "MMDA releases traffic advisory updates", source: "MMDA", time: "Today" },
  { title: "Some routes may be adjusted due to road works", source: "Transport Update", time: "Today" },
  { title: "Commuter tip: avoid peak hours in EDSA", source: "TaraCommute", time: "This week" }
];

function render(items) {
  newsGrid.innerHTML = items.map(n => `
    <div class="card">
      <div class="city">${n.title}</div>
      <div class="meta">Source: <b>${n.source}</b><br/>When: <b>${n.time}</b></div>
    </div>
  `).join("");
  newsStatus.textContent = `Showing ${items.length} items`;
}

render(FALLBACK);