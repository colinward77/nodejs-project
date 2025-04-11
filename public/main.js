// public/main.js

document.addEventListener('DOMContentLoaded', () => {
    const weatherDisplay = document.getElementById('weather-display');
    const checkSunburnBtn = document.getElementById('check-sunburn-btn');
    const sunburnResultsDiv = document.getElementById('sunburn-results');
    const toggleProfileBtn = document.getElementById('toggle-profile-btn');
    const userProfileDiv = document.getElementById('user-profile');
  
    let userData = null;
    let weatherData = null; // { uvIndex, temperature, cloudCoverage, cloudIconType, isDay }
  
    // ---------------------------------------------
    // 1. Get the user's geolocation & fetch weather info + user data
    // ---------------------------------------------
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Extract latitude & longitude
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
  
            // 1A) Fetch the weather info from our server, passing lat/lon
            const weatherRes = await fetch(`/api/weather-info?lat=${lat}&lon=${lon}`);
            if (!weatherRes.ok) {
              throw new Error('Failed to fetch weather info');
            }
            const weatherJson = await weatherRes.json();
            weatherData = weatherJson; 
            // weatherData => { username, uvIndex, temperature, cloudCoverage, cloudIconType, isDay }
  
            // Build the correct cloud/sun icon
            let iconImg = '';
            if (weatherData.cloudIconType === 'sun') {
              iconImg = '<img src="/icons/sun.png" alt="Sun" class="weather-icon" />';
            } else if (weatherData.cloudIconType === 'cloud') {
              iconImg = '<img src="/icons/cloud.png" alt="Cloud" class="weather-icon" />';
            } else {
              iconImg = '<img src="/icons/partly.png" alt="Partly Cloudy" class="weather-icon" />';
            }
  
            // Display basic weather info on the dashboard
            weatherDisplay.innerHTML = `
              <p>Hello, <strong>${weatherData.username}</strong>!</p>
              <p>Temperature: ${weatherData.temperature} °F</p>
              <p>${iconImg}</p>
              <p>UV Index: ${weatherData.uvIndex}</p>
            `;
  
            // 1B) Fetch the user data (hairColor, eyeColor, skinType, etc.)
            const userRes = await fetch('/api/user');
            if (!userRes.ok) {
              throw new Error('Failed to fetch user info');
            }
            userData = await userRes.json();
  
          } catch (err) {
            console.error('Error loading weather/user data:', err);
            weatherDisplay.textContent = 'Error loading weather data.';
          }
        },
        (error) => {
          // User denied geolocation or an error occurred
          console.error('Geolocation error:', error);
          weatherDisplay.textContent = 'Could not get location. Please allow location access or try again.';
        }
      );
    } else {
      // Browser doesn't support geolocation
      weatherDisplay.textContent = 'Geolocation is not supported by your browser.';
    }
  
    // ---------------------------------------------
    // 2. Check Sunburn Time on button click
    // ---------------------------------------------
    checkSunburnBtn.addEventListener('click', async () => {
      if (!userData || !weatherData) {
        sunburnResultsDiv.innerHTML = 'User or weather data not loaded yet.';
        return;
      }
  
      // If UV=0 or it's night => skip
      if (weatherData.uvIndex === 0 || !weatherData.isDay) {
        sunburnResultsDiv.innerHTML = "You can't get burned right now — it's night time or UV is zero!";
        return;
      }
  
      sunburnResultsDiv.innerHTML = 'Calculating...';
  
      try {
        // POST to /api/sunburn-time with all relevant fields
        const body = {
          uvIndex: weatherData.uvIndex,
          cloudCoverage: weatherData.cloudCoverage,
          hairColor: userData.hairColor,
          eyeColor: userData.eyeColor,
          skinType: userData.skinType
        };
  
        const res = await fetch('/api/sunburn-time', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
  
        if (!res.ok) {
          sunburnResultsDiv.innerHTML = 'Error fetching sunburn time.';
          return;
        }
  
        const data = await res.json();
        // data.sunburnTime => raw minutes
  
        // Convert minutes -> hours + minutes
        const totalMins = data.sunburnTime;
        const hours = Math.floor(totalMins / 60);
        const mins = totalMins % 60;
  
        let timeStr = '';
        if (hours > 0) {
          timeStr = `${hours}h ${mins}m`;
        } else {
          timeStr = `${mins}m`;
        }
  
        sunburnResultsDiv.innerHTML = `<p>Approx Sunburn Time: ${timeStr}</p>`;
  
      } catch (error) {
        console.error('Sunburn time error:', error);
        sunburnResultsDiv.innerHTML = 'Error fetching sunburn time.';
      }
    });
  
    // ---------------------------------------------
    // 3. Toggle user profile details
    // ---------------------------------------------
    toggleProfileBtn.addEventListener('click', () => {
      if (!userData) {
        userProfileDiv.innerHTML = 'User data not loaded yet.';
        return;
      }
      // Show/hide the profile section
      if (userProfileDiv.style.display === 'none') {
        userProfileDiv.style.display = 'block';
        userProfileDiv.innerHTML = `
          <h3>Your Profile</h3>
          <p>Hair Color: ${userData.hairColor}</p>
          <p>Eye Color: ${userData.eyeColor}</p>
          <p>Fitzpatrick Skin Type: ${userData.skinType}</p>
        `;
        toggleProfileBtn.textContent = 'Hide User Profile';
      } else {
        userProfileDiv.style.display = 'none';
        toggleProfileBtn.textContent = 'View User Profile';
      }
    });
  });
  