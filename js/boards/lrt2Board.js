class lrt2Board extends BoardBase {
  constructor() {
    super({ id: "lrt2", title: "LRT Board (Line 2 – Demo)", badgeColor: "#a855f7" });
    this.station = "Recto";
    this.dir = "eb"; // eastbound / westbound (demo)
  }

  getControlsHTML() {
    const stations = DATA.lrt2Stations.map(s => `<option value="${s}">${s}</option>`).join("");
    return `
      <select id="lrt2-station">${stations}</select>
      <select id="lrt2-dir">
        <option value="wb">Westbound</option>
        <option value="eb">Eastbound</option>
      </select>
    `;
  }

  drawSelectedLine() {
    const from = DATA.coords[this.station];
    const to = (this.dir === "wb") ? DATA.coords["Recto"] : DATA.coords["Antipolo"];
    if (!from || !to || !window.RouteDraw) return;

    window.RouteDraw.drawRoute({
      mode: "lrt",
      fromCoord: from,
      toCoord: to,
      color: "#a855f7",
      label: `LRT-2: ${this.station} → ${this.dir === "wb" ? "Recto" : "Antipolo"}`
    });
  }

  bindControls(root, refresh) {
    const stationSel = root.querySelector("#lrt2-station");
    const dirSel = root.querySelector("#lrt2-dir");

    stationSel.value = this.station;
    dirSel.value = this.dir;

    this.drawSelectedLine();

    stationSel.onchange = () => {
      this.station = stationSel.value;
      this.drawSelectedLine();
      const c = DATA.coords[this.station];
      if (window.MapUI && c) window.MapUI.focusOnPoint(c, this.station);
      refresh();
    };

    dirSel.onchange = () => { this.dir = dirSel.value; this.drawSelectedLine(); refresh(); };
    root.querySelector("#lrt2-refresh").onclick = refresh;

    const c = DATA.coords[this.station];
    if (window.MapUI && c) window.MapUI.focusOnPoint(c, this.station);
  }

  getFilterText(dep) {
    return `${dep.line} ${dep.destination} ${dep.note || ""}`;
  }

  async getDepartures() {
    const now = new Date();
    const dest = (this.dir === "wb") ? "Recto" : "Antipolo";

    let minute = 2 + Math.floor(Math.random() * 2);
    const departures = [];

    for (let i = 0; i < 10; i++) {
      const t = new Date(now.getTime() + minute * 60000);
      departures.push({
        line: "LRT Line 2",
        destination: dest,
        note: this.station,
        departure_time_iso: t.toISOString(),
        timeLabel: this.fmtTime(t)
      });
      minute += 4;
    }

    return { updated_at: now.toISOString(), departures };
  }
}