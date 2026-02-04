// ✅ YOUR MAPBOX TOKEN
mapboxgl.accessToken =
  "pk.eyJ1IjoidmFsbGl3cmkiLCJhIjoiY21rc3llOXU4MWM0eTNlc2F3aG42NGJhcCJ9.T8076x01VHj5Cji-1TdaOA";

// Demo lists (edit anytime)
const DATA = {

  lrt1Stations: [
    "Fernando Poe Jr.","Balintawak","Monumento","5th Avenue","R. Papa","Abad Santos",
    "Blumentritt","Tayuman","Bambang","Doroteo Jose","Carriedo","Central Terminal",
    "United Nations","Pedro Gil","Quirino","Vito Cruz","Gil Puyat","Libertad",
    "EDSA","Baclaran","Redemptorist","MIA Road","PITX","Dr. Santos"
  ],

    lrt2Stations: [
    "Recto", "Legarda", "Pureza", "V. Mapa", "J. Ruiz", "Gilmore",
    "Betty Go-Belmonte", "Araneta Center-Cubao", "Anonas", "Katipunan",
    "Santolan", "Marikina-Pasig", "Antipolo"
  ],

  mrtStations: [
    "North Avenue", "Quezon Avenue", "GMA-Kamuning", "Araneta Center-Cubao",
    "Santolan-Annapolis", "Ortigas", "Shaw Boulevard", "Boni", "Guadalupe",
    "Buendia", "Ayala", "Magallanes", "Taft Avenue"
  ],

  jeepRoutes: [
    "Philcoa ↔ Quiapo",
    "Cubao ↔ Taft",
    "Fairview ↔ Cubao",
    "Proj 2&3 ↔ Kalaw",
    "SM Fairview ↔ Quiapo",
    "SM Fairview ↔ Philcoa",
    "Commonwealth Market ↔ Cubao",
    "Cubao ↔ Divisoria",
    "Cubao ↔ Marikina",
    "Project 4 ↔ Cubao",
    "Katipunan ↔ UP Diliman",
    "Makati (Ayala) ↔ PRC",
    "Guadalupe ↔ Leon Guinto",
    "Pasig Palengke ↔ Quiapo",
    "Rosario ↔ Cubao",
    "Baclaran ↔ Divisoria",
    "Taft ↔ España",
    "Philcoa ↔ SM North",
    "UP Diliman ↔ Philcoa",
    "UP Diliman ↔ Katipunan",
    "Cubao ↔ Sta. Mesa",
    "Cubao ↔ San Juan",
    "Cubao ↔ Anonas",
    "Cubao ↔ QMC",
    "Quezon Ave ↔ Welcome Rotonda",
    "España ↔ Quiapo",
    "Quiapo ↔ Divisoria",
    "Monumento ↔ Divisoria",
    "Blumentritt ↔ Divisoria",
    "Taft ↔ MOA",
    "Baclaran ↔ MOA",
    "Guadalupe ↔ Pateros",
    "Guadalupe ↔ Market! Market! (BGC)",
    "Ayala ↔ Washington",
    "Ayala ↔ MRT Buendia",
    "Pasig Palengke ↔ Marikina",
    "Rosario ↔ Pasig Palengke"
  ],

  busRoutes: [
    "PITX ↔ Lawton",
    "EDSA Carousel (Northbound)",
    "EDSA Carousel (Southbound)",
    "SM Fairview ↔ PITX",
    "Fairview ↔ Buendia",
    "BGC ↔ Ayala (EDSA)",
    "Alabang ↔ Ayala",
    "Alabang ↔ Lawton",
    "Quezon Ave ↔ PITX",
    "Monumento ↔ PITX",
    "Cubao ↔ Alabang",
    "Cubao ↔ PITX",
    "SM North ↔ BGC (via EDSA)",
    "Monumento ↔ Market! Market! (BGC)",
    "Fairview ↔ Ortigas",
    "Alabang ↔ PITX",
    "Taguig (FTI) ↔ Ayala",
    "Makati ↔ SM North",
    "Quezon Ave ↔ Ortigas",
    "PITX ↔ BGC"

  ],

  ferryStations: [
    "Guadalupe Ferry Station",
    "Escolta Ferry Station",
    "PUP Ferry Station",
    "Pinagbuhatan Ferry Station"
  ],

  // Optional coordinates (demo) so map can “focus” when choosing station/route.
  // Add more if you want.
  coords: {
    "Fernando Poe Jr.": [121.0213, 14.6573],
    "Dr. Santos": [120.9980, 14.4850],
    "Monumento": [120.9832, 14.6575],
    "Balintawak": [121.0030, 14.6561],
    "Doroteo Jose": [120.9820, 14.6042],
    "Gil Puyat": [120.9975, 14.5546],
    "EDSA": [120.9970, 14.5365],
    "PITX": [120.9960, 14.5096],
    "Guadalupe Ferry Station": [121.0443, 14.5662],
    "Escolta Ferry Station": [120.9755, 14.5965],
    "PUP Ferry Station": [121.0081, 14.5973],
    "Pinagbuhatan Ferry Station": [121.0883, 14.5586],
    "Philcoa": [121.0583, 14.6516],
    "Cubao": [121.0537, 14.6205],
     
    "Recto": [120.9831, 14.6032],
    "Araneta Center-Cubao": [121.0526, 14.6195],
    "Katipunan": [121.0790, 14.6226],
    "Antipolo": [121.1263, 14.6229],
      // Extra points (approx demo coords)
  "Quiapo": [120.9852, 14.5986],
  "Divisoria": [120.9747, 14.6042],
  "España": [120.9886, 14.6136],
  "SM Fairview": [121.0622, 14.7342],
  "Commonwealth Market": [121.0600, 14.6780],
  "Marikina": [121.0930, 14.6507],
  "Project 4": [121.0660, 14.6335],
  "UP Diliman": [121.0652, 14.6549],
  "Katipunan": [121.0790, 14.6226],
  "Ayala": [121.0273, 14.5493],
  "PRC": [121.0120, 14.5604],
  "Guadalupe": [121.0455, 14.5660],
  "Leon Guinto": [120.9948, 14.5710],
  "Pasig Palengke": [121.0850, 14.5738],
  "Rosario": [121.0889, 14.5889],
  "Baclaran": [120.9993, 14.5344],
  "Taft": [120.9970, 14.5376],
  "BGC": [121.0450, 14.5534],
  "Alabang": [121.0440, 14.4180],
  "Buendia": [121.0424, 14.5547],
  "Quezon Avenue": [121.0367, 14.6425],




    // MRT-3 (approx)
    "North Avenue": [121.0324, 14.6522],
    "Quezon Avenue": [121.0367, 14.6425],
    "GMA-Kamuning": [121.0438, 14.6346],
    "Santolan-Annapolis": [121.0588, 14.6073],
    "Ortigas": [121.0563, 14.5866],
    "Shaw Boulevard": [121.0532, 14.5811],
    "Boni": [121.0484, 14.5730],
    "Guadalupe": [121.0455, 14.5660],
    "Buendia": [121.0424, 14.5547],
    "Ayala": [121.0273, 14.5493],
    "Magallanes": [121.0186, 14.5411],
    "Taft Avenue": [120.9989, 14.5373],

  }

  

};

