const API_KEY = '105d399e98915ae158dbc4c411257bf5';

// Selecting Elements
const cityInput = document.querySelector('#cityInput');
const searchBtn = document.querySelector('.search-btn');
const locationBtn = document.querySelector('.location-btn');
const weatherDiv = document.querySelector('#weather');
const cityName = document.querySelector('#cityName');
const temperature = document.querySelector('#temperature');
const condition = document.querySelector('#condition');
const humidity = document.querySelector('#humidity');
const wind = document.querySelector('#wind');
const errorDiv = document.querySelector('#error');

// Fetch Weather by City Name
async function fetchWeatherByCity(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError(error.message);
  }
}

// Fetch Weather by Geolocation
async function fetchWeatherByLocation(lat, lon) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
    if (!response.ok) throw new Error("Location not found");
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    showError(error.message);
  }
}

// Display Weather Data
function displayWeather(data) {
  weatherDiv.style.display = 'block';
  errorDiv.textContent = '';
  cityName.textContent = data.name;
  temperature.textContent = `${data.main.temp.toFixed(1)}°C`;
  condition.textContent = data.weather[0].description;
  humidity.textContent = `${data.main.humidity}%`;
  wind.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
}

// Show Error
function showError(message) {
  weatherDiv.style.display = 'none';
  errorDiv.textContent = message;
}

// Event Listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeatherByCity(city);
  else showError("Please enter a city name.");
});

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByLocation(latitude, longitude);
      },
      () => showError("Unable to access location.")
    );
  } else {
    showError("Geolocation is not supported by your browser.");
  }
});
