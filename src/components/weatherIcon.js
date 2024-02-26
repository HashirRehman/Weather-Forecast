
import React from 'react';
import '../style/weatherIcon.css';

const WeatherIcon = ({ iconCode }) => {
  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

  return (
    <div>
      <img src={iconUrl} alt="Weather Icon" />
    </div>
  );
};

export default WeatherIcon;


// import '../WeatherIcon.css';