// ✅ Which lines to draw per selected route/station
// NOTE: Put real coords here later (from/to).
const ROUTE_LINES = {
  // Jeep routes (from -> to)
  "Philcoa ↔ Quiapo": { mode: "jeep", color: "#2563eb", from: DATA.coords["Philcoa"], to: [120.9852, 14.5986] }, // Quiapo Church demo
  "Cubao ↔ Taft": { mode: "jeep", color: "#2563eb", from: [121.059311, 14.617290], to: DATA.coords["Taft"] || [120.9970, 14.5376]},
  "Fairview ↔ Cubao": { mode: "jeep", color: "#2563eb", from: [121.0780, 14.7340],  to: DATA.coords["Cubao"] }, // Fairview demo
  "Proj 2&3 ↔ Kalaw": { mode: "jeep", color: "#2563eb", from: [121.0550, 14.6420],  to: [120.9808, 14.5822] }, // Kalaw/Ermita demo
  "SM Fairview ↔ Quiapo": { mode:"jeep", color:"#2563eb", from: DATA.coords["SM Fairview"], to: DATA.coords["Quiapo"] },
  "SM Fairview ↔ Philcoa": { mode:"jeep", color:"#2563eb", from: DATA.coords["SM Fairview"], to: DATA.coords["Philcoa"] },
  "Commonwealth Market ↔ Cubao": { mode:"jeep", color:"#2563eb", from: DATA.coords["Commonwealth Market"], to: DATA.coords["Cubao"] },
  "Cubao ↔ Divisoria": { mode:"jeep", color:"#2563eb", from: DATA.coords["Cubao"], to: DATA.coords["Divisoria"] },
  "Cubao ↔ Marikina": { mode:"jeep", color:"#2563eb", from: DATA.coords["Cubao"], to: DATA.coords["Marikina"] },
  "Project 4 ↔ Cubao": { mode:"jeep", color:"#2563eb", from: DATA.coords["Project 4"], to: DATA.coords["Cubao"] },
  "Katipunan ↔ UP Diliman": { mode:"jeep", color:"#2563eb", from: DATA.coords["Katipunan"], to: DATA.coords["UP Diliman"] },
  "Makati (Ayala) ↔ PRC": { mode:"jeep", color:"#2563eb", from: DATA.coords["Ayala"], to: DATA.coords["PRC"] },
  "Guadalupe ↔ Leon Guinto": { mode:"jeep", color:"#2563eb", from: DATA.coords["Guadalupe"], to: DATA.coords["Leon Guinto"] },
  "Pasig Palengke ↔ Quiapo": { mode:"jeep", color:"#2563eb", from: DATA.coords["Pasig Palengke"], to: DATA.coords["Quiapo"] },
  "Rosario ↔ Cubao": { mode:"jeep", color:"#2563eb", from: DATA.coords["Rosario"], to: DATA.coords["Cubao"] },
  "Baclaran ↔ Divisoria": { mode:"jeep", color:"#2563eb", from: DATA.coords["Baclaran"], to: DATA.coords["Divisoria"] },
  "Taft ↔ España": { mode:"jeep", color:"#2563eb", from: DATA.coords["Taft"], to: DATA.coords["España"] },
  // ✅ Added demo lines for new Jeep routes
  "Philcoa ↔ SM North": { mode:"jeep", color:"#2563eb", from: DATA.coords["Philcoa"], to: [121.0360, 14.6568] }, // SM North demo
  "UP Diliman ↔ Philcoa": { mode:"jeep", color:"#2563eb", from: DATA.coords["UP Diliman"], to: DATA.coords["Philcoa"] },
  "UP Diliman ↔ Katipunan": { mode:"jeep", color:"#2563eb", from: DATA.coords["UP Diliman"], to: DATA.coords["Katipunan"] },
  "Cubao ↔ Sta. Mesa": { mode:"jeep", color:"#2563eb", from: DATA.coords["Cubao"], to: [121.0087, 14.6047] }, // Sta Mesa demo
  "Cubao ↔ San Juan": { mode:"jeep", color:"#2563eb", from: DATA.coords["Cubao"], to: [121.0300, 14.6010] }, // San Juan demo
  "Cubao ↔ Anonas": { mode:"jeep", color:"#2563eb", from: DATA.coords["Cubao"], to: [121.0647, 14.6287] }, // Anonas demo
  "Cubao ↔ QMC": { mode:"jeep", color:"#2563eb", from: DATA.coords["Cubao"], to: [121.0478, 14.6504] }, // QMC demo
  "Quezon Ave ↔ Welcome Rotonda": { mode:"jeep", color:"#2563eb", from: DATA.coords["Quezon Avenue"], to: [120.9944, 14.6117] }, // Welcome Rotonda demo
  "España ↔ Quiapo": { mode:"jeep", color:"#2563eb", from: DATA.coords["España"], to: DATA.coords["Quiapo"] },
  "Quiapo ↔ Divisoria": { mode:"jeep", color:"#2563eb", from: DATA.coords["Quiapo"], to: DATA.coords["Divisoria"] },
  "Monumento ↔ Divisoria": { mode:"jeep", color:"#2563eb", from: DATA.coords["Monumento"], to: DATA.coords["Divisoria"] },
  "Blumentritt ↔ Divisoria": { mode:"jeep", color:"#2563eb", from: DATA.coords["Blumentritt"] || [120.9870, 14.6226], to: DATA.coords["Divisoria"] },
  "Taft ↔ MOA": { mode:"jeep", color:"#2563eb", from: DATA.coords["Taft"], to: [120.9840, 14.5352] }, // MOA demo
  "Baclaran ↔ MOA": { mode:"jeep", color:"#2563eb", from: DATA.coords["Baclaran"], to: [120.9840, 14.5352] },
  "Guadalupe ↔ Pateros": { mode:"jeep", color:"#2563eb", from: DATA.coords["Guadalupe"], to: [121.0660, 14.5432] }, // Pateros demo
  "Guadalupe ↔ Market! Market! (BGC)": { mode:"jeep", color:"#2563eb", from: DATA.coords["Guadalupe"], to: DATA.coords["BGC"] },
  "Ayala ↔ Washington": { mode:"jeep", color:"#2563eb", from: DATA.coords["Ayala"], to: [121.0149, 14.5532] }, // Washington Makati demo
  "Ayala ↔ MRT Buendia": { mode:"jeep", color:"#2563eb", from: DATA.coords["Ayala"], to: DATA.coords["Buendia"] },
  "Pasig Palengke ↔ Marikina": { mode:"jeep", color:"#2563eb", from: DATA.coords["Pasig Palengke"], to: DATA.coords["Marikina"] },
  "Rosario ↔ Pasig Palengke": { mode:"jeep", color:"#2563eb", from: DATA.coords["Rosario"], to: DATA.coords["Pasig Palengke"] },



  // Bus routes
  "PITX ↔ Lawton": { mode: "bus", color: "#f97316", from: DATA.coords["PITX"] || [120.9960, 14.5096], to: [120.9831, 14.5932] }, // Lawton demo
  "EDSA Carousel (Northbound)": { mode: "bus", color: "#f97316", from: DATA.coords["EDSA"], to: DATA.coords["Monumento"] },
  "EDSA Carousel (Southbound)": { mode: "bus", color: "#f97316", from: DATA.coords["Monumento"], to: DATA.coords["EDSA"] },
  "SM Fairview ↔ PITX": { mode:"bus", color:"#f97316", from: DATA.coords["SM Fairview"], to: DATA.coords["PITX"] },
  "Fairview ↔ Buendia": { mode:"bus", color:"#f97316", from: DATA.coords["SM Fairview"], to: DATA.coords["Buendia"] },
  "BGC ↔ Ayala (EDSA)": { mode:"bus", color:"#f97316", from: DATA.coords["BGC"], to: DATA.coords["Ayala"] },
  "Alabang ↔ Ayala": { mode:"bus", color:"#f97316", from: DATA.coords["Alabang"], to: DATA.coords["Ayala"] },
  "Alabang ↔ Lawton": { mode:"bus", color:"#f97316", from: DATA.coords["Alabang"], to: [120.9831, 14.5932] }, // Lawton demo
  "Quezon Ave ↔ PITX": { mode:"bus", color:"#f97316", from: DATA.coords["Quezon Avenue"], to: DATA.coords["PITX"] },
  "Monumento ↔ PITX": { mode:"bus", color:"#f97316", from: DATA.coords["Monumento"], to: DATA.coords["PITX"] },
  // ✅ Added demo lines for new Bus routes
  "Cubao ↔ Alabang": { mode:"bus", color:"#f97316", from: DATA.coords["Cubao"], to: DATA.coords["Alabang"] },
  "Cubao ↔ PITX": { mode:"bus", color:"#f97316", from: DATA.coords["Cubao"], to: DATA.coords["PITX"] },
  "SM North ↔ BGC (via EDSA)": { mode:"bus", color:"#f97316", from: [121.0360, 14.6568], to: DATA.coords["BGC"] }, // SM North demo
  "Monumento ↔ Market! Market! (BGC)": { mode:"bus", color:"#f97316", from: DATA.coords["Monumento"], to: DATA.coords["BGC"] },
  "Fairview ↔ Ortigas": { mode:"bus", color:"#f97316", from: DATA.coords["SM Fairview"], to: DATA.coords["Ortigas"] },
  "Alabang ↔ PITX": { mode:"bus", color:"#f97316", from: DATA.coords["Alabang"], to: DATA.coords["PITX"] },
  "Taguig (FTI) ↔ Ayala": { mode:"bus", color:"#f97316", from: [121.0455, 14.5243], to: DATA.coords["Ayala"] }, // FTI demo
  "Makati ↔ SM North": { mode:"bus", color:"#f97316", from: DATA.coords["Ayala"], to: [121.0360, 14.6568] }, // SM North demo
  "Quezon Ave ↔ Ortigas": { mode:"bus", color:"#f97316", from: DATA.coords["Quezon Avenue"], to: DATA.coords["Ortigas"] },
  "PITX ↔ BGC": { mode:"bus", color:"#f97316", from: DATA.coords["PITX"], to: DATA.coords["BGC"] },




  // Ferry stations (example: station -> Escolta)
  "Guadalupe Ferry Station":   { mode: "ferry", color: "#06b6d4", from: DATA.coords["Guadalupe Ferry Station"], to: DATA.coords["Escolta Ferry Station"] },
  "Escolta Ferry Station":     { mode: "ferry", color: "#06b6d4", from: DATA.coords["Escolta Ferry Station"], to: DATA.coords["Guadalupe Ferry Station"] },
  "PUP Ferry Station":         { mode: "ferry", color: "#06b6d4", from: DATA.coords["PUP Ferry Station"], to: DATA.coords["Escolta Ferry Station"] },
  "Pinagbuhatan Ferry Station":{ mode: "ferry", color: "#06b6d4", from: DATA.coords["Pinagbuhatan Ferry Station"], to: DATA.coords["Guadalupe Ferry Station"] }
};

  // =====================
