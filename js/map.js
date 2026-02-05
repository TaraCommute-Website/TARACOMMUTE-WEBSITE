const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  center: [120.9842, 14.5995],
  zoom: 11
});

map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

let boardMarkers = [];

function clearBoardMarkers() {
  boardMarkers.forEach(m => m.remove());
  boardMarkers = [];
}

function focusOnPoint(coord, label) {
  if (!coord) return;
  map.flyTo({ center: coord, zoom: 14 });

  clearBoardMarkers();
  const m = new mapboxgl.Marker()
    .setLngLat(coord)
    .setPopup(new mapboxgl.Popup({ offset: 18 }).setText(label || "Selected"))
    .addTo(map);

  boardMarkers.push(m);
}

// ✅ Route drawing (Line on map)
const ROUTE_SOURCE_ID = "route-src";
const ROUTE_LAYER_ID = "route-line";

function ensureRouteLayer() {
  if (!map.getSource(ROUTE_SOURCE_ID)) {
    map.addSource(ROUTE_SOURCE_ID, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] }
    });
  }
  if (!map.getLayer(ROUTE_LAYER_ID)) {
    map.addLayer({
      id: ROUTE_LAYER_ID,
      type: "line",
      source: ROUTE_SOURCE_ID,
      paint: {
        "line-width": 6,
        "line-opacity": 0.9,
        "line-color": "#111"
      }
    });
  }
}

function clearRoute() {
  const src = map.getSource(ROUTE_SOURCE_ID);
  if (src) {
    src.setData({ type: "FeatureCollection", features: [] });
  }
}

function fitToCoords(coords) {
  if (!coords || coords.length < 2) return;
  const b = new mapboxgl.LngLatBounds();
  coords.forEach(c => b.extend(c));
  map.fitBounds(b, { padding: 90 });
}

// Mapbox Directions for road routes (jeep/bus/walk)
async function getDirections(profile, fromCoord, toCoord) {
  const coords = `${fromCoord[0]},${fromCoord[1]};${toCoord[0]},${toCoord[1]}`;
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coords}` +
    `?geometries=geojson&overview=full&steps=false&access_token=${mapboxgl.accessToken}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Directions API failed");
  const data = await res.json();
  const r = data.routes?.[0];
  if (!r) throw new Error("No route found");
  return r.geometry.coordinates;
}

// ✅ Main function boards will call
async function drawRoute({ mode, fromCoord, toCoord, color = "#111", label = "Route" }) {
  if (!fromCoord || !toCoord) return;

  // ✅ For trains/ferry: DO NOT draw any route line (remove the inaccurate straight line)
  const isRoad = (mode === "jeep" || mode === "bus" || mode === "walk");
  if (!isRoad) {
    clearRoute();
    clearBoardMarkers();

    // optional: still zoom to both points so user sees area
    fitToCoords([fromCoord, toCoord]);
    return;
  }

  // markers (only for road routes)
  clearBoardMarkers();
  boardMarkers.push(new mapboxgl.Marker().setLngLat(fromCoord).addTo(map));
  boardMarkers.push(new mapboxgl.Marker().setLngLat(toCoord).addTo(map));

  let lineCoords;

  // Road-based routes use real road directions
  if (mode === "jeep" || mode === "bus") {
    try {
      lineCoords = await getDirections("driving-traffic", fromCoord, toCoord);
    } catch {
      lineCoords = [fromCoord, toCoord];
    }
  } else {
    // walk
    try {
      lineCoords = await getDirections("walking", fromCoord, toCoord);
    } catch {
      lineCoords = [fromCoord, toCoord];
    }
  }

  const src = map.getSource(ROUTE_SOURCE_ID);
  src.setData({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { label },
        geometry: { type: "LineString", coordinates: lineCoords }
      }
    ]
  });

  map.setPaintProperty(ROUTE_LAYER_ID, "line-color", color);
  fitToCoords(lineCoords);
}

/* =========================================================
   ✅ RAIL LINES (hidden by default; show only when clicked)
========================================================= */

const RAIL_LAYER_IDS = [];
const RAIL_STATION_LAYER_IDS = [];

function addRailLineLayerHidden(lineDef) {
  if (!lineDef || !Array.isArray(lineDef.coords)) return;

  const sourceId = lineDef.id + "-src";

  map.addSource(sourceId, {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: lineDef.coords
      }
    }
  });

  map.addLayer({
    id: lineDef.id,
    type: "line",
    source: sourceId,
    layout: {
      "line-join": "round",
      "line-cap": "round",
      "visibility": "none"
    },
    paint: {
      "line-color": lineDef.color,
      "line-width": 5,
      "line-opacity": 0.9,
      "line-dasharray": [0.01, 2] // 👈 animation start
    }
  });

  RAIL_LAYER_IDS.push(lineDef.id);
}

