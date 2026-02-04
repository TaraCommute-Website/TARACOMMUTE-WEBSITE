// Metro Manila city centers (approx)
const CITIES = [
  { name: "Quezon City", lat: 14.6760, lon: 121.0437, accent: "#22c55e" },
  { name: "Manila", lat: 14.5995, lon: 120.9842, accent: "#3b82f6" },
  { name: "Makati", lat: 14.5547, lon: 121.0244, accent: "#f59e0b" },
  { name: "Caloocan", lat: 14.7566, lon: 121.0450, accent: "#ef4444" },
  { name: "Pasay", lat: 14.5378, lon: 121.0014, accent: "#8b5cf6" },
  { name: "Pasig", lat: 14.5764, lon: 121.0851, accent: "#06b6d4" },
  { name: "Pateros", lat: 14.5453, lon: 121.0686, accent: "#10b981" },
  { name: "Taguig", lat: 14.5176, lon: 121.0509, accent: "#f97316" },
  { name: "Mandaluyong", lat: 14.5794, lon: 121.0359, accent: "#0ea5e9" },
  { name: "San Juan", lat: 14.6019, lon: 121.0355, accent: "#a855f7" },
  { name: "Parañaque", lat: 14.4793, lon: 121.0198, accent: "#fb7185" },
  { name: "Las Piñas", lat: 14.4445, lon: 120.9939, accent: "#14b8a6" },
  { name: "Marikina", lat: 14.6507, lon: 121.1029, accent: "#84cc16" },
  { name: "Valenzuela", lat: 14.7000, lon: 120.9830, accent: "#f43f5e" },
  { name: "Muntinlupa", lat: 14.4081, lon: 121.0415, accent: "#6366f1" },
  { name: "Navotas", lat: 14.6694, lon: 120.9426, accent: "#0ea5e9" },
  { name: "Malabon", lat: 14.6681, lon: 120.9658, accent: "#f59e0b" }
];

const grid = document.getElementById("weatherGrid");
const statusEl = document.getElementById("status");
const searchEl = document.getElementById("citySearch");
const refreshBtn = document.getElementById("refreshBtn");

// Weather code → condition + icon
function wxInfo(code) {
  // Simple grouping
  if (code === 0) return { text: "Clear", icon: "☀️" };
  if (code === 1 || code === 2) return { text: "Partly cloudy", icon: "🌤️" };
  if (code === 3) return { text: "Overcast", icon: "☁️" };
  if (code === 45 || code === 48) return { text: "Fog", icon: "🌫️" };

  // drizzle/rain
  if ([51,53,55].includes(code)) return { text: "Drizzle", icon: "🌦️" };
  if ([61,63,65].includes(code)) return { text: "Rain", icon: "🌧️" };
  if ([80,81,82].includes(code)) return { text: "Showers", icon: "🌧️" };

  // thunder
  if (code === 95) return { text: "Thunderstorm", icon: "⛈️" };

  // snow (rare in PH but just in case)
  if ([71,73,75].includes(code)) return { text: "Snow", icon: "🌨️" };

  return { text: `Weather (${code})`, icon: "🌦️" };
}

// Commuter advisory based on rain + wind + heat
function commuterAdvice(tempC, rainPct, windKmh) {
  if (rainPct >= 70) return "Heavy rain likely — bring raincoat/umbrella and expect traffic delays.";
  if (rainPct >= 40) return "Possible rain — prepare for wet commute and slower travel time.";
  if (tempC >= 33) return "Hot conditions — stay hydrated and avoid long walks under the sun.";
  if (windKmh >= 25) return "Windy today — be careful on footbridges and open areas.";
  return "Good commuting weather — ideal time for errands and travel.";
}

async function fetchCityWeather(city) {
  // We request: temp, wind, weather code, humidity, and precipitation probability (hourly)
  // For rain chance we take the nearest hour value.
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}` +
    `&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code` +
    `&hourly=precipitation_probability&timezone=Asia%2FManila`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed weather request");
  const data = await res.json();

  const cur = data.current || {};
  const temp = Math.round(cur.temperature_2m ?? 0);
  const wind = Math.round(cur.wind_speed_10m ?? 0);
  const hum = Math.round(cur.relative_humidity_2m ?? 0);
  const code = cur.weather_code ?? 0;

  // Find rain chance nearest to current time
  let rain = 0;
  try {
    const times = data.hourly?.time || [];
    const probs = data.hourly?.precipitation_probability || [];
    const now = new Date(cur.time);
    let bestIdx = 0;
    let bestDiff = Infinity;

    for (let i = 0; i < times.length; i++) {
      const t = new Date(times[i]);
      const diff = Math.abs(t - now);
      if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
    }
    rain = Math.round(probs[bestIdx] ?? 0);
  } catch {
    rain = 0;
  }

  const w = wxInfo(code);

  return {
    name: city.name,
    accent: city.accent,
    temp,
    wind,
    hum,
    rain,
    cond: w.text,
    icon: w.icon,
    time: cur.time,
    advice: commuterAdvice(temp, rain, wind)
  };
}

function cardHTML(w) {
  const timeLabel = new Date(w.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return `
    <div class="card" style="--accent:${w.accent}">


      <div class="card-top">
        <div class="city">${w.name}</div>
        <div class="wx-icon" aria-hidden="true">${w.icon}</div>
      </div>

      <div class="temp">${w.temp}°C</div>
      <div class="condition">${w.cond}</div>

      <div class="metrics">
        <div class="metric"><span class="micon">💧</span> <div><small>Humidity</small><br>${w.hum}%</div></div>
        <div class="metric"><span class="micon">🌬️</span> <div><small>Wind</small><br>${w.wind} km/h</div></div>
        <div class="metric"><span class="micon">🌧️</span> <div><small>Rain chance</small><br>${w.rain}%</div></div>
        <div class="metric"><span class="micon">🕒</span> <div><small>Updated</small><br>${timeLabel}</div></div>
      </div>

      <div class="advice">${w.advice}</div>
    </div>
  `;
}

function renderCards(list) {
  const q = searchEl.value.trim().toLowerCase();
  const filtered = list.filter(x => x.name.toLowerCase().includes(q));

  grid.innerHTML = filtered.map(cardHTML).join("");

  statusEl.textContent =
    filtered.length
      ? `Showing ${filtered.length}/${list.length} cities`
      : "No cities match your search.";
}

let cache = [];

async function loadAll() {
  statusEl.textContent = "Loading weather…";
  grid.innerHTML = "";

  try {
    const results = await Promise.all(CITIES.map(fetchCityWeather));
    cache = results;
    renderCards(cache);
    statusEl.textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } catch (e) {
    statusEl.textContent = "Weather unavailable (check internet).";
  }
}

searchEl.addEventListener("input", () => renderCards(cache));
refreshBtn.addEventListener("click", loadAll);

loadAll();