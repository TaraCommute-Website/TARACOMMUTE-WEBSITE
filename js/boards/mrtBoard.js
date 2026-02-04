class mrtBoard extends BoardBase {
  constructor() {
    super({ id: "mrt", title: "MRT Board (Line 3 – Demo)", badgeColor: "#0ea5e9" });
    this.station = "North Avenue";
    this.dir = "sb";
  }

  getControlsHTML() {
    const stations = DATA.mrtStations.map(s => `<option value="${s}">${s}</option>`).join("");
    return `
      <select id="mrt-station">${stations}</select>
      <select id="mrt-dir">
        <option value="nb">Northbound</option>
        <option value="sb">Southbound</option>
      </select>
    `;
  }

  drawSelectedLine() {
    const from = DATA.coords[this.station];
    const to = (this.dir === "nb") ? DATA.coords["North Avenue"] : DATA.coords["Taft Avenue"];
    if (!from || !to || !window.RouteDraw) return;

    window.RouteDraw.drawRoute({
      mode: "lrt",
      fromCoord: from,
      toCoord: to,
      color: "#0ea5e9",
      label: `MRT-3: ${this.station} → ${this.dir === "nb" ? "North Avenue" : "Taft Avenue"}`
    });
  }

  bindControls(root, refresh) {
    const stationSel = root.querySelector("#mrt-station");
    const dirSel = root.querySelector("#mrt-dir");

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
    root.querySelector("#mrt-refresh").onclick = refresh;

    const c = DATA.coords[this.station];
    if (window.MapUI && c) window.MapUI.focusOnPoint(c, this.station);
  }

  getFilterText(dep) {
    return `${dep.line} ${dep.destination} ${dep.note || ""}`;
  }

  async getDepartures() {
    const now = new Date();
    const dest = (this.dir === "nb") ? "North Avenue" : "Taft Avenue";

    let minute = 2 + Math.floor(Math.random() * 2);
    const departures = [];

    for (let i = 0; i < 10; i++) {
      const t = new Date(now.getTime() + minute * 60000);
      departures.push({
        line: "MRT Line 3",
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