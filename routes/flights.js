var express = require('express');
var airlineController = require('./../controllers/airlines.controller');
var router = express.Router();

/* GET airlines listing. */
router.get('/airlines', airlineController.getAirlines);

/* GET airports listing. */
router.get('/airports', airlineController.getAirports);

/* GET search listing. */
router.get('/search', airlineController.search);

module.exports = router;
