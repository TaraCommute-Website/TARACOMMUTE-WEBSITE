class busBoard extends BoardBase {
  constructor() {
    super({ id: "bus", title: "Bus Board (Demo)", badgeColor: "#f97316" });
    this.route = DATA.busRoutes[0];
  }

  getControlsHTML() {
    const routes = DATA.busRoutes.map(r => `<option value="${r}">${r}</option>`).join("");
    return `<select id="bus-route">${routes}</select>`;
  }

  drawSelectedLine() {
        const def = ROUTE_LINES[this.route];
        if (!def || !window.RouteDraw) return;

        window.RouteDraw.drawRoute({
            mode: def.mode,
            fromCoord: def.from,
            toCoord: def.to,
            color: def.color,
            label: `Bus: ${this.route}`
        });
        }



  bindControls(root, refresh) {
    const sel = root.querySelector("#bus-route");
    sel.value = this.route;

    this.drawSelectedLine();

    sel.onchange = () => {
      this.route = sel.value;
      this.drawSelectedLine();
      const c = DATA.coords["PITX"] || [120.9842, 14.5995];
      if (window.MapUI) window.MapUI.focusOnPoint(c, "Bus route area");
      refresh();
    };

    root.querySelector("#bus-refresh").onclick = refresh;
  }

  getFilterText(dep) {
    return `${dep.line} ${dep.destination} ${dep.note || ""}`;
  }


    async onSelectDeparture(dep) {
  const from = DATA.coords["PITX"] || [120.9960, 14.5096];
  const to = DATA.coords["Doroteo Jose"] || [120.9820, 14.6042];

  await window.RouteDraw.drawRoute({
    mode: "bus",
    fromCoord: from,
    toCoord: to,
    color: "#f97316",
    label: `Bus: ${dep.destination}`
  });
    }

  async getDepartures() {
    const now = new Date();
    let minute = 2 + Math.floor(Math.random() * 3);
    const departures = [];

    for (let i = 0; i < 10; i++) {
      const t = new Date(now.getTime() + minute * 60000);
      departures.push({
        line: "Bus",
        destination: this.route,
        note: "Estimated departure",
        departure_time_iso: t.toISOString(),
        timeLabel: this.fmtTime(t),
        fareLabel: window.TaraFare.getFareLabel("bus", this.route),
      });
      minute += 5;
    }


    

    return { updated_at: now.toISOString(), departures };
  }
}