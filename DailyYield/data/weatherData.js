'use strict';

(function() {
  window.WeatherData = {
    current: {
      temp: 84, feelsLike: 89, condition: 'Partly Cloudy', icon: '⛅',
      humidity: 67, wind: 12, windDir: 'SW', visibility: 10,
      uv: 7, pressure: 1013, aqi: 82, aqiLevel: 'Moderate'
    },
    hourly: [
      { time: '6:00 AM', temp: 72, condition: 'Clear', icon: '☀️' },
      { time: '7:00 AM', temp: 74, condition: 'Clear', icon: '☀️' },
      { time: '8:00 AM', temp: 76, condition: 'Clear', icon: '☀️' },
      { time: '9:00 AM', temp: 78, condition: 'Partly Cloudy', icon: '⛅' },
      { time: '10:00 AM', temp: 80, condition: 'Partly Cloudy', icon: '⛅' },
      { time: '11:00 AM', temp: 82, condition: 'Partly Cloudy', icon: '⛅' },
      { time: '12:00 PM', temp: 84, condition: 'Partly Cloudy', icon: '⛅' },
      { time: '1:00 PM', temp: 85, condition: 'Mostly Cloudy', icon: '🌥️' },
      { time: '2:00 PM', temp: 86, condition: 'Mostly Cloudy', icon: '🌥️' },
      { time: '3:00 PM', temp: 84, condition: 'Partly Cloudy', icon: '⛅' },
      { time: '4:00 PM', temp: 83, condition: 'Partly Cloudy', icon: '⛅' },
      { time: '5:00 PM', temp: 82, condition: 'Clear', icon: '☀️' },
      { time: '6:00 PM', temp: 80, condition: 'Clear', icon: '🌅' },
      { time: '7:00 PM', temp: 78, condition: 'Clear', icon: '🌅' },
      { time: '8:00 PM', temp: 76, condition: 'Clear', icon: '🌙' },
      { time: '9:00 PM', temp: 75, condition: 'Clear', icon: '🌙' },
      { time: '10:00 PM', temp: 74, condition: 'Clear', icon: '🌙' },
      { time: '11:00 PM', temp: 73, condition: 'Clear', icon: '🌙' }
    ],
    weekly: [
      { day: 'Saturday', high: 86, low: 72, condition: 'Partly Cloudy', icon: '⛅', rain: 10, desc: 'Pleasant with some clouds' },
      { day: 'Sunday', high: 88, low: 74, condition: 'Mostly Sunny', icon: '☀️', rain: 5, desc: 'Warm and mostly sunny' },
      { day: 'Monday', high: 90, low: 75, condition: 'Sunny', icon: '☀️', rain: 0, desc: 'Hot and sunny' },
      { day: 'Tuesday', high: 91, low: 76, condition: 'Sunny', icon: '☀️', rain: 0, desc: 'Hot and clear' },
      { day: 'Wednesday', high: 87, low: 73, condition: 'Thunderstorms', icon: '⛈️', rain: 80, desc: 'Afternoon thunderstorms likely' },
      { day: 'Thursday', high: 82, low: 70, condition: 'Showers', icon: '🌧️', rain: 60, desc: 'Scattered showers' },
      { day: 'Friday', high: 84, low: 71, condition: 'Partly Cloudy', icon: '⛅', rain: 20, desc: 'Clearing up, partly cloudy' }
    ],
    alerts: [
      { type: 'Heat Advisory', severity: 'Moderate', message: 'Heat index values up to 101°F expected. Stay hydrated and avoid prolonged outdoor exposure.', expires: '8:00 PM EDT' }
    ]
  };
})();
