class lrtBoard extends BoardBase {
  constructor() {
    super({ id: "lrt", title: "LRT Board (Line 1 – Demo)", badgeColor: "#16a34a" });

    this.station = localStorage.getItem("tara_lrt_station") || "Doroteo Jose";
    this.dir = localStorage.getItem("tara_lrt_dir") || "sb";
  }

  getControlsHTML() {
    const stations = DATA.lrt1Stations.map(s => `<option value="${s}">${s}</option>`).join("");
    return `
      <select id="lrt-station">${stations}</select>
      <select id="lrt-dir">
        <option value="nb">Northbound</option>
        <option value="sb">Southbound</option>
      </select>
    `;
  }

  drawSelectedLine() {
    const from = DATA.coords[this.station];
    const to = (this.dir === "nb")
        ? DATA.coords["Fernando Poe Jr."]
        : DATA.coords["Dr. Santos"];

    if (!from || !to || !window.RouteDraw) return;

    window.RouteDraw.drawRoute({
        mode: "lrt",
        fromCoord: from,
        toCoord: to,
        color: "#16a34a",
        label: `LRT: ${this.station} → ${this.dir === "nb" ? "Fernando Poe Jr." : "Dr. Santos"}`
    });
    }


  bindControls(root, refresh) {
    const stationSel = root.querySelector("#lrt-station");
    const dirSel = root.querySelector("#lrt-dir");

    stationSel.value = this.station;
    dirSel.value = this.dir;

    this.drawSelectedLine();

    stationSel.onchange = () => {
  this.station = stationSel.value;
  localStorage.setItem("tara_lrt_station", this.station);

  this.drawSelectedLine();
  const c = DATA.coords[this.station];
  if (window.MapUI && c) window.MapUI.focusOnPoint(c, this.station);
  refresh();
};

dirSel.onchange = () => {
  this.dir = dirSel.value;
  localStorage.setItem("tara_lrt_dir", this.dir);

  this.drawSelectedLine();
  refresh();
};


    root.querySelector("#lrt-refresh").onclick = refresh;

    // Focus on current station once
    const c = DATA.coords[this.station];
    if (window.MapUI && c) window.MapUI.focusOnPoint(c, this.station);
  }

  getFilterText(dep) {
    return `${dep.line} ${dep.destination} ${dep.note || ""}`;
  }

    async onSelectDeparture(dep) {
        const from = DATA.coords[this.station];
        const to = DATA.coords[dep.destination];

        if (!from || !to) throw new Error("Missing station coords in DATA.coords");

        await window.RouteDraw.drawRoute({
            mode: "lrt",
            fromCoord: from,
            toCoord: to,
            color: "#16a34a",
            label: `LRT: ${this.station} → ${dep.destination}`
        });
        }


  async getDepartures() {
    // MOCK realtime pattern
    const now = new Date();
    const dest = (this.dir === "nb") ? "Fernando Poe Jr." : "Dr. Santos";

    let minute = 2 + Math.floor(Math.random() * 2);
    const departures = [];
    for (let i = 0; i < 10; i++) {
      const t = new Date(now.getTime() + minute * 60000);
      departures.push({
        line: "LRT Line 1",
        destination: dest,
        note: this.station,
        departure_time_iso: t.toISOString(),
        timeLabel: this.fmtTime(t),
        fareLabel: window.TaraFare.getFareLabel("lrt1"),
      });
      minute += 4;
    }


    return { updated_at: now.toISOString(), departures };
  }
}