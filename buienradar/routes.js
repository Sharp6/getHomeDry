var express = require('express');
var router = express.Router();

var utils = require('./../utils');
var worker = require('./worker.js')();

console.log(utils);

var forecastColorArray = function(req,res) {
  worker.fetchForecast(function(err, msg, data) {
    var arr = data
      .split("\r\n")
      .filter(function(line) {
        return line.length > 0
      })
      .map(function(line) {
        var parts = line.split("|");
        var rainHue = (255 - parts[0] ) * 120 / 255;
        console.log(utils);
        var rgb = utils.converter(rainHue,1,0.5);
        return {
          rain: parts[0],
          colorString: "R" + rgb[0] + "G" + rgb[1] + "B" + rgb[2] + "E",
          colorStringCss: "#" + utils.toHex(rgb[0]) + utils.toHex(rgb[1]) + utils.toHex(rgb[2]),
          time: parts[1]
        }
      });

    res.status(200).json(arr);
  });
}

router.get('/', forecastColorArray);
router.get('/buienradar/colorArray', forecastColorArray);

module.exports = router;
