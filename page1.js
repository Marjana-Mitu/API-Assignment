function fetchCountryData() {
    var searchTerm = document.getElementById("searchBox").value.trim();
    if (searchTerm === "") {
        alert("Please enter a country name.");
        return;
    }

    var loading = document.getElementById("loading");
    loading.classList.remove("d-none");

    var countryUrl = `https://restcountries.com/v3.1/name/${searchTerm}`;
    fetch(countryUrl)
        .then(res => {
            if (!res.ok) throw new Error("Country not found");
            return res.json();
        })
        .then(data => {
            loading.classList.add("d-none");
            displayCountryData(data);
        })
        .catch(error => {
            loading.classList.add("d-none");
            alert(error.message);
        });
}

function displayCountryData(data) {
    var displayArea = document.getElementById("displayArea");
    displayArea.innerHTML = ""; 
    data.forEach(country => {
        var countryDiv = document.createElement("div");
        countryDiv.classList.add("innerDivStyle");

        countryDiv.innerHTML = `
            <h4>${country.name.common}</h4>
            <img src="${country.flags.png}" alt="${country.name.common} Flag">
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <button class="btn btn-info mt-2" onclick="fetchWeather('${country.name.common}', ${country.latlng[0]}, ${country.latlng[1]})">Show Weather</button>
            <div id="weather-${country.name.common}" class="mt-3"></div>
        `;

        displayArea.appendChild(countryDiv);
    });
}

function fetchWeather(countryName, lat, lng) {
    var weatherApiKey = "333267df233e96050e93e5cdc0b0274b"; 
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&units=metric`;

    fetch(weatherUrl)
        .then(res => {
            if (!res.ok) throw new Error("Weather data not found");
            return res.json();
        })
        .then(data => {
            var weatherDiv = document.getElementById(`weather-${countryName}`);
            weatherDiv.innerHTML = `
                <h5>Current Weather</h5>
                <p><strong>Condition:</strong> ${data.weather[0].description}</p>
                <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            `;
        })
        .catch(error => {
            alert(error.message);
        });
}
