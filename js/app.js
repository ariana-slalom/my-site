(function(){
	const status = document.getElementById('weather-summary');
	const emoji = document.getElementById('weather-emoji');
	const temp = document.getElementById('weather-temp');
	const locationLine = document.getElementById('weather-location');

	function updateWeather(temperature, code) {
		if(temp) temp.textContent = Math.round(temperature);
		if(emoji) emoji.textContent = getEmoji(code);
		if(status) status.textContent = getLabel(code);
	}

	function setMessage(message) {
		if(status) status.textContent = message;
	}

	function setLocation(message) {
		if(locationLine) locationLine.textContent = message;
	}

	function getEmoji(code) {
		if(code === 0) return '☀️';
		if(code >= 1 && code <= 3) return '⛅';
		if(code >= 45 && code <= 48) return '🌫️';
		if((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return '🌧️';
		if(code >= 71 && code <= 77) return '❄️';
		if(code >= 95) return '⛈️';
		return '🌤️';
	}

	function getLabel(code) {
		if(code === 0) return 'Clear skies';
		if(code >= 1 && code <= 3) return 'Partly cloudy';
		if(code >= 45 && code <= 48) return 'Foggy';
		if(code >= 51 && code <= 67) return 'Showers';
		if(code >= 71 && code <= 77) return 'Snowy';
		if(code >= 80 && code <= 82) return 'Rain showers';
		if(code >= 95) return 'Thunderstorms';
		return 'Current conditions';
	}

	if(!navigator.geolocation) {
		setMessage('Geolocation not supported');
		setLocation('Your browser does not support location services.');
		return;
	}

	navigator.geolocation.getCurrentPosition(async function(position) {
		const lat = position.coords.latitude.toFixed(4);
		const lon = position.coords.longitude.toFixed(4);
		setLocation(`Lat ${lat}, Lon ${lon}`);
		try {
			const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&temperature_unit=fahrenheit`;
			const response = await fetch(url);
			const data = await response.json();
			if(data && data.current_weather) {
				updateWeather(data.current_weather.temperature, data.current_weather.weathercode);
			} else {
				setMessage('Weather unavailable');
			}
		} catch (error) {
			setMessage('Unable to load weather');
			setLocation('Try reloading or allowing location.');
			console.error(error);
		}
	}, function(error) {
		setMessage('Location access denied');
		setLocation("Don't forget to enable location to see your weather.");
		console.error(error);
	}, {timeout:10000});
})();
