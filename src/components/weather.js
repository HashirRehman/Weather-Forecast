import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/weather.css';
import WeatherIcon from './weatherIcon';
import cloudIcon from '../images/cloudy.png';
import forecastIcon from '../images/forecast.png';
import sunriseIcon from '../images/sunrise.png';
import windIcon from '../images/wind.png';


const Weather = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState(null);
  const [tomorrowWeather, setTomorrowWeather] = useState(null);

  const apiKey = '50a851d24085df19259c50b54e9e96bc';
  const unit = 'metric';

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoordinates(latitude, longitude);
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );

    const setBackgroundBasedOnTime = () => {
      const currentTime = new Date().getHours();

      let timeOfDay;

      if (currentTime >= 6 && currentTime < 18) {
        timeOfDay = 'day';
      } else {
        timeOfDay = 'night';
      }

      const backgroundImagePath = require(`../images/${timeOfDay}-background.jpg`);
      document.body.style.backgroundImage = `url('${backgroundImagePath}')`;
    };

    setBackgroundBasedOnTime();

  }, []);

  const fetchWeatherByCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`
      );
      setWeatherData(response.data);


      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`
      );
      const groupedForecast = forecastResponse.data.list.reduce((acc, forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US');
        if (!acc[date]) {
          acc[date] = forecast;
        }
        return acc;
      }, {});

      const dailyForecast = Object.values(groupedForecast);
      const next7DaysForecast = dailyForecast.slice(0, 7);
      setWeeklyForecast(next7DaysForecast);

      await fetchTomorrowWeather(latitude, longitude);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const fetchTomorrowWeather = async (latitude, longitude) => {
    try {
      if (city) {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`
        );

        const tomorrowWeatherData = response.data.list[8];
        setTomorrowWeather(tomorrowWeatherData);
      } else {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`
        );

        const tomorrowWeatherData = response.data.list[8];
        setTomorrowWeather(tomorrowWeatherData);
      }
    } catch (error) {
      console.error('Error fetching tomorrow\'s weather data:', error);
    }
  };


  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`
      );
      setWeatherData(response.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`
      );
      const groupedForecast = forecastResponse.data.list.reduce((acc, forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString('en-US');
        if (!acc[date]) {
          acc[date] = forecast;
        }
        return acc;
      }, {});

      const dailyForecast = Object.values(groupedForecast);
      const next7DaysForecast = dailyForecast.slice(0, 7);
      setWeeklyForecast(next7DaysForecast);

      fetchTomorrowWeather();
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };


  return (
    <div >

      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Search</button>

      {weatherData && (
        <div className="weather-info">
          <div className="big-card">
            <div className="main-info-left">
              <p className="temperature"> {Math.round(weatherData.main.temp)} &#8451;</p>
              <WeatherIcon iconCode={weatherData.weather[0].icon} className="custom-icon-class" />


            </div>
            <h2>{weatherData.name}, {weatherData.sys.country}</h2>
             <div className="main-info">
              <p className="description"> {weatherData.weather[0].description}</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
              {weatherData.visibility && <p>Visibility: {weatherData.visibility} meters</p> }
              <p>Feels Like: {weatherData.main.feels_like} &#8451;</p>
              <p>Pressure: {weatherData.main.pressure} &#8451;</p>

            </div>
          </div>

          {tomorrowWeather && (
            <div className="big-card1">
              <div className="main-info-left">
                <p className="temperature"> {Math.round(tomorrowWeather.main.temp)} &#8451;</p>
                <WeatherIcon iconCode={tomorrowWeather.weather[0].icon} />
              </div>
              <h2 className='tomorrow-weather'>Tomorrow's Weather</h2>
              <div className="main-info">
                <p className="description"> {tomorrowWeather.weather[0].description}</p>

                <p>Humidity: {weatherData.main.humidity}%</p>

                {weatherData.visibility && <p>Visibility: {weatherData.visibility} meters</p>}
                <p>Feels Like: {weatherData.main.feels_like} &#8451;</p>
                <p>Pressure: {weatherData.main.pressure} &#8451;</p>
              </div>
            </div>
          )}

          <div className="col-lg-2 small-cards">


            <div className="small-card">
              <h3>Cloudiness</h3>
              <img src={cloudIcon} alt="Wind Icon" className="small-icons1" />
              <p>{weatherData.clouds.all}%</p>
            </div>

            <div className="small-card">
              <h3>Wind</h3>

              <img src={windIcon} alt="Wind Icon" className="small-icons1" />

              <p>Speed: 5 m/s</p>
              <p>Direction: 180°</p>
            </div>

            <div className="small-card">
              <h3>Sunrise</h3>
              <img src={forecastIcon} alt="Wind Icon" className="small-icons1" />
              <p>{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</p>
            </div>

            <div className="small-card">
              <h3>Sunset</h3>
              <img src={sunriseIcon} alt="Wind Icon" className="small-icons1" />
              <p>{new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>

          </div>
        </div>
      )}

      {weeklyForecast && (
        <div className="weekly-forecast">
          <h3 className="weekly-forecast-heading">Weekly Forecast</h3>
          <ul>
            {weeklyForecast.map((forecast, index) => (
              <li key={index}>
                <p>{new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <WeatherIcon iconCode={forecast.weather[0].icon} className="img" />
                <p>{forecast.main.temp} &#8451;</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Weather;
