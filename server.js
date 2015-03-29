// pngpng
var express = require('express')
var app = express()
var request = require('request')
var fs = require('fs')
var bodyParser = require('body-parser')
var spawn = require('child_process').spawn
var port = 3004;
var HOSTNAME = 'http://localhost:'+port;

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
// serve static files if requested directly
app.use('/static', express.static(__dirname + '/tmp'));
app.set('json spaces', 0);

app.get('/', function(req, res){
  res.json({
    'error': 'Invalid Request'
  });
});

app.use('/chart', require('./chart-endpoints'));

var server = app.listen(port, function () {
  var host = server.address().address
  var port = server.address().port

  console.log('Chart server listening at http://%s:%s', host, port)

  var hc_convert = spawn('phantomjs', ['highcharts-scripts/highcharts-convert.js', '-host', '127.0.0.1', '-port', '3003'], { cwd: __dirname });
  hc_convert.stdout.on('data', function (data) {
    console.log('highcharts_convert DEBUG: ' + data);
  });

  hc_convert.stderr.on('data', function (data) {
    console.log('highcharts_convert ERROR: ' + data);
  });
});