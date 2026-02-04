class ferryBoard extends BoardBase {
  constructor() {
    super({ id: "ferry", title: "Ferry Board (Demo)", badgeColor: "#06b6d4" });
    this.station = DATA.ferryStations[0];
    this.dir = "downriver";
  }

  getControlsHTML() {
    const opts = DATA.ferryStations.map(s => `<option value="${s}">${s}</option>`).join("");
    return `
      <select id="ferry-station">${opts}</select>
      <select id="ferry-dir">
        <option value="upriver">Upriver</option>
        <option value="downriver">Downriver</option>
      </select>
    `;
  }

    drawSelectedLine() {
        const def = ROUTE_LINES[this.station];
        if (!def || !window.RouteDraw) return;

        window.RouteDraw.drawRoute({
            mode: def.mode,
            fromCoord: def.from,
            toCoord: def.to,
            color: def.color,
            label: `Ferry: ${this.station}`
        });
        }


  bindControls(root, refresh) {
    const stationSel = root.querySelector("#ferry-station");
    const dirSel = root.querySelector("#ferry-dir");

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

    dirSel.onchange = () => { this.dir = dirSel.value; refresh(); };

    root.querySelector("#ferry-refresh").onclick = refresh;

    const c = DATA.coords[this.station];
    if (window.MapUI && c) window.MapUI.focusOnPoint(c, this.station);
  }

  getFilterText(dep) {
    return `${dep.line} ${dep.destination} ${dep.note || ""}`;
  }


  async onSelectDeparture(dep) {
  const from = DATA.coords[this.station];
  const to = DATA.coords["Escolta Ferry Station"] || [120.9755, 14.5965];

  if (!from || !to) throw new Error("Missing ferry coords in DATA.coords");

  await window.RouteDraw.drawRoute({
    mode: "ferry",
    fromCoord: from,
    toCoord: to,
    color: "#06b6d4",
    label: `Ferry: ${this.station} → Escolta`
  });
}


  async getDepartures() {
    const now = new Date();
    const dest = this.dir === "upriver" ? "Upriver trip" : "Downriver trip";

    let minute = 5 + Math.floor(Math.random() * 3);
    const departures = [];

    for (let i = 0; i < 8; i++) {
      const t = new Date(now.getTime() + minute * 60000);
      departures.push({
        line: "Ferry",
        destination: dest,
        note: this.station,
        departure_time_iso: t.toISOString(),
        timeLabel: this.fmtTime(t),
        fareLabel: window.TaraFare.getFareLabel("ferry"),
      });
      minute += 10;
    }

    return { updated_at: now.toISOString(), departures };
  }
}