function animateRailLine(layerId) {
  let dash = 0.01;
  const interval = setInterval(() => {
    if (!map.getLayer(layerId)) return clearInterval(interval);
    dash += 0.1;
    map.setPaintProperty(layerId, "line-dasharray", [dash, 2]);
    if (dash > 2) clearInterval(interval);
  }, 30);
}

function addStationDotsHidden(key, stations, strokeColor) {
  if (typeof DATA === "undefined") return;

  const features = stations
    .map(name => ({
      type: "Feature",
      properties: { name },
      geometry: { type: "Point", coordinates: DATA.coords[name] }
    }))
    .filter(f => f.geometry.coordinates);

  const src = `stations-${key}-src`;
  const layer = `stations-${key}`;

  map.addSource(src, {
    type: "geojson",
    data: { type: "FeatureCollection", features }
  });

  map.addLayer({
    id: layer,
    type: "circle",
    source: src,
    layout: { visibility: "none" },
    paint: {
      "circle-radius": 4,
      "circle-color": "#fff",
      "circle-stroke-width": 3,
      "circle-stroke-color": strokeColor
    }
  });

  // click station -> zoom + popup
  map.on("click", layer, e => {
    const coord = e.features[0].geometry.coordinates;
    const name = e.features[0].properties.name;

    // remove existing popups so they don't stack
    document.querySelectorAll(".mapboxgl-popup").forEach(p => p.remove());

    map.flyTo({ center: coord, zoom: 15 });

    new mapboxgl.Popup()
      .setLngLat(coord)
      .setText(name)
      .addTo(map);
  });

  RAIL_STATION_LAYER_IDS.push(layer);

  // hover tooltip
  map.on("mouseenter", layer, e => {
    map.getCanvas().style.cursor = "pointer";
    new mapboxgl.Popup({ closeButton: false })
      .setLngLat(e.features[0].geometry.coordinates)
      .setText(e.features[0].properties.name)
      .addTo(map);
  });

  map.on("mouseleave", layer, () => {
    map.getCanvas().style.cursor = "";
    document.querySelectorAll(".mapboxgl-popup").forEach(p => p.remove());
  });
}

function hideRails() {
  RAIL_LAYER_IDS.forEach(id => {
    if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", "none");
  });
  RAIL_STATION_LAYER_IDS.forEach(id => {
    if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", "none");
  });
}

function showRail(key) {
  hideRails();

  const def = window.RAIL_LINES?.[key];
  if (!def) return;

  if (map.getLayer(def.id)) {
    map.setLayoutProperty(def.id, "visibility", "visible");
    animateRailLine(def.id);
  }

  const stationLayerId = `stations-${key}`;
  if (map.getLayer(stationLayerId)) {
    map.setLayoutProperty(stationLayerId, "visibility", "visible");
  }

  if (Array.isArray(def.coords) && def.coords.length >= 2) {
    const bounds = new mapboxgl.LngLatBounds();
    def.coords.forEach(c => bounds.extend(c));
    map.fitBounds(bounds, { padding: 80 });
  }
}

window.MapUI = { map, focusOnPoint, clearBoardMarkers };
window.RouteDraw = { clearRoute, drawRoute };
window.RailUI = { show: showRail, hide: hideRails };

map.on("load", () => {
  ensureRouteLayer();

  // 🚦 Traffic layer (Mapbox)
map.addSource("mapbox-traffic", {
  type: "raster",
  tiles: [
    `https://api.mapbox.com/v4/mapbox.mapbox-traffic-v1/{z}/{x}/{y}.png?access_token=${mapboxgl.accessToken}`
  ],
  tileSize: 256
});

map.addLayer({
  id: "traffic-layer",
  type: "raster",
  source: "mapbox-traffic",
  paint: {
    "raster-opacity": 0.85
  }
});


  if (window.RAIL_LINES) {
    addRailLineLayerHidden(window.RAIL_LINES.lrt1);
    addRailLineLayerHidden(window.RAIL_LINES.lrt2);
    addRailLineLayerHidden(window.RAIL_LINES.mrt3);

    if (typeof DATA !== "undefined") {
      addStationDotsHidden("lrt1", DATA.lrt1Stations, window.RAIL_LINES.lrt1.color);
      addStationDotsHidden("lrt2", DATA.lrt2Stations, window.RAIL_LINES.lrt2.color);
      addStationDotsHidden("mrt3", DATA.mrtStations, window.RAIL_LINES.mrt3.color);
    }
  } else {
    console.warn("⚠️ window.RAIL_LINES not found. Add it in config.js first.");
  }

  console.log("✅ Mapbox loaded successfully");
});