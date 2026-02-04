class BoardBase {
  constructor({ id, title, badgeColor }) {
    this.id = id;
    this.title = title;
    this.badgeColor = badgeColor;
    this.timer = null;
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  startAutoRefresh(refreshFn, ms = 15000) {
    this.stop();
    this.timer = setInterval(refreshFn, ms);
  }

  renderShell(container) {
    container.innerHTML = `
      <div class="board">
        <div class="boardTitle">${this.title}</div>
        <div class="boardControls">
          ${this.getControlsHTML()}
          <button id="${this.id}-refresh" class="secondary">Refresh</button>
        </div>
        <div class="metaRow" id="${this.id}-meta"></div>
        <div id="${this.id}-list" style="margin-top:10px;">Loading…</div>
        <div class="metaRow">Tip: click an item to draw its route on the map.</div>
      </div>
    `;
  }

  // ✅ CLICKABLE departures now
  renderDepartures(listEl, metaEl, data, searchQuery) {
    const q = (searchQuery || "").trim().toLowerCase();

    const filtered = data.departures.filter(dep => {
      const t = this.getFilterText(dep).toLowerCase();
      return !q || t.includes(q);
    });

    if (!filtered.length) {
      listEl.innerHTML = `<div class="small">No results.</div>`;
      metaEl.textContent = `Updated: ${this.fmtTime(data.updated_at)} • 0 shown`;
      return;
    }

    // store filtered list for click lookup
    listEl._deps = filtered;

    listEl.innerHTML = filtered.map((dep, idx) => {
      const minsLeft = this.minsUntil(dep.departure_time_iso);
      return `
        <div class="departure" data-idx="${idx}" style="cursor:pointer;">
          <div class="left">
            <span class="badge" style="background:${this.badgeColor};">${dep.line}</span>
            <div>
              <div class="destination">${dep.destination}</div>
              <div class="small">
                ${dep.note || ""}
                ${dep.fareLabel ? " • " + dep.fareLabel : ""}
                ${dep.timeLabel ? " • " + dep.timeLabel : ""}
              </div>

            </div>
          </div>
          <div class="minutes">${minsLeft === 0 ? "Now" : minsLeft + " min"}</div>
        </div>
      `;
    }).join("");

    // ✅ click handler (delegation)
    listEl.onclick = async (e) => {
      const item = e.target.closest(".departure");
      if (!item) return;

      const idx = Number(item.dataset.idx);
      const dep = listEl._deps[idx];

      // Board can implement onSelectDeparture(dep)
      if (typeof this.onSelectDeparture === "function") {
        try {
          await this.onSelectDeparture(dep);
        } catch (err) {
          // show a simple message without crashing
          metaEl.textContent = "Route draw error: " + String(err);
        }
      }
    };

    metaEl.textContent = `Updated: ${this.fmtTime(data.updated_at)} • Showing ${filtered.length}/${data.departures.length}`;
  }

  fmtTime(dateOrIso) {
    const d = (dateOrIso instanceof Date) ? dateOrIso : new Date(dateOrIso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  minsUntil(iso) {
    const diff = (new Date(iso) - new Date()) / 60000;
    return Math.max(0, Math.round(diff));
  }
}