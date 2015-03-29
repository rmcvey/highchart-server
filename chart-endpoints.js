// chart-endpoints.js
var Router  = require('express').Router;
var chart   = require('./models/chart');
var request = require('request');
var fs      = require('fs');

'use strict';

/**
 * Writes file to disk and serves the image file
 * @param  {base64 data} data
 * @param  {express res object} res
 */
function sendFile(data, res){
  var fileName = 'tmp/'+ Math.floor(Math.random() * 10000) + data.slice(10, 32) + '.png'
  fs.writeFile(fileName, data, {encoding: 'base64'}, function(err){
    if(err){
      console.log(err)
    }
    res.sendFile(__dirname + '/' + fileName);
  });
}

var app = new Router();

var chartTypes  = ['line', 'pie'];
var chartServer = {
  uri: 'http://localhost:3003'
};

chartTypes.forEach(function(chartType){
  /**
   * Sets up endpoints for all chartTypes
   * method names match up to endpoints 'line' => app.get('/line'...) => getLineChart
   */
  app.get(`/${chartType}`, function(req, res){
    var cap   = chartType.charAt(0).toUpperCase() + chartType.substr(1),
        fn    = `get${cap}Chart`,
        query = req.query;

    var chartConfig = chart[fn](query, query.cols, query.data);
    chartServer.qs = { data: chartConfig };
    request.get(chartServer, function(err, response, body){
      if(err){
        return res.send({ error: err });
      }
      sendFile(body, res);
    });
  });
});

module.exports = app;