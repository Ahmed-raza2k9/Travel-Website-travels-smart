// Detail page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get trip ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('id');
    
    if (!tripId) {
        window.location.href = 'catalog.html';
        return;
    }
    
    // Find the trip data
    const trip = window.DESTINATIONS.find(dest => dest.id === tripId);
    
    if (!trip) {
        window.location.href = 'catalog.html';
        return;
    }
    
    // Populate trip information
    populateTripDetails(trip);
    
    // Set up event listeners
    setupEventListeners(trip);
});

function populateTripDetails(trip) {
    // Hero section
    document.getElementById('tripImage').src = trip.image;
    document.getElementById('tripImage').alt = trip.title;
    document.getElementById('tripTitle').textContent = trip.title;
    document.getElementById('tripLocation').textContent = trip.location;
    document.getElementById('tripRating').textContent = trip.rating.toFixed(1);
    document.getElementById('tripDuration').textContent = `${trip.durationDays} days`;
    document.getElementById('tripPrice').textContent = formatCurrency(trip.price);
    
    // Description
    document.getElementById('tripDescription').textContent = trip.desc;
    
    // Sidebar details
    document.getElementById('tripStart').textContent = trip.nextStart;
    document.getElementById('tripDurationSidebar').textContent = `${trip.durationDays} days`;
    document.getElementById('tripRatingSidebar').textContent = trip.rating.toFixed(1);
    document.getElementById('tripPriceSidebar').textContent = formatCurrency(trip.price);
    
    // Highlights
    const highlightsContainer = document.getElementById('tripHighlights');
    highlightsContainer.innerHTML = '';
    trip.tags.forEach(tag => {
        const highlightDiv = document.createElement('div');
        highlightDiv.className = 'highlight-item';
        highlightDiv.innerHTML = `
            <i class="ri-check-line"></i>
            <span>${tag}</span>
        `;
        highlightsContainer.appendChild(highlightDiv);
    });
    
    // Gallery
    const galleryContainer = document.getElementById('tripGallery');
    galleryContainer.innerHTML = '';
    trip.gallery.forEach(image => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${image}" alt="${trip.title}">
        `;
        galleryContainer.appendChild(galleryItem);
    });
    
    // Update page title
    document.title = `${trip.title} - Travel Smart`;
}

function setupEventListeners(trip) {
    // Weather button
    const checkWeatherBtn = document.getElementById('checkWeatherBtn');
    const weatherDisplay = document.getElementById('weatherDisplay');
    
    checkWeatherBtn.addEventListener('click', () => {
        checkWeatherFor(trip, checkWeatherBtn, weatherDisplay);
    });
    
    // Book now button
    const bookNowBtn = document.getElementById('bookNowBtn');
    bookNowBtn.href = `book.html?id=${trip.id}`;
}

async function checkWeatherFor(trip, button, display) {
    button.disabled = true;
    button.innerHTML = '<i class="ri-loader-4-line"></i> Loading...';
    
    try {
        // First, get coordinates for the location
        const geocodingResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trip.location)}&count=1&language=en&format=json`);
        const geocodingData = await geocodingResponse.json();
        
        if (!geocodingData.results || geocodingData.results.length === 0) {
            throw new Error('Location not found');
        }
        
        const { latitude, longitude } = geocodingData.results[0];
        
        // Get weather data
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,visibility,uv_index&current_weather=true&timezone=auto`);
        const weatherData = await weatherResponse.json();
        
        if (!weatherData.current_weather) {
            throw new Error('Weather data not available');
        }
        
        const current = weatherData.current_weather;
        const hourly = weatherData.hourly;
        const currentHour = new Date().getHours();
        const currentIndex = hourly.time.findIndex(time => new Date(time).getHours() === currentHour);
        
        // Get current conditions
        const humidity = hourly.relative_humidity_2m[currentIndex] || hourly.relative_humidity_2m[0];
        const windSpeed = hourly.wind_speed_10m[currentIndex] || hourly.wind_speed_10m[0];
        const visibility = hourly.visibility[currentIndex] || hourly.visibility[0];
        const uvIndex = hourly.uv_index[currentIndex] || hourly.uv_index[0];
        
        // Update weather display
        display.innerHTML = `
            <div class="weather-header">
                <i class="ri-map-pin-line"></i>
                <span>${trip.location}</span>
            </div>
            <div class="weather-temp">${Math.round(current.temperature)}°C</div>
            <div class="weather-desc">${getWeatherDescription(current.weathercode)}</div>
            <div class="weather-details">
                <div class="weather-item">
                    <i class="ri-wind-line"></i>
                    <span>Wind: ${Math.round(windSpeed)} km/h</span>
                </div>
                <div class="weather-item">
                    <i class="ri-drop-line"></i>
                    <span>Humidity: ${humidity}%</span>
                </div>
                <div class="weather-item">
                    <i class="ri-eye-line"></i>
                    <span>Visibility: ${visibility / 1000} km</span>
                </div>
                <div class="weather-item">
                    <i class="ri-sun-line"></i>
                    <span>UV Index: ${Math.round(uvIndex)}</span>
                </div>
            </div>
        `;
        
        display.classList.remove('hidden');
        button.innerHTML = '<i class="ri-refresh-line"></i> Refresh Weather';
        button.disabled = false;
        
    } catch (error) {
        console.error('Weather fetch error:', error);
        display.innerHTML = `
            <div class="weather-error">
                <i class="ri-error-warning-line"></i>
                <span>Unable to fetch weather data. Please try again later.</span>
            </div>
        `;
        display.classList.remove('hidden');
        button.innerHTML = '<i class="ri-cloudy-line"></i> Check Weather';
        button.disabled = false;
    }
}

function getWeatherDescription(code) {
    const descriptions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail'
    };
    return descriptions[code] || 'Unknown';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}
