module.exports = function() {
	var moment = require('moment');
	var converter = require('hsl-to-rgb');
	var request = require('request');

	var latestForecast;
	var maxInterval = 1000 * 60 * 5;

	var fetchForecast = function(cb) {
		var lat = "51.222660";
		var lon = "4.410148";
		var url = "http://gps.buienradar.nl/getrr.php?lat=" + lat + "&lon=" + lon;
		
		request(url,cb);
	}

	var forecastColorArray = function(req,res) {
		fetchForecast(function(err,msg,data) {
			var arr = data.split("\r\n");
			arr = arr.filter(function(line) {
				return line.length > 0
			});
			arr = arr.map(function(line) {
				var parts = line.split("|");
				var rainHue = (255 - parts[0] ) * 120 / 255;
				var rgb = converter(rainHue,1,0.5);
				return {
					rain: parts[0],
					colorString: "R" + rgb[0] + "G" + rgb[1] + "B" + rgb[2] + "E",
					colorStringCss: "#" + toHex(rgb[0]) + toHex(rgb[1]) + toHex(rgb[2]),
					time: parts[1]
				}
			});
			
			console.log(arr)
			res.send(arr);
		});
	}

	var toHex = function(value) {
		return ('00' + value.toString(16).toUpperCase()).substr(-2,2);
	}

	return {
		forecastColorArray: forecastColorArray
	}
};