"use strict";

// Selecting Elements
const cityInput = document.querySelector("#city-input");
const searchtBtn = document.querySelector("#searchBtn");
const apiKey = "39badc712011cc7a4fac8d8e123876d2";
const currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];
const fiveDaysForecastCard = document.querySelector(".day-forecast");
const aqiCard = document.querySelectorAll(".highlights .card")[0];
const aqiList = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
const sunriseCard = document.querySelectorAll(".highlights .card")[1];
const humidityVal = document.querySelector("#humidityVal");
const pressureVal = document.querySelector("#pressureVal");
const visibilityVal = document.querySelector("#visibilityVal");
const windSpeedVal = document.querySelector("#windSpeedVal");
const feelsVal = document.querySelector("#feelsVal");
const hourlyForecastCard = document.querySelector(".hourly-forecast");
const locationBtn = document.querySelector("#locationBtn");

const getWeatherDetails = function (name, lat, lon, country) {
    const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const AIR_POLLUTION_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    fetch(WEATHER_API_URL)
        .then((res) => res.json())
        .then((data) => {
            // Current Weather

            let date = new Date();
            currentWeatherCard.innerHTML = `
                <div class="current-weather">
                        <div class="details">
                            <p>Now</p>
                            <h2>${(data.main.temp - 273.15).toFixed(0)}&deg;C</h2>
                            <p>${data.weather[0].description}</p>
                        </div>
                        <div class="weather-icon">
                            <img class="weather-img" src="https://openweathermap.org/img/wn/${
                                data.weather[0].icon
                            }@2x.png" alt="" />
                        </div>
                    </div>
                    <hr />
                    <div class="card-footer">
                        <p><i class="ri-calendar-line"></i> ${days[date.getDay()]}, ${date.getDate()}, ${
                months[date.getMonth()]
            }, ${date.getFullYear()}</p>
                        <p><i class="ri-map-pin-line"></i> ${name}, ${country}</p>
                    </div>
            `;

            const { sunrise, sunset } = data.sys;
            const { timezone, visibility } = data;
            const { humidity, pressure, feels_like } = data.main;
            const { speed } = data.wind;
            const sunriseTime = moment.utc(sunrise, "X").add(timezone, "seconds").format("hh:mm A");
            const sunsetTime = moment.utc(sunset, "X").add(timezone, "seconds").format("hh:mm A");
            // Sunrise - Sunset
            sunriseCard.innerHTML = `<div class="card-head">
                            <p>Sunrise & Sunset</p>
                        </div>
                        <div class="sunrise-sunset">
                            <div class="item">
                                <div class="icon">
                                    <i class="ri-sun-line"></i>
                                </div>
                                <div>
                                    <p>Sunrise</p>
                                    <h2>${sunriseTime}</h2>
                                </div>
                            </div>
                            <div class="item">
                                <div class="icon">
                                    <i class="ri-sun-fill"></i>
                                </div>
                                <div>
                                    <p>Sunset</p>
                                    <h2>${sunsetTime}</h2>
                                </div>
                            </div>
                        </div>`;
            // Remaining highlight cards
            humidityVal.innerHTML = `${humidity}%`;
            pressureVal.innerHTML = `${pressure}hPa`;
            visibilityVal.innerHTML = `${visibility / 1000}km`;
            windSpeedVal.innerHTML = `${speed}m/s`;
            feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(0)}&deg;C`;
        })
        .catch(() => {
            alert("Failed to fetch current weather");
        });

    fetch(FORECAST_API_URL)
        .then((res) => res.json())
        .then((data) => {
            // Hourly Forecast
            const hourlyForecast = data.list;
            hourlyForecastCard.innerHTML = "";
            for (let i = 0; i <= 7; i++) {
                const hourlyForecastDate = new Date(hourlyForecast[i].dt_txt);
                let hour = hourlyForecastDate.getHours();
                let a = "PM";
                if (hour < 12) a = "AM";
                if (hour == 0) hour = 12;
                if (hour > 12) hour -= 12;

                hourlyForecastCard.innerHTML += `
                    <div class="card">
                        <p>${hour} ${a}</p>
                        <img src="https://openweathermap.org/img/wn/${
                            hourlyForecast[i].weather[0].icon
                        }@2x.png" alt="" />
                        <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(0)}&deg;C</p>
                    </div>
                `;
            }

            // Five Days forecast
            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter((forecast) => {
                const forecastDate = new Date(forecast.dt_txt).getDate();

                if (!uniqueForecastDays.includes(forecastDate)) {
                    return uniqueForecastDays.push(forecastDate);
                }
            });

            fiveDaysForecastCard.innerHTML = "";
            for (let i = 1; i < fiveDaysForecast.length; i++) {
                let date = new Date(fiveDaysForecast[i].dt_txt);

                fiveDaysForecastCard.innerHTML += `
                 <div class="forecast-item">
                        <div class="icon-wrapper">
                            <img src="https://openweathermap.org/img/wn/${
                                fiveDaysForecast[i].weather[0].icon
                            }@2x.png" alt="" />
                            <span>&nbsp;${(fiveDaysForecast[i].main.temp - 273).toFixed(0)}&deg;C</span>
                        </div>
                        <p>${date.getDate()} ${months[date.getMonth()]}</p>
                        <p>${days[date.getDay()]}</p>
                    </div>
                `;
            }
        })
        .catch(() => {
            alert("Failed to fetch weather forecast");
        });
    fetch(AIR_POLLUTION_API_URL)
        .then((res) => res.json())
        .then((data) => {
            // Air Indices

            const { co, no, no2, o3, so2, nh3, pm10, pm2_5 } = data.list[0].components;
            aqiCard.innerHTML = `<div class="card-head">
                            <p>Air Quality Index</p>
                            <p class="air-index aqi-${data.list[0].main.aqi}">${aqiList[data.list[0].main.aqi - 1]}</p>
                        </div>
                        <div class="air-indices">
                            <i class="ri-windy-line"></i>
                            <div class="item">
                                <p>PM2.5</p>
                                <h2>${pm2_5}</h2>
                            </div>
                            <div class="item">
                                <p>PM10</p>
                                <h2>${pm10}</h2>
                            </div>
                            <div class="item">
                                <p>S02</p>
                                <h2>${so2}</h2>
                            </div>
                            <div class="item">
                                <p>CO</p>
                                <h2>${co}</h2>
                            </div>
                            <div class="item">
                                <p>NO</p>
                                <h2>${no}</h2>
                            </div>
                            <div class="item">
                                <p>NO2</p>
                                <h2>${no2}</h2>
                            </div>
                            <div class="item">
                                <p>NH3</p>
                                <h2>${nh3}</h2>
                            </div>
                            <div class="item">
                                <p>O3</p>
                                <h2>${o3}</h2>
                            </div>
                        </div>`;
        })
        .catch(() => alert("Failed to fetch Air Pulltion"));
};

const getCityCoordinates = function () {
    const cityName = cityInput.value.trim();
    cityInput.value = "";
    if (!cityName) return;
    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

    fetch(GEOCODING_API_URL)
        .then((res) => res.json())
        .then((data) => {
            const { name, lat, lon, country } = data[0];
            getWeatherDetails(name, lat, lon, country);
        })
        .catch(() => {
            alert(`Failed to fetch coordinates of ${cityName}`);
        });
};

// Search Button
searchtBtn.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        e.preventDefault();
        getCityCoordinates();
    }
});

// Location Button
const getUserCoordinates = function () {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            let { latitude, longitude } = position.coords;
            const REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

            fetch(REVERSE_GEOCODING_URL)
                .then((res) => res.json())
                .then((data) => {
                    const { name, country } = data[0];
                    getWeatherDetails(name, latitude, longitude, country);
                })
                .catch(() => {
                    alert("Failed to fetch user coordinates");
                });
        },
        (error) => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation permission denied. Please reset location permission to grant access again.");
            }
        }
    );
};
locationBtn.addEventListener("click", getUserCoordinates);
window.addEventListener("load", getUserCoordinates);
