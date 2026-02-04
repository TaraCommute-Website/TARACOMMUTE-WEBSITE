class jeepBoard extends BoardBase {
  constructor() {
    super({ id: "jeep", title: "Jeepney Board (Demo)", badgeColor: "#2563eb" });
    const saved = localStorage.getItem("tara_jeep_route");
    this.route = saved || DATA.jeepRoutes[0];
  }

  getControlsHTML() {
    const routes = DATA.jeepRoutes.map(r => `<option value="${r}">${r}</option>`).join("");
    return `<select id="jeep-route">${routes}</select>`;
  }


  drawSelectedLine() {
  const def = ROUTE_LINES[this.route];
  if (!def || !window.RouteDraw) return;

  window.RouteDraw.drawRoute({
    mode: def.mode,
    fromCoord: def.from,
    toCoord: def.to,
    color: def.color,
    label: `Jeep: ${this.route}`
  });
}


  bindControls(root, refresh) {
    const sel = root.querySelector("#jeep-route");
    sel.value = this.route;

    this.drawSelectedLine();
    sel.onchange = () => {
    this.route = sel.value;
    localStorage.setItem("tara_jeep_route", this.route);

    this.drawSelectedLine();
    const fallback = DATA.coords["Philcoa"] || [120.9842, 14.5995];
    if (window.MapUI) window.MapUI.focusOnPoint(fallback, "Jeep route area");
    refresh();
};


    root.querySelector("#jeep-refresh").onclick = refresh;
  }


  getFilterText(dep) {
    return `${dep.line} ${dep.destination} ${dep.note || ""}`;
  }

  async getDepartures() {
    const now = new Date();
    let minute = 1 + Math.floor(Math.random() * 3);
    const departures = [];

    for (let i = 0; i < 10; i++) {
      const t = new Date(now.getTime() + minute * 60000);
      departures.push({
        line: "Jeep",
        destination: this.route,
        note: "Next jeep arrival",
        departure_time_iso: t.toISOString(),
        timeLabel: this.fmtTime(t),
        fareLabel: window.TaraFare.getFareLabel("jeep", this.route),
      });
      minute += 3 + (Math.random() < 0.4 ? 1 : 0);
    }

    return { updated_at: now.toISOString(), departures };
  }
}