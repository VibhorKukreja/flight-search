var express = require('express');
var request = require('request');
var router = express.Router();

/* GET airlines listing. */
router.get('/airlines', function(req, res, next) {
  request.get({
    url: 'http://node.locomote.com/code-task/airlines'
  }, function (err, response) {
    if(err) console.log(err);
    res.send(response.body || err);
  });
});

/* GET airports listing. */
router.get('/airports', function(req, res, next) {
  var query = req.query.q || '';
  request.get({
    url: 'http://node.locomote.com/code-task/airports?q=' + query
  }, function (err, response) {
    if(err) console.log(err);
    res.send(response.body || err);
  });
});

module.exports = router;
