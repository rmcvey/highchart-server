// chart-endpoints.js
var Router  = require('express').Router;
var chart   = require('./models/chart');
var request = require('request');
var fs      = require('fs');
var crypto  = require('crypto');

'use strict';

/**
 * Writes file to disk and serves the image file
 * @param  {base64 data} data
 * @param  {express res object} res
 */
function sendFile(data, req, res){
  var hash = crypto.createHash('md5').update(JSON.stringify(req.query)).digest('hex');
  var fileName = 'tmp/' + hash + '.png'
  var image = false;

  try{
    // try getting from cache
    image = fs.readFileSync([__dirname, fileName].join('/'));
    res.end(image, 'binary');
  } catch(e){
    // write file
    fs.writeFile(fileName, data, {encoding: 'base64'}, function(err){
      if(err){
        console.log(err)
      }
      res.sendFile(__dirname + '/' + fileName);
    });
  }
}

var bootstrap = function(PORT){
  var app = new Router();

  var chartTypes  = ['line', 'pie'];
  var chartServer = {
    uri: ['http://localhost', PORT].join(':')
  };

  chartTypes.forEach(function(chartType){
    /**
     * Sets up endpoints for all chartTypes
     * method names match up to endpoints 'line' => app.get('/line'...) => getLineChart
     */
    app.get('/'+chartType, function(req, res){
      var cap   = chartType.charAt(0).toUpperCase() + chartType.substr(1),
          fn    = ['get', cap, 'Chart'].join(''),
          query = req.query;

      var chartConfig = chart[fn](query, query.cols, query.data);
      chartServer.qs = { data: chartConfig };
      request.get(chartServer, function(err, response, body){
        if(err){
          return res.send({ error: err });
        }
        sendFile(body, req, res);
      });
    });
  });

  return app;
}

module.exports = bootstrap;