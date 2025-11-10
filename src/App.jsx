
import { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import HourlyForecast from './components/HourlyForecast';
import { getWeatherByCity, getWeatherByCoords } from './utils/weatherAPI';

/*
 * App principal de la app del clima
 *
 * - En el montaje intenta obtener la geolocalizacion del usuario
 *   - Si tiene permiso: pide clima por coordenadas
 *   - Si falla/deniega: usa "Montevideo" como fallback
 * - Permite buscar por ciudad desde la barra de busqueda
 * - Renderiza: clima actual, proximas horas y proximos dias
 */

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');

  // Carga inicial: geolocalizacion -> fallback Montevideo
  useEffect(() => {
    let cancelled = false;

    const loadInitial = async () => {
      setLoading(true);
      try {
        const getPosition = () =>
          new Promise((resolve, reject) =>
            navigator.geolocation
              ? navigator.geolocation.getCurrentPosition(resolve, reject, {
                  enableHighAccuracy: true,
                  timeout: 8000,
                  maximumAge: 60000,
                })
              : reject(new Error('Geolocation no disponible'))
          );

        try {
          const pos = await getPosition();
          if (cancelled) return;
          const { latitude, longitude } = pos.coords;
          const data = await getWeatherByCoords(latitude, longitude);
          if (cancelled) return;
          setWeatherData(data);
          setCurrentWeather(data);
          setCity(data.location?.name || '');
          setError(null);
        } catch {
          // Fallback: Montevideo
          const data = await getWeatherByCity('Montevideo');
          if (cancelled) return;
          setWeatherData(data);
          setCurrentWeather(data);
          setCity(data.location?.name || 'Montevideo');
          setError(null);
        }
      } catch (e) {
        setError('No se pudo obtener el clima inicial.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadInitial();
    return () => { cancelled = true; };
  }, []);

  // Buscar por ciudad
  const handleSearch = async (cityName) => {
    if (!cityName.trim()) return;

    setLoading(true);
    try {
      const data = await getWeatherByCity(cityName);
      setWeatherData(data);
      setCurrentWeather(data);
      setCity(data.location.name);
      setError(null);
    } catch (err) {
      setError('No se pudo encontrar la ciudad. Verifica el nombre e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>🌤️ Clima Global</h1>
          <SearchBar onSearch={handleSearch} />
        </header>
        <main style={{ padding: 24 }}>
          <p>Cargando clima...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌤️ Clima Global</h1>
        <SearchBar onSearch={handleSearch} />
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Cerrar</button>
        </div>
      )}

      {!weatherData ? (
        <main style={{ padding: 24 }}>
          <p>No hay datos para mostrar.</p>
        </main>
      ) : (
        <main className="content">
          <section className="current-section">
            {weatherData.current && <WeatherCard weather={weatherData} />}
          </section>

          <section className="hourly-section">
            <h3>Próximas horas</h3>
            {weatherData.hourly && <HourlyForecast hourlyData={weatherData.hourly} />}
          </section>

          <section className="daily-section">
            <h3>Próximos días</h3>
            <div className="daily-scroll">
              {weatherData.daily?.time?.slice(1, 6).map((date, index) => (
                <ForecastCard
                  key={date}
                  forecast={{
                    date,
                    weatherCode: weatherData.daily.weather_code[index],
                    tempMax: weatherData.daily.temperature_2m_max[index],
                    tempMin: weatherData.daily.temperature_2m_min[index],
                    precipitationProbability:
                      weatherData.daily.precipitation_probability_max?.[index] ?? 0,
                    precipitation: weatherData.daily.precipitation_sum?.[index] ?? 0,
                    windSpeed: weatherData.daily.wind_speed_10m_max?.[index] ?? 0,
                    uvIndex: weatherData.daily.uv_index_max?.[index] ?? 0,
                  }}
                />
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

export default App;
