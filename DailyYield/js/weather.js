/* =====================================================================
   WEATHER.JS — Premium Weather Dashboard
   ===================================================================== */
const Weather = (() => {

  const CITIES = [
    { name:'New Delhi',    country:'India',       temp:38, feels:44, condition:'Hot & Sunny',     icon:'☀️',  humidity:42, wind:14, pressure:1002, uv:9,  vis:8,  aqi:156, aqi_label:'Unhealthy',   sunrise:'5:42 AM', sunset:'7:18 PM', high:41, low:29, rain:0,  code:'sunny' },
    { name:'Mumbai',       country:'India',       temp:32, feels:39, condition:'Humid & Partly Cloudy', icon:'⛅', humidity:82, wind:22, pressure:1006, uv:7,  vis:6,  aqi:98,  aqi_label:'Moderate',    sunrise:'6:08 AM', sunset:'7:10 PM', high:33, low:27, rain:60, code:'cloudy' },
    { name:'Bangalore',    country:'India',       temp:26, feels:26, condition:'Pleasant',         icon:'🌤',  humidity:68, wind:10, pressure:920,  uv:5,  vis:10, aqi:62,  aqi_label:'Moderate',    sunrise:'6:02 AM', sunset:'6:52 PM', high:28, low:21, rain:20, code:'partly' },
    { name:'New York',     country:'USA',         temp:28, feels:30, condition:'Partly Cloudy',    icon:'⛅', humidity:65, wind:18, pressure:1015, uv:6,  vis:12, aqi:45,  aqi_label:'Good',        sunrise:'5:55 AM', sunset:'8:12 PM', high:30, low:22, rain:15, code:'partly' },
    { name:'London',       country:'UK',          temp:18, feels:16, condition:'Rainy',            icon:'🌧️', humidity:88, wind:26, pressure:998,  uv:2,  vis:4,  aqi:38,  aqi_label:'Good',        sunrise:'5:02 AM', sunset:'9:08 PM', high:20, low:14, rain:80, code:'rain' },
    { name:'Tokyo',        country:'Japan',       temp:30, feels:34, condition:'Humid & Cloudy',   icon:'☁️', humidity:75, wind:12, pressure:1010, uv:5,  vis:8,  aqi:55,  aqi_label:'Moderate',    sunrise:'4:26 AM', sunset:'7:00 PM', high:31, low:24, rain:40, code:'cloudy' },
    { name:'Dubai',        country:'UAE',         temp:42, feels:48, condition:'Hazy & Hot',       icon:'🌫️', humidity:38, wind:20, pressure:1005, uv:11, vis:5,  aqi:122, aqi_label:'Unhealthy',   sunrise:'5:34 AM', sunset:'7:08 PM', high:44, low:35, rain:0,  code:'haze' },
    { name:'Sydney',       country:'Australia',   temp:16, feels:15, condition:'Windy & Clear',    icon:'🌬️', humidity:55, wind:35, pressure:1022, uv:3,  vis:16, aqi:22,  aqi_label:'Good',        sunrise:'7:02 AM', sunset:'5:05 PM', high:18, low:12, rain:10, code:'wind' },
  ];

  const HOURLY = [
    { time:'Now',  icon:'☀️',  temp:38 },{ time:'1 PM', icon:'☀️',  temp:40 },{ time:'2 PM', icon:'☀️',  temp:41 },
    { time:'3 PM', icon:'⛅', temp:40 },{ time:'4 PM', icon:'⛅', temp:39 },{ time:'5 PM', icon:'🌤',  temp:37 },
    { time:'6 PM', icon:'🌤',  temp:35 },{ time:'7 PM', icon:'🌇',  temp:33 },{ time:'8 PM', icon:'🌙',  temp:31 },
    { time:'9 PM', icon:'🌙',  temp:30 },{ time:'10 PM',icon:'🌙',  temp:29 },{ time:'11 PM',icon:'🌙',  temp:28 },
  ];

  const WEEKLY = [
    { day:'Today',    icon:'☀️',  high:41, low:29, rain:0,  condition:'Sunny' },
    { day:'Tomorrow', icon:'⛅', high:39, low:28, rain:10, condition:'Partly Cloudy' },
    { day:'Wed',      icon:'🌧️', high:33, low:25, rain:75, condition:'Rain Showers' },
    { day:'Thu',      icon:'⛈️', high:30, low:23, rain:90, condition:'Thunderstorms' },
    { day:'Fri',      icon:'🌦️', high:32, low:24, rain:50, condition:'Drizzle' },
    { day:'Sat',      icon:'🌤',  high:36, low:26, rain:15, condition:'Mostly Sunny' },
    { day:'Sun',      icon:'☀️',  high:40, low:30, rain:0,  condition:'Sunny' },
  ];

  function getAqiColor(aqi) {
    if (aqi <= 50)  return '#10B981';
    if (aqi <= 100) return '#F59E0B';
    if (aqi <= 150) return '#EF4444';
    return '#7C3AED';
  }

  function getLifeIndex(city) {
    const c = city.condition.toLowerCase();
    return {
      comfort:    city.feels < 28 ? 'Comfortable' : city.feels < 35 ? 'Warm' : 'Very Hot',
      clothing:   city.temp < 20 ? 'Jacket recommended 🧥' : city.temp < 30 ? 'Light clothing 👕' : 'Light & breathable 👗',
      outdoor:    city.rain > 60 ? 'Stay indoors 🏠' : city.uv > 8 ? 'Avoid noon sun 🧴' : 'Good for outdoors 🏃',
      health:     city.aqi > 100 ? 'Wear mask outdoors 😷' : city.humidity > 80 ? 'Stay hydrated 💧' : 'Conditions good ✅',
      travel:     city.rain > 70 ? 'Carry umbrella ☂️' : city.vis < 5 ? 'Fog alert — drive carefully 🚗' : 'Clear travel conditions 🛣️',
    };
  }

  let selectedIndex = 0;

  function render(content) {
    if (!content) return;

    // Use WeatherData if available, else fallback
    const wData = (typeof WeatherData !== 'undefined' && WeatherData.current) ? WeatherData : null;
    const hourly = wData && wData.hourly  ? wData.hourly.slice(0, 12) : HOURLY;
    const weekly = wData && wData.weekly  ? wData.weekly  : WEEKLY;
    const alerts = wData && wData.alerts  ? wData.alerts  : [];

    content.innerHTML = `<div class="weather-page fade-in" id="weather-root">${buildPage(CITIES[0], hourly, weekly, alerts, 0)}</div>`;
    bindEvents(hourly, weekly, alerts);
    if (typeof Animations !== 'undefined') Animations.scrollFade();
  }

  function buildPage(city, hourly, weekly, alerts, idx) {
    const life = getLifeIndex(city);
    const aqiColor = getAqiColor(city.aqi);

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title gold-text">Weather</h1>
          <div style="font-size:0.82rem;color:var(--text-muted);margin-top:0.15rem">📍 ${city.name}, ${city.country}</div>
        </div>
        <select class="input select-input" id="weather-city-select" style="max-width:180px;width:auto">
          ${CITIES.map((c,i) => `<option value="${i}" ${i===idx?'selected':''}>${c.name}</option>`).join('')}
        </select>
      </div>

      ${alerts.length ? `
        <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:var(--radius-md);padding:0.75rem 1rem;margin-bottom:1.25rem;display:flex;gap:0.75rem;align-items:flex-start">
          <span style="font-size:1.3rem;flex-shrink:0">⚠️</span>
          <div><div style="font-weight:700;font-size:0.88rem;color:#f87171">${alerts[0].type}</div><div style="font-size:0.78rem;color:var(--text-secondary);margin-top:0.1rem">${alerts[0].message}</div></div>
        </div>` : ''}

      <div class="weather-hero-grid">
        <div class="weather-main-card glass-card">
          <div class="weather-top-row">
            <div class="weather-icon-huge">${city.icon}</div>
            <div class="weather-temp-block">
              <div class="weather-temp-big">${city.temp}°C</div>
              <div class="weather-condition-text">${city.condition}</div>
              <div class="weather-location-text">📍 ${city.name}</div>
            </div>
            <div class="weather-hilow">
              <div class="weather-hilow-item"><span style="color:var(--negative)">↑</span> ${city.high}°</div>
              <div class="weather-hilow-item"><span style="color:var(--blue)">↓</span> ${city.low}°</div>
            </div>
          </div>
          <div class="weather-details-grid">
            ${detailCard('🌡️','Feels Like',city.feels+'°C')}
            ${detailCard('💧','Humidity',city.humidity+'%')}
            ${detailCard('💨','Wind',city.wind+' km/h')}
            ${detailCard('🔬','Pressure',city.pressure+' hPa')}
            ${detailCard('☀️','UV Index',`${city.uv} <span style="color:${city.uv>7?'var(--negative)':city.uv>4?'var(--warning)':'var(--positive)'}">${city.uv>7?'High':city.uv>4?'Moderate':'Low'}</span>`)}
            ${detailCard('👁️','Visibility',city.vis+' km')}
            ${detailCard('🌅','Sunrise',city.sunrise)}
            ${detailCard('🌇','Sunset',city.sunset)}
            ${detailCard('🌿','Air Quality',`<span style="color:${aqiColor}">${city.aqi} — ${city.aqi_label}</span>`)}
          </div>
        </div>
        <div class="weather-aqi-panel glass-card">
          <div style="font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--text-muted);margin-bottom:0.75rem">Air Quality Index</div>
          <div style="font-size:3rem;font-weight:800;color:${aqiColor};line-height:1">${city.aqi}</div>
          <div style="font-size:0.9rem;font-weight:600;color:${aqiColor};margin-bottom:1rem">${city.aqi_label}</div>
          <div class="aqi-bar-wrap"><div class="aqi-bar-track"><div class="aqi-bar-fill" style="width:${Math.min(city.aqi/300*100,100)}%;background:${aqiColor}"></div></div></div>
          <div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.5rem">
            ${city.aqi<=50?'Air quality is satisfactory.':city.aqi<=100?'Acceptable quality. Sensitive groups may be affected.':city.aqi<=150?'Unhealthy for sensitive groups. Reduce prolonged outdoor exposure.':'Unhealthy. Limit outdoor activities.'}
          </div>
          <div style="margin-top:1rem;display:flex;flex-direction:column;gap:0.5rem">
            ${aqiPollutant('PM2.5',city.aqi*0.4,aqiColor)}
            ${aqiPollutant('PM10',city.aqi*0.6,aqiColor)}
            ${aqiPollutant('O₃',(city.aqi*0.3).toFixed(0),aqiColor)}
            ${aqiPollutant('NO₂',(city.aqi*0.2).toFixed(0),aqiColor)}
          </div>
        </div>
      </div>
    `;
  }

  function detailCard(icon, label, value) {
    return `<div class="weather-detail-card"><div class="weather-detail-icon">${icon}</div><div class="weather-detail-label">${label}</div><div class="weather-detail-value">${value}</div></div>`;
  }

  function aqiPollutant(name, val, color) {
    const pct = Math.min(Number(val)/200*100, 100);
    return `<div><div style="display:flex;justify-content:space-between;font-size:0.72rem;margin-bottom:0.2rem"><span style="color:var(--text-muted)">${name}</span><span style="color:var(--text-secondary)">${val} μg/m³</span></div><div style="height:4px;background:var(--bg-tertiary);border-radius:2px;overflow:hidden"><div style="height:100%;width:${pct}%;background:${color};border-radius:2px;transition:width 0.8s ease"></div></div></div>`;
  }

  function buildHourlySection(hourly) {
    return `
      <div class="section">
        <div class="section-header"><h2 class="section-title">Hourly Forecast</h2></div>
        <div class="weather-hourly-scroll">
          ${hourly.map(h => `
            <div class="weather-hourly-item">
              <div class="weather-hourly-time">${h.time}</div>
              <div class="weather-hourly-icon">${h.icon}</div>
              <div class="weather-hourly-temp">${h.temp}°</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function buildWeeklySection(weekly) {
    return `
      <div class="section">
        <div class="section-header"><h2 class="section-title">7-Day Forecast</h2></div>
        <div class="weather-weekly-grid">
          ${weekly.map(d => `
            <div class="weather-forecast-card glass-card">
              <div class="weather-forecast-day">${d.day}</div>
              <div class="weather-forecast-icon">${d.icon}</div>
              <div class="weather-forecast-cond">${d.condition}</div>
              <div class="weather-forecast-temps">
                <span style="color:var(--negative)">${d.high}°</span>
                <span style="color:var(--blue)">${d.low}°</span>
              </div>
              ${d.rain>0?`<div style="font-size:0.68rem;color:var(--blue);margin-top:0.2rem">💧 ${d.rain}%</div>`:''}
            </div>`).join('')}
        </div>
      </div>`;
  }

  function buildLifeSection(city) {
    const l = getLifeIndex(city);
    const items = [
      { icon:'🌡️', label:'Comfort Level',  value:l.comfort },
      { icon:'👗', label:'Clothing',        value:l.clothing },
      { icon:'🏃', label:'Outdoor Activity',value:l.outdoor },
      { icon:'💚', label:'Health Tip',      value:l.health },
      { icon:'🚗', label:'Travel Advice',   value:l.travel },
    ];
    return `
      <div class="section">
        <div class="section-header"><h2 class="section-title">Life Index</h2></div>
        <div class="weather-life-grid">
          ${items.map(i => `
            <div class="weather-life-card glass-card">
              <div class="weather-life-icon">${i.icon}</div>
              <div class="weather-life-label">${i.label}</div>
              <div class="weather-life-value">${i.value}</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function buildCitiesSection() {
    return `
      <div class="section">
        <div class="section-header"><h2 class="section-title">Other Cities</h2></div>
        <div class="weather-cities-grid">
          ${CITIES.slice(0, 8).map((c,i) => `
            <div class="weather-city-card glass-card" data-city-idx="${i}" style="cursor:pointer">
              <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem">
                <span style="font-size:1.5rem">${c.icon}</span>
                <div>
                  <div style="font-size:0.82rem;font-weight:700;color:var(--text-primary)">${c.name}</div>
                  <div style="font-size:0.68rem;color:var(--text-muted)">${c.country}</div>
                </div>
              </div>
              <div style="font-size:1.5rem;font-weight:800;color:var(--text-primary)">${c.temp}°C</div>
              <div style="font-size:0.72rem;color:var(--text-secondary)">${c.condition}</div>
              <div style="font-size:0.68rem;color:var(--text-muted);margin-top:0.25rem">💧${c.humidity}% 💨${c.wind}km/h</div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function renderFullPage(cityIdx, hourly, weekly, alerts) {
    const city = CITIES[cityIdx] || CITIES[0];
    const root = document.getElementById('weather-root');
    if (!root) return;
    root.innerHTML = buildPage(city, hourly, weekly, alerts, cityIdx) +
      buildHourlySection(hourly) +
      buildWeeklySection(weekly) +
      buildLifeSection(city) +
      buildCitiesSection();
    bindEvents(hourly, weekly, alerts);
    if (typeof Animations !== 'undefined') Animations.scrollFade();
  }

  function bindEvents(hourly, weekly, alerts) {
    const sel = document.getElementById('weather-city-select');
    if (sel) {
      sel.addEventListener('change', e => {
        selectedIndex = parseInt(e.target.value);
        renderFullPage(selectedIndex, hourly, weekly, alerts);
      });
    }
    document.querySelectorAll('[data-city-idx]').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.dataset.cityIdx);
        selectedIndex = idx;
        const sel2 = document.getElementById('weather-city-select');
        if (sel2) sel2.value = idx;
        renderFullPage(idx, hourly, weekly, alerts);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  return { render };
})();
