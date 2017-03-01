var express = require('express');
var router = express.Router();

var worker = require('./worker.js')();

router.get('/forecastio/probability', worker.forecastProbability);
router.get('/forecastio/intensity', worker.forecastIntensity);
router.get('/forecastio/intensity/color', worker.forecastIntensityColor);
router.get('/forecastio/probability/color', worker.forecastProbabilityColor);

module.exports = router;
