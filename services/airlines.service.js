var request = require('request');
var baseURL = 'http://node.locomote.com/code-task';

exports.fetchAirlines = function (callback) {
    request.get(baseURL + '/airlines', callback);
};

exports.fetchAirports = function (query, callback) {
    request.get(baseURL + '/airports?q=' + query, callback);
};

exports.flightSearch = function (airlineCode, queryObj, callback) {
    var query = 'date=' + queryObj.date + '&from=' + queryObj.from + '&to=' + queryObj.to;
    request.get(baseURL + '/flight_search/' + airlineCode + '?' + query, callback);
};
