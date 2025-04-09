console.log("Bitch working");

const GIPHY_API_KEY = "OG4jeshCvR7NMgLSNPAE0NikVISMNPfw";
const VISUAL_CROSSING_API_KEY = "TAP3W2GBFH8WRYFRZ59K79JKZ";
const metricBtn = document.getElementById("metric-btn");
const giphyImg = document.getElementById("giphy-img");
let globalMetric = null || "uk";

async function fetchGiphy(value = "cats") {
  giphyImg.classList.add("loading");

  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${value}`,
    );

    const data = await response.json();
    const newUrl = data.data.images.original.url;

    giphyImg.onload = () => {
      giphyImg.classList.remove("loading");
      console.log("Image loaded: ", newUrl);
    };

    giphyImg.src = newUrl;
  } catch (error) {
    console.error("Failed to fetch image", error);
    giphyImg.alt = "No GIF available";
    giphyImg.classList.remove("loading");
  }
}
async function getWeatherInfo(location = "mumbai", metric = globalMetric) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${metric}&include=current&key=${VISUAL_CROSSING_API_KEY}&contentType=json`,
    );

    if (!response.ok) {
      const errorText = await response.text(); // get raw text if it's not JSON
      throw new Error(
        `Fetch failed: ${response.status} ${response.statusText}\n${errorText}`,
      );
    }

    const data = await response.json();
    const description = data.days[0].description;
    const temp = data.days[0].temp;
    const uvIndex = data.days[0].uvindex;
    const condition = data.days[0].icon;

    console.log(data);
    return { description, temp, uvIndex, condition };
  } catch (error) {
    console.error("Failed to fetch data", error);
  }
}

async function convertMetric() {
  const metricText = metricBtn.textContent;
  const locationValue = document.getElementById("search-input").value;

  if (metricText == "Celcius 🔁") {
    metricBtn.textContent = "Farenheit 🔁";
    globalMetric = "us";
  } else {
    metricBtn.textContent = "Celcius 🔁";
    globalMetric = "uk";
  }
  if (metricBtn) {
    console.log("convertmetric", locationValue);
    showWeather(locationValue, globalMetric);
  }
  console.log(globalMetric);
}

async function showWeather(location, metric) {
  const weather = await getWeatherInfo(location, metric);
  if (weather) {
    document.getElementById("description").textContent = weather.description;
    document.getElementById("temp-p").textContent = weather.temp;
    document.getElementById("uv-index-p").textContent = weather.uvIndex;
    fetchGiphy(weather.condition);
  }
}

metricBtn.addEventListener("click", function (event) {
  event.preventDefault();
  const locationValue = document.getElementById("search-input").value;
  convertMetric();
});

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const locationValue = document.getElementById("search-input").value;
  showWeather(locationValue);
});

showWeather();
fetchGiphy();

// async function helo () {
// const weatherInfo = await getWeatherInfo("mumbai");
//   console.log(weatherInfo);
// }
// helo();
