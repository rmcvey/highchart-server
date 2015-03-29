// chart-endpoints.js
var Router  = require('express').Router;
var chart   = require('./models/chart');
var request = require('request');
var fs      = require('fs');

'use strict';

function sendFile(data, res){
  var fileName = 'tmp/'+ Math.floor(Math.random() * 10000) + data.slice(10, 32) + '.png'
  fs.writeFile(fileName, data, {encoding: 'base64'}, function(err){
    if(err){
      console.log(err)
    }
    res.sendFile(__dirname + '/' + fileName);
    //res.json({ file: HOSTNAME + fileName.replace('tmp/', '/static/') });
  });
}

var app = new Router();

var chartTypes  = ['line', 'pie'];
var chartServer = {
  uri: 'http://localhost:3003'
};

chartTypes.forEach(function(chartType){
  app.get(`/${chartType}`, function(req, res){
    var cap   = chartType.charAt(0).toUpperCase() + chartType.substr(1),
        fn    = `get${cap}Chart`,
        query = req.query;

    var chartConfig = chart[fn](query, query.cols, query.rows);
    chartServer.qs = { data: chartConfig };
    request.get(chartServer, function(err, response, body){
      if(err){
        return res.send({ error: err });
      }
      sendFile(body, res);
    });
  });
});
/*
app.get('/line', function (req, res) {
  var query = req.query;
  var chartUri = chart.getLineChart(query, query.cols, query.rows);
  request.get({ uri: 'http://localhost:3003', qs: {data: chartUri}}, function(err, response, body){
    sendFile(body, res);
  });
})

app.get('/pie', function (req, res) {
  var query = req.query;
  var chartUri = chart.getPieChart(query, query.cols, query.rows);
  request.get({ uri: 'http://localhost:3003', qs: {data: chartUri}}, function(err, response, body){    
    sendFile(body, res);
  });
})*/

module.exports = app;