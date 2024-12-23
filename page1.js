// Fetch Country Data
function fetchCountryData() {
    const searchTerm = document.getElementById("searchBox").value.trim();
    if (searchTerm === "") {
        alert("Please enter a country name.");
        return;
    }

    const loading = document.getElementById("loading");
    loading.classList.remove("d-none");

    const countryUrl = `https://restcountries.com/v3.1/name/${searchTerm}`;
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

// Display Country Data
function displayCountryData(data) {
    const displayArea = document.getElementById("displayArea");
    displayArea.innerHTML = ""; // Clear previous results

    data.forEach(country => {
        const countryDiv = document.createElement("div");
        countryDiv.classList.add("innerDivStyle");

        countryDiv.innerHTML = `
            <h4>${country.name.common}</h4>
            <img src="${country.flags.png}" alt="${country.name.common} Flag">
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <button class="btn btn-info mt-2" onclick="fetchWeatherAndMap('${country.name.common}', ${country.latlng[0]}, ${country.latlng[1]})">Show Weather & Map</button>
            <div id="weather-${country.name.common}" class="mt-3"></div>
            <div id="map-${country.name.common}" class="mt-3" style="height: 300px;"></div>
        `;

        displayArea.appendChild(countryDiv);
    });
}

// Fetch Weather Data and Initialize Map
function fetchWeatherAndMap(countryName, lat, lng) {
    const weatherApiKey = "333267df233e96050e93e5cdc0b0274b"; // Your OpenWeatherMap API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${weatherApiKey}&units=metric`;

    // Fetch Weather Data
    fetch(weatherUrl)
        .then(res => {
            if (!res.ok) throw new Error("Weather data not found");
            return res.json();
        })
        .then(data => {
            const weatherDiv = document.getElementById(`weather-${countryName}`);
            weatherDiv.innerHTML = `
                <h5>Current Weather</h5>
                <p><strong>Condition:</strong> ${data.weather[0].description}</p>
                <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
                <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
            `;

            // Initialize Map
            initMap(countryName, lat, lng);
        })
        .catch(error => {
            alert(error.message);
        });
}

// Initialize Map using Leaflet
function initMap(countryName, lat, lng) {
    const mapDiv = document.getElementById(`map-${countryName}`);
    mapDiv.innerHTML = ""; // Clear previous map content

    const map = L.map(mapDiv).setView([lat, lng], 6); // Set view and zoom level

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add marker
    L.marker([lat, lng]).addTo(map).bindPopup(`<b>${countryName}</b>`).openPopup();
}
