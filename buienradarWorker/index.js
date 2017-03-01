module.exports = function() {
	var moment = require('moment');
	//var converter = require('hsl-to-rgb');
	// inserted here because module does not have module.exports
	// expected hue range: [0, 360)
	// expected saturation range: [0, 1]
	// expected lightness range: [0, 1]
	var converter = function(hue, saturation, lightness){
	  // based on algorithm from http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
	  if( hue == undefined ){
	    return [0, 0, 0];
	  }

	  var chroma = (1 - Math.abs((2 * lightness) - 1)) * saturation;
	  var huePrime = hue / 60;
	  var secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1));

	  huePrime = Math.floor(huePrime);
	  var red;
	  var green;
	  var blue;

	  if( huePrime === 0 ){
	    red = chroma;
	    green = secondComponent;
	    blue = 0;
	  }else if( huePrime === 1 ){
	    red = secondComponent;
	    green = chroma;
	    blue = 0;
	  }else if( huePrime === 2 ){
	    red = 0;
	    green = chroma;
	    blue = secondComponent;
	  }else if( huePrime === 3 ){
	    red = 0;
	    green = secondComponent;
	    blue = chroma;
	  }else if( huePrime === 4 ){
	    red = secondComponent;
	    green = 0;
	    blue = chroma;
	  }else if( huePrime === 5 ){
	    red = chroma;
	    green = 0;
	    blue = secondComponent;
	  }

	  var lightnessAdjustment = lightness - (chroma / 2);
	  red += lightnessAdjustment;
	  green += lightnessAdjustment;
	  blue += lightnessAdjustment;

	  return [Math.round(red * 255), Math.round(green * 255), Math.round(blue * 255)];

	};
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
