module.exports = function() {
	var moment = require('moment');
	var request = require('request');

	var latestForecast;
	var maxInterval = 1000 * 60 * 5;

	var fetchForecast = function(cb) {
		var lat = "51.222660";
		var lon = "4.410148";
		var url = "http://gps.buienradar.nl/getrr.php?lat=" + lat + "&lon=" + lon;
		request(url,cb);
	}

	return {
		fetchForecast: fetchForecast
	}
};
