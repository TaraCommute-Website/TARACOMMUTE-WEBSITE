const tabsEl = document.getElementById("tabs");
const containerEl = document.getElementById("boardContainer");
const searchEl = document.getElementById("search");
const clearSearchBtn = document.getElementById("clearSearch");

const BOARDS = {
  jeep: new jeepBoard(),
  bus: new busBoard(),
  ferry: new ferryBoard(),
  lrt: new lrtBoard(),
  lrt2: new lrt2Board(),
  mrt: new mrtBoard()
};

const TAB_ORDER = [
  { key: "jeep", label: "Jeep" },
  { key: "bus", label: "Bus" },
  { key: "ferry", label: "Ferry" },
  { key: "lrt", label: "LRT" },
  { key: "lrt2", label: "LRT-2" },
  { key: "mrt", label: "MRT-3" }
];

// 🔁 remember last opened board
let activeKey = localStorage.getItem("tara_last_board") || "lrt";

function renderTabs() {
  tabsEl.innerHTML = "";
  TAB_ORDER.forEach(t => {
    const el = document.createElement("div");
    el.className = "tab" + (t.key === activeKey ? " active" : "");
    el.textContent = t.label;
    el.onclick = () => switchBoard(t.key);
    tabsEl.appendChild(el);
  });
}

function switchBoard(key) {
  // ================================
  // 🚆 STEP 2: SHOW/HIDE TRAIN LINES
  // ================================
  if (window.RailUI) {
    RailUI.hide(); // hide all rail lines first

    if (key === "lrt")  RailUI.show("lrt1");
    if (key === "lrt2") RailUI.show("lrt2");
    if (key === "mrt")  RailUI.show("mrt3");
  }

  // stop previous board
  BOARDS[activeKey].stop();

  // set new board
  activeKey = key;
  localStorage.setItem("tara_last_board", key);

  renderTabs();
  searchEl.value = "";
  renderActiveBoard();
}

async function renderActiveBoard() {
  const board = BOARDS[activeKey];
  board.renderShell(containerEl);

  const root = containerEl;
  const listEl = root.querySelector(`#${board.id}-list`);
  const metaEl = root.querySelector(`#${board.id}-meta`);

  async function refresh() {
    try {
      listEl.textContent = "Loading…";
      const data = await board.getDepartures();
      board.renderDepartures(listEl, metaEl, data, searchEl.value);
    } catch (e) {
      listEl.textContent = String(e);
    }
  }

  board.bindControls(root, refresh);

  searchEl.oninput = () => refresh();
  clearSearchBtn.onclick = () => {
    searchEl.value = "";
    refresh();
  };

  await refresh();
  board.startAutoRefresh(refresh, 15000);
}

// boot
renderTabs();
renderActiveBoard();


