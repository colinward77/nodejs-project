# Sunburn Estimator

A simple Node.js web application that estimates how long it takes for a user to get sunburned based on:

- **User attributes**: Hair color, eye color, Fitzpatrick skin type
- **Weather data**: UV index, cloud coverage, temperature (via WeatherAPI)
- **User location**: Uses browser geolocation to determine latitude/longitude

## How to Run

1. **Clone the Repository**:
   git clone https://github.com/YourUser/nodejs-project.git

   cd nodejs-project

I recommend cloning it in VSCode, as that's what this project was developed in.

Install Dependencies:
  npm install

This should install packages like Express, bcrypt, axios, etc. If this does not work,
try installing each dependency manually with npm install (insert list of dependencies found in package.json)

Start the Server:
  node server.js

By default, it listens on http://localhost:3000.

Open the App:
Go to http://localhost:3000 in your browser.
Register a user.
Log in to view the dashboard and check sunburn times.
