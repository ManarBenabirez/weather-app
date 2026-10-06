const API_KEY = '105d399e98915ae158dbc4c411257bf5';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Elements
const cityInput = document.querySelector('#cityInput');
const searchBtn = document.querySelector('.search-btn');
const locationBtn = document.querySelector('.location-btn');
const weatherBox = document.querySelector('#weather');
const detailsBox = document.querySelector('#details');
const errorBox = document.querySelector('#error');
const errorMessage = document.querySelector('#errorMessage');
const cityName = document.querySelector('#cityName');
const weatherIcon = document.querySelector('#weatherIcon');
const temperature = document.querySelector('#temperature');
const condition = document.querySelector('#condition');
const humidity = document.querySelector('#humidity');
const wind = document.querySelector('#wind');

// Icon for each weather type returned by the API
const ICONS = {
  Clear: 'clear.png',
  Clouds: 'cloud.png',
  Rain: 'rain.png',
  Drizzle: 'rain.png',
  Thunderstorm: 'rain.png',
  Snow: 'snow.png',
  Mist: 'mist.png',
  Fog: 'mist.png',
  Haze: 'mist.png',
  Smoke: 'mist.png',
  Dust: 'mist.png'
};

// Fetch weather from the API
async function getWeather(query) {
  try {
    const response = await fetch(`${API_URL}?${query}&units=metric&appid=${API_KEY}`);
    if (!response.ok) throw new Error('City not found');
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError(error.message === 'City not found' ? error.message : 'Network error, please try again.');
  }
}

// Show weather data
function displayWeather(data) {
  const type = data.weather[0].main;

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  weatherIcon.src = `images/${ICONS[type] || 'cloud.png'}`;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  condition.textContent = data.weather[0].description;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

  errorBox.classList.add('hidden');
  weatherBox.classList.remove('hidden');
  detailsBox.classList.remove('hidden');
}

// Show an error message
function showError(message) {
  errorMessage.textContent = message;
  weatherBox.classList.add('hidden');
  detailsBox.classList.add('hidden');
  errorBox.classList.remove('hidden');
}

// Search by city name
function searchCity() {
  const city = cityInput.value.trim();
  if (!city) return showError('Please enter a city name.');
  getWeather(`q=${encodeURIComponent(city)}`);
}

// Search by current position
function searchByLocation() {
  if (!navigator.geolocation) {
    return showError('Geolocation is not supported by your browser.');
  }
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => getWeather(`lat=${coords.latitude}&lon=${coords.longitude}`),
    () => showError('Unable to access your location.')
  );
}

// Events
searchBtn.addEventListener('click', searchCity);
cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') searchCity();
});
locationBtn.addEventListener('click', searchByLocation);