// RAIL LINES (LRT-1 / LRT-2 / MRT-3) - built from station arrays
// =====================

// helper: get coords of station name
function coordsOf(name) {
  return DATA.coords[name] || null;
}

// helper: convert station list -> coordinate list, skipping missing coords
function buildLineFromStations(stations) {
  return stations.map(coordsOf).filter(Boolean);
}

// export rail line definitions for map.js to draw
window.RAIL_LINES = {
  lrt1: {
    id: "rail-lrt1",
    name: "LRT-1",
    color: "#16a34a",
    coords: buildLineFromStations(DATA.lrt1Stations)
  },
  lrt2: {
    id: "rail-lrt2",
    name: "LRT-2",
    color: "#7c3aed",
    coords: buildLineFromStations(DATA.lrt2Stations)
  },
  mrt3: {
    id: "rail-mrt3",
    name: "MRT-3",
    color: "#0ea5e9",
    coords: buildLineFromStations(DATA.mrtStations)
  }
};


// =====================
// FARES (DEMO / ESTIMATE)
// =====================
// You can edit these anytime.
const FARES = {
  jeep: {
    default: { min: 13, max: 30 }, // typical range (estimate)
    routes: {
      "Philcoa ↔ Quiapo": { min: 15, max: 25 },
      "Cubao ↔ Taft": { min: 20, max: 35 },
      "Fairview ↔ Cubao": { min: 18, max: 32 },
      "Proj 2&3 ↔ Kalaw": { min: 15, max: 28 }
    }
  },

  bus: {
    default: { min: 25, max: 60 },
    routes: {
      "PITX ↔ Lawton": { min: 25, max: 40 },
      "EDSA Carousel (Northbound)": { min: 15, max: 35 },
      "EDSA Carousel (Southbound)": { min: 15, max: 35 }
    }
  },

  lrt1: { min: 15, max: 45 }, // demo range
  ferry: { min: 20, max: 50 } // demo range
};

// Helper to get a nice fare label
function getFareLabel(mode, key) {
  if (mode === "lrt1") return `Fare: ₱${FARES.lrt1.min}–₱${FARES.lrt1.max}`;
  if (mode === "ferry") return `Fare: ₱${FARES.ferry.min}–₱${FARES.ferry.max}`;

  const m = FARES[mode];
  if (!m) return "";
  const r = (m.routes && m.routes[key]) ? m.routes[key] : m.default;
  return r ? `Fare: ₱${r.min}–₱${r.max}` : "";
}

window.TaraFare = { getFareLabel };