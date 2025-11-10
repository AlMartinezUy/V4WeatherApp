import './HourlyForecast.css';
import { getWeatherIcon, formatTime, getWeatherDescription } from '../utils/helpers';
import WindIcon from "../icons/WindIcon.jsx";

/*
 * Componente de pronostico horario (24h)
 *
 * - Recibe datos horarios (arrays de tiempo, temp, humedad, etc)
 * - Construye un arreglo con las proximas 24 horas
 * - Muestra icono, hora, temperatura y detalles (humedad, precipitacion, viento)
 *
 *  hourlyData objeto con arrays de clima por hora
 */

function HourlyForecast({ hourlyData }) {
  // Obtener las proximas 24 horas
  const next24Hours = hourlyData.time.slice(0, 24).map((time, index) => ({
    time: time,
    temperature: hourlyData.temperature_2m[index],
    humidity: hourlyData.relative_humidity_2m[index],
    precipitation: hourlyData.precipitation[index],
    precipitationProbability: hourlyData.precipitation_probability[index],
    weatherCode: hourlyData.weather_code[index],
    windSpeed: hourlyData.wind_speed_10m[index],
    uvIndex: hourlyData.uv_index[index]
  }));

  return (
    <div className="hourly-forecast">
      <div className="hourly-scroll">
        {next24Hours.map((hour, index) => (
          <div key={index} className="hourly-item">
            <div className="hourly-time">
              {index === 0 ? 'Ahora' : formatTime(hour.time)}
            </div>
            <div className="hourly-icon">
              {getWeatherIcon(hour.weatherCode, true)}
            </div>
            <div className="hourly-temp">
              {Math.round(hour.temperature)}°C
            </div>
            <div className="hourly-details">
              <div className="hourly-detail">
                <span className="detail-icon">💧</span>
                <span>{hour.humidity}%</span>
              </div>
              <div className="hourly-detail">
                <span className="detail-icon">🌧️</span>
                <span>{hour.precipitationProbability || 0}%</span>
              </div>
              <div className="hourly-detail">
                <WindIcon className="detail-icon" size={18}/>
                <span>{Math.round(hour.windSpeed)} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;