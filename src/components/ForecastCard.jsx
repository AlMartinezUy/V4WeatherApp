import './ForecastCard.css';
import { getWeatherIcon, formatDay, getWeatherDescription } from '../utils/helpers';
import WindIcon from "../icons/WindIcon.jsx";

/*
 * Tarjeta de pronostico diario
 *
 * - Muestra datos del clima para un dia especifico
 * - Incluye: fecha, icono, temperaturas, descripcion y detalles (lluvia, viento, UV)
 *
 *   forecast objeto con datos del dia
 *   forecast.date fecha (YYYY-MM-DD)
 *   forecast.weatherCode codigo meteorologico
 *   forecast.tempMax temperatura maxima
 *   forecast.tempMin temperatura minima
 *   [forecast.precipitationProbability] probabilidad de lluvia (%)
 *   [forecast.precipitation] precipitacion acumulada (mm)
 *   [forecast.windSpeed] velocidad del viento (km/h)
 *   [forecast.uvIndex] indice UV
 */

function ForecastCard({ forecast }) {
  const maxTemp = Math.round(forecast.tempMax);
  const minTemp = Math.round(forecast.tempMin);
  const rainChance = forecast.precipitationProbability || 0;
  const windSpeed = Math.round(forecast.windSpeed);
  const uvIndex = forecast.uvIndex || 0;
  const precipitation = forecast.precipitation || 0;

  return (
    <div className="forecast-card">
      <div className="forecast-day">
        {formatDay(forecast.date)}
      </div>
      
      <div className="forecast-icon">
        {getWeatherIcon(forecast.weatherCode, true)}
      </div>
      
      <div className="forecast-temps">
        <span className="max-temp">{maxTemp}°</span>
        <span className="min-temp">{minTemp}°</span>
      </div>
      
      <div className="forecast-condition">
        {getWeatherDescription(forecast.weatherCode)}
      </div>
      
      <div className="forecast-details">
        <div className="forecast-detail">
          <span className="detail-icon">🌧️</span>
          <span>{precipitation.toFixed(1)} mm</span>
        </div>
        <div className="forecast-detail">
          <span className="detail-icon">💧</span>
          <span>{rainChance}%</span>
        </div>
        <div className="forecast-detail">
          <WindIcon className="detail-icon" size={18} />
          <span>{windSpeed} km/h</span>
        </div>
        <div className="forecast-detail">
          <span className="detail-icon">☀️</span>
          <span>UV {uvIndex.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export default ForecastCard;