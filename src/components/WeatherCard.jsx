import './WeatherCard.css';
import { getWeatherIcon, formatDate, getWeatherDescription, getWindDirection } from '../utils/helpers';
import WindIcon from "../icons/WindIcon.jsx";

/*
 * Tarjeta de clima actual
 *
 * - Muestra informacion del clima en la ubicacion seleccionada:
 *   - Ciudad, pais y fecha actual
 *   - Temperatura y sensacion termica
 *   - Descripcien textual + icono representativo del clima
 *   - Detalles: humedad, viento, presion, UV, nubosidad, precipitacion
 *
 *   weather objeto con datos de clima y metadatos de ubicacion
 */

function WeatherCard({ weather }) {
  const temperature = Math.round(weather.current.temperature_2m);
  const feelsLike = Math.round(weather.current.apparent_temperature);
  const description = getWeatherDescription(weather.current.weather_code);
  const humidity = weather.current.relative_humidity_2m;
  const windSpeed = Math.round(weather.current.wind_speed_10m);
  const windDirection = getWindDirection(weather.current.wind_direction_10m);
  const pressure = Math.round(weather.current.pressure_msl);
  const uvIndex = weather.current.uv_index || 0;
  const cloudCover = weather.current.cloud_cover;
  const precipitation = weather.current.precipitation || 0;

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div className="location-info">
          <h2>{weather.location.name}{weather.location.country ? `, ${weather.location.country}` : ''}</h2>
          <p className="date">{formatDate(new Date())}</p>
        </div>
      </div>

      <div className="weather-main">
        <div className="temperature-section">
          <div className="main-temp">
            <span className="temperature">{temperature}</span>
            <span className="unit">°C</span>
          </div>
          <div className="weather-icon">
            {getWeatherIcon(weather.current.weather_code, weather.current.is_day)}
          </div>
        </div>
        
        <div className="weather-description">
          <p className="condition">{description}</p>
          <p className="feels-like">Sensación térmica {feelsLike}°C</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <div className="detail-info">
            <span className="detail-label">Humedad</span>
            <span className="detail-value">{humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <WindIcon className="detail-icon" size={18}/>
          <div className="detail-info">
            <span className="detail-label">Viento</span>
            <span className="detail-value">{windSpeed} km/h {windDirection}</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">🌡️</span>
          <div className="detail-info">
            <span className="detail-label">Presión</span>
            <span className="detail-value">{pressure} hPa</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">☀️</span>
          <div className="detail-info">
            <span className="detail-label">Índice UV</span>
            <span className="detail-value">{uvIndex.toFixed(1)}</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">☁️</span>
          <div className="detail-info">
            <span className="detail-label">Nubosidad</span>
            <span className="detail-value">{cloudCover}%</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">🌧️</span>
          <div className="detail-info">
            <span className="detail-label">Precipitación</span>
            <span className="detail-value">{precipitation.toFixed(1)} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;