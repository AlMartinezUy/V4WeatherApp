const BASE_URL = "https://api.open-meteo.com/v1";
const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1";

/*
 * Helper de fetch que devuelve JSON y agrega contexto de error
 * url - URL a consultar
 * [label="request"] - Etiqueta para identificar el origen del error
 * cuando la respuesta no es OK (incluye status y body si existe)
 */


// Helper fetch con manejo de errores
async function fetchJSON(url, label = "request") {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${label}: ${res.status} ${body || ""}`.trim());
  }
  return res.json();
}

// Adjunta nombre de ubicacion si lo tenemos; si no, usa lat/lon
function attachLocation(weather, location) {
  const name =
    location?.name ||
    `${Number(weather.latitude).toFixed(2)}, ${Number(weather.longitude).toFixed(2)}`;
  return {
    ...weather,
    location: {
      name,
      country: location?.country || "",
      latitude: weather.latitude,
      longitude: weather.longitude,
    },
  };
}

// Construye "current" desde hourly para que tus componentes no cambien
function buildCurrentFromHourly(weather) {
  const h = weather?.hourly;
  if (!h?.time?.length) return weather;

  const now = new Date();
  let idx = h.time.findIndex((t) => new Date(t) > now);
  if (idx === -1) idx = h.time.length - 1;
  else if (idx > 0) idx = idx - 1;

  const pick = (arr) => (Array.isArray(arr) ? arr[idx] : undefined);

  return {
    ...weather,
    current: {
      time: h.time[idx],
      temperature_2m: pick(h.temperature_2m),
      relative_humidity_2m: pick(h.relative_humidity_2m),
      apparent_temperature: pick(h.apparent_temperature),
      is_day: pick(h.is_day),
      precipitation: pick(h.precipitation),
      weather_code: pick(h.weather_code),
      wind_speed_10m: pick(h.wind_speed_10m),
      wind_direction_10m: pick(h.wind_direction_10m),
      pressure_msl: pick(h.pressure_msl),
      cloud_cover: pick(h.cloud_cover),
    },
  };
}

// Asegura que hourly/daily tengan todas las claves que usan los componentes
function normalizeArrays(weather) {
  
  if (weather?.hourly?.time?.length) {
    const h = { ...weather.hourly };
    const len = h.time.length;
    const ensure = (key, fill = 0) => {
      if (!Array.isArray(h[key])) h[key] = Array.from({ length: len }, () => fill);
    };

    [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "precipitation_probability",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "pressure_msl",
      "cloud_cover",
      "is_day",
      "uv_index",
    ].forEach((k) => ensure(k, k === "is_day" ? 1 : 0));

    weather = { ...weather, hourly: h };
  }

  
  if (weather?.daily?.time?.length) {
    const d = { ...weather.daily };
    const len = d.time.length;
    const ensure = (key, fill = 0) => {
      if (!Array.isArray(d[key])) d[key] = Array.from({ length: len }, () => fill);
    };

    [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "precipitation_probability_max",
      "wind_speed_10m_max",
      "uv_index_max",
    ].forEach((k) => ensure(k, 0));

    weather = { ...weather, daily: d };
  }

  return weather;
}

// Forecast por coordenadas 
async function fetchForecast(lat, lon) {
  const richHourly = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "precipitation",
    "precipitation_probability",
    "weather_code",
    "wind_speed_10m",
    "wind_direction_10m",
    "pressure_msl",
    "cloud_cover",
    "is_day",
  ];
  const richDaily = [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
    "precipitation_probability_max",
    "wind_speed_10m_max",
    "uv_index_max",
  ];

  const makeUrl = (hourlyVars, dailyVars) => {
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      timezone: "auto",
      timeformat: "iso8601",
      hourly: hourlyVars.join(","),
      daily: dailyVars.join(","),
    });
    return `${BASE_URL}/forecast?${params.toString()}`;
  };

  
  try {
    const w = await fetchJSON(makeUrl(richHourly, richDaily), "forecast");
    const wn = normalizeArrays(w);
    return buildCurrentFromHourly(wn);
  } catch (e) {
    console.warn("forecast (rico) falló, usando fallback:", e?.message || e);
  }

  
  const leanHourly = [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "precipitation",
    "precipitation_probability",
    "weather_code",
    "wind_speed_10m",
    "wind_direction_10m",
    "pressure_msl",
    "cloud_cover",
    "is_day",
  ];
  const leanDaily = [
    "weather_code",
    "temperature_2m_max",
    "temperature_2m_min",
    "precipitation_sum",
    "wind_speed_10m_max",
  ];

  const w2 = await fetchJSON(makeUrl(leanHourly, leanDaily), "forecast (fallback)");
  const w2n = normalizeArrays(w2);
  return buildCurrentFromHourly(w2n);
}


async function getPlaceByCoords(lat, lon) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=es`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("reverse geocoding failed");
    const j = await res.json();

    const name =
      j.city ||
      j.locality ||
      j.principalSubdivision ||
      j.countryName ||
      `${Number(lat).toFixed(2)}, ${Number(lon).toFixed(2)}`;

    const country = j.countryName || j.countryCode || "";
    return { name, country };
  } catch {
    
    return { name: `${Number(lat).toFixed(2)}, ${Number(lon).toFixed(2)}`, country: "" };
  }
}


export const getCityCoordinates = async (cityName) => {
  const url = `${GEOCODING_URL}/search?name=${encodeURIComponent(
    cityName
  )}&count=1&language=es&format=json`;
  const data = await fetchJSON(url, "geocoding search");
  if (!data?.results?.length) throw new Error("Ciudad no encontrada");
  const c = data.results[0];
  return { lat: c.latitude, lon: c.longitude, place: c };
};

export const getWeatherByCity = async (cityName) => {
  const { lat, lon, place } = await getCityCoordinates(cityName);
  const weather = await fetchForecast(lat, lon);
  return attachLocation(weather, { name: place.name, country: place.country });
};

export const getWeatherByCoords = async (lat, lon) => {
  const [weather, place] = await Promise.all([fetchForecast(lat, lon), getPlaceByCoords(lat, lon)]);
  return attachLocation(weather, place);
};



