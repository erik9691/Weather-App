import "./style.css";
import { format, parse } from "date-fns";

async function getWeatherData(location, inCelsius = true) {
	let units;
	if (inCelsius) {
		units = "uk";
	} else {
		units = "us";
	}

	try {
		const response = await fetch(
			`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${units}&key=5M92PRV9GHGQWMZG843N4HK6F&contentType=json`,
			{ mode: "cors" }
		);

		const data = await response.json();

		const errorDisplay = document.querySelector(".error-message");
		errorDisplay.style.display = "none";

		return data;
	} catch (error) {
		console.error("Error fetching weather data:", error.message);

		const errorDisplay = document.querySelector(".error-message");
		errorDisplay.style.display = "block";
		errorDisplay.innerText = "An error occurred while fetching weather data.";
	}
}

async function displayCurrentWeather(userLocation, inCelsius = true) {
	try {
		const display = document.querySelector(".weather-display");
		const location = display.querySelector(".location");
		const locationDetailed = display.querySelector(".location-detailed");
		const temperature = display.querySelector(".temperature");
		const time = display.querySelector(".time");
		const climate = display.querySelector(".climate");

		const data = await getWeatherData(userLocation, inCelsius);
		if (data) {
			location.innerText = data.resolvedAddress.split(",")[0];

			locationDetailed.innerText = data.resolvedAddress;
			temperature.innerText = data.currentConditions.temp + "°";
			const date = parse(data.currentConditions.datetime, "HH:mm:ss", new Date());
			time.innerText = format(date, "p");
			climate.innerText = data.currentConditions.conditions;

			const errorDisplay = document.querySelector(".error-message");
			errorDisplay.style.display = "none";
		}
	} catch (error) {
		console.error("Error displaying weather data:", error.message);

		const errorDisplay = document.querySelector(".error-message");
		errorDisplay.style.display = "block";
		errorDisplay.innerText = "Unable to display weather data.";
	}
}

function obtainFormData() {
	const form = document.querySelector(".weather-form");
	const submitButton = form.querySelector(".submit-search");

	form.addEventListener("keydown", (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			const chosenLocation =
				e.target.parentNode.querySelector('input[name="location"]').value;
			displayCurrentWeather(chosenLocation);
		}
	});

	submitButton.addEventListener("click", (e) => {
		e.preventDefault();
		const chosenLocation = e.target.parentNode.querySelector('input[name="location"]').value;
		displayCurrentWeather(chosenLocation);
	});
}

obtainFormData();
