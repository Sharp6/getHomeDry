var express = require('express');
var router = express.Router();

var ghdWorker = require('./../ghdWorker')();

/* GET home page. */
router.get('/probability', function(req, res) {
  ghdWorker.forecastProbability(req,res);
});

router.get('/intensity', function(req, res) {
  ghdWorker.forecastIntensity(req,res);
});

router.get('/intensity/color', function(req, res) {
  ghdWorker.forecastIntensityColor(req,res);
});

router.get('/probability/color', function(req, res) {
  ghdWorker.forecastProbabilityColor(req,res);
});

module.exports = router;
