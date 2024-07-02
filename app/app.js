// api key: b2944cf156c5494f9ae223216240702

//weather app
//display weather and current conditions with graphical representation of the weather at location
//toggle 3 day forecast
//accept a location to display the information for the supplied location

const baseURL = "http://api.weatherapi.com/v1/";
const apiKey = "b2944cf156c5494f9ae223216240702"; //not secure

$(document).ready(initListeners);

function initListeners() {
  getWeather();
}

function getWeather() {
  $("#weatherBtn").on("click", async () => {
    let location = $("#locationId").val();

    if (!location) {
      return $("#weatherOutput").html("Input a location first.");
    }

    let url = baseURL;

    //get forecast if checked, otherwise only get current weather
    if ($("#toggleForecast").is(":checked")) {
      url +=
        "forecast.json?key=" +
        apiKey +
        "&q=" +
        location +
        "&days=3&aqi=no&alerts=no";
    } else {
      url += "current.json?key=" + apiKey + "&q=" + location + "&aqi=no";
    }

    try {
      await fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((response) => {
          displayWeather(response, location);
        });
    } catch (e) {
      console.log(e);
    }
  });
}

function displayWeather(response) {
  if (response.location == undefined) {
    $("#weatherOutput").html("No matching location found.");
  }
  $("#weatherOutput").html(`
      <h2>${response.location.name}, ${response.location.region} | ${response.location.country}</h2>
      <h3>Current Weather</h3>
      <p>${response.current.condition.text}</p>
      <img src="${response.current.condition.icon}"/> 
      <p>Temperature (F): ${response.current.temp_f}</p>
      <p>Humidity: ${response.current.humidity}</p>
      <p>Wind: ${response.current.wind_mph} mph</p>
      <p>Rainfall: ${response.current.precip_in} inches</p>
    `);

  if (response.forecast) {
    $("#weatherOutput").append(`
        <h2>Forecast:</h2>
    `);

    response.forecast.forecastday.forEach((day) => {
      $("#weatherOutput").append(`
        <div class="forecastDay">
            <p>${day.date} | ${day.day.condition.text}</p>
            <img src="${day.day.condition.icon}"/> 
            <p>Average Temp (F): ${day.day.avgtemp_f}</p>
            <p>Average Humidity: ${day.day.avghumidity}</p>
            <p>Chance of Rain: ${day.day.daily_chance_of_rain}%</p>
            <p>Chance of Snow: ${day.day.daily_chance_of_snow}%</p>
        </div>
        `);
    });
  }
}
