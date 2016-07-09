var async = require('async');
var airlineService = require('./../services/airlines.service');

/* GET airlines listing. */
exports.getAirlines = function (req, res, next) {
    airlineService.fetchAirlines(function (err, response) {
        if (err) {
            res.status(500).send({error: err});
        } else {
            res.send(response.body);
        }
    });
};

/* GET airports listing. */
exports.getAirports = function (req, res, next) {
    var query = req.query.q || '';
    airlineService.fetchAirports(query, function (err, response) {
        if (err) {
            res.status(500).send({error: err});
        } else {
            res.send(response.body);
        }
    });
};

/* GET search listing. */
exports.search = function (req, res, next) {
    var payload = {
        to: req.query.to || '',
        from: req.query.from || '',
        date: req.query.date || ''
    };
    async.waterfall([
        function (callback) {
            airlineService.fetchAirlines(function (err, response) {
                if (err) {
                    callback(err)
                } else {
                    try {
                        var _result = JSON.parse(response.body)
                    }
                    catch (e) {
                        return callback(response.body)
                    }
                    callback(null, _result);
                }
            })
        },
        function (airlines, callback) {
            var tasks = [];
            airlines.forEach(function (_airline) {
                tasks.push(function (cb) {
                    airlineService.flightSearch(_airline.code, payload, function (err, response) {
                        if (err) {
                            cb(err)
                        } else {
                            try {
                                var _result = JSON.parse(response.body)
                            }
                            catch (e) {
                                return cb(response.body)
                            }
                            cb(null, _result);
                        }
                    })
                });
            });
            async.parallel(tasks, function (err, results) {
                if (err) {
                    return callback(err)
                } else {
                    results = [].concat.apply([], results);
                    callback(null, results);
                }
            })
        }
    ], function (err, searchResult) {
        if (err) {
            res.status(500).send({error: err});
        } else {
            res.send(searchResult);
        }
    });
};