const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const errorMessage = document.getElementById("errorMessage");

const loader = document.getElementById("loader");
const apiMessage = document.getElementById("apiMessage");

const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const windSpeed = document.getElementById("windSpeed");
const weatherStatus = document.getElementById("weatherStatus");
const weatherIcon = document.getElementById("weatherIcon");

function decodeWeatherCode(code){

    const codes = {
        0:"☀️",
        1:"🌤️",
        2:"⛅",
        3:"☁️",
        45:"🌫️",
        48:"🌫️",
        51:"🌦️",
        53:"🌦️",
        55:"🌦️",
        61:"🌧️",
        63:"🌧️",
        65:"⛈️",
        71:"❄️",
        73:"❄️",
        75:"❄️",
        80:"🌦️",
        81:"🌧️",
        82:"⛈️",
        95:"⛈️"
    };

    return codes[code] || "☀️";
}

function weatherText(code){

    const descriptions = {
        0:"Ensoleillé",
        1:"Principalement dégagé",
        2:"Partiellement nuageux",
        3:"Nuageux",
        45:"Brouillard",
        48:"Brouillard givrant",
        51:"Bruine légère",
        53:"Bruine modérée",
        55:"Bruine dense",
        61:"Pluie légère",
        63:"Pluie modérée",
        65:"Forte pluie",
        71:"Neige légère",
        73:"Neige modérée",
        75:"Forte neige",
        80:"Averses",
        81:"Averses modérées",
        82:"Fortes averses",
        95:"Orage"
    };

    return descriptions[code] || "Inconnu";
}

cityInput.addEventListener("input", () => {

    if(cityInput.value.trim() !== ""){
        cityInput.removeAttribute("aria-invalid");
        errorMessage.textContent = "";
    }

});

weatherForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const city = cityInput.value.trim();

    weatherCard.classList.add("hidden");
    apiMessage.textContent = "";

    if(city === ""){

        cityInput.setAttribute("aria-invalid","true");

        errorMessage.textContent =
        "Veuillez saisir le nom d'une ville.";

        return;
    }

    loader.classList.remove("hidden");

    try{

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
        );

        if(!geoResponse.ok){
            throw new Error("Ville introuvable");
        }

        const geoData = await geoResponse.json();

        if(!geoData.results || geoData.results.length === 0){
            throw new Error("Ville introuvable");
        }

        const cityData = geoData.results[0];

        const latitude = cityData.latitude;
        const longitude = cityData.longitude;

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        if(!weatherResponse.ok){
            throw new Error("Erreur météo");
        }

        const weatherData = await weatherResponse.json();

        cityName.textContent =
        `${cityData.name}, ${cityData.country}`;

        temperature.textContent =
        `${weatherData.current_weather.temperature}°C`;

        windSpeed.textContent =
        `${weatherData.current_weather.windspeed} km/h`;

        weatherStatus.textContent =
        weatherText(
            weatherData.current_weather.weathercode
        );

        weatherIcon.textContent =
        decodeWeatherCode(
            weatherData.current_weather.weathercode
        );

        weatherCard.classList.remove("hidden");

    }catch(error){

        apiMessage.textContent =
        "Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe.";

    }finally{

        loader.classList.add("hidden");

    }

});