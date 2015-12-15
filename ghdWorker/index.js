module.exports = function() {
	var ForecastIo = require('forecastio');
	var moment = require('moment');
	var convertor = require('hsl-to-rgb');

	var forecastIo = new ForecastIo('64972820dbff871bc581a53b7a393e60');
	var latestForecast;
	var maxInterval = 1000*60*5; // 5 minutes in milliseconds

	var fetchForecast = function(cb) {
		forecastIo.forecast('51.202', '4.397', function(err, data) {
		  if (err) throw err;
		  latestForecast = data;
		  cb();
		});
	}

	// THIS SHOULD GO TO A CONTROLLER
	var forecast = function(req,res,extractFunction) {
		if(latestForecast && calculateInterval(latestForecast.currently.time) < maxInterval) {
			console.log("Reusing existing forecast.");
			sendResponse(res,extractFunction(latestForecast));
		} else {
			console.log("Fetching new forecast.");
			fetchForecast(function() {
				sendResponse(res,extractFunction(latestForecast));
			});
		}
	}

	var forecastProbability = function(req,res) {
		forecast(req,res,extractProbability);
	}

	var forecastIntensity = function(req,res) {
		forecast(req,res,extractIntensity);
	}

	var forecastProbabilityColor = function(req,res) {
		forecast(req,res,extractProbabilityColor);
	}

	var forecastIntensityColor = function(req,res) {
		forecast(req,res,extractIntensityColor);
	}

	var sendResponse = function(res,result) {
		res.status(200).send(JSON.stringify(result));
	}

	var calculateInterval = function(a) {
		var interval = moment().diff(moment.unix(a));
		return interval;
	}

	var extractProbability = function(data) {
		var probability = data.hourly.data[0].precipProbability;
		return probability;
	}

	var extractIntensity = function(data) {
		var precipIntensity = data.hourly.data[0].precipIntensity;
		// https://developer.forecast.io/docs/v2
		// 0.002 in./hr. corresponds to very light precipitation, 0.017 in./hr. corresponds to light precipitation, 0.1 in./hr. corresponds to moderate precipitation, and 0.4
		if(precipIntensity < 0.002) {
			return 0;
		} else if(precipIntensity < 0.017) {
			return 1;
		} else if(precipIntensity < 0.1) {
			return 2;
		} else {
			return 3;
		}
	}

	var extractIntensityColor = function(data) {
		var category = extractIntensity(data);
		var inverseCategory = 3 - category;
		var hue = 40 * inverseCategory;
		var rgb = convertor(hue, 1, 0.5);
		console.log(rgb);
		return "R" + rgb[0] + "G" + rgb[1] + "B" + rgb[2] + "E";
	}

	var extractProbabilityColor = function(data) {
		var probability = extractProbability(data);
		var inverseProbability = 1 - probability;
		var hue = 120 * inverseProbability;
		var rgb = convertor(hue, 1, 0.5);
		console.log(rgb);
		return rgb;
	}

	return {
		forecastProbability: forecastProbability,
		forecastIntensity: forecastIntensity,
		forecastIntensityColor: forecastIntensityColor,
		forecastProbabilityColor: forecastProbabilityColor
	}
	
};