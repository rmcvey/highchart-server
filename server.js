// required packages
var express      = require('express');
var app          = express();
var bodyParser   = require('body-parser');
var spawn        = require('child_process').spawn
// constants, change these to suit your needs
var PORT         = 3004;
var HC_PORT      = 3003;
var ENV          = 'development';

app.set('port', PORT);
app.set('env', ENV);
app.use(bodyParser.urlencoded({
  extended: true
}));
// serve static files if requested directly
app.use('/static', express.static(__dirname + '/tmp'));
// setup error handler if we are running in dev
if ('development' == app.get('env')) {
  app.use(require('errorhandler')());
}
// remove express' default JSON formatting
app.set('json spaces', 0);

app.get('/', function(req, res){
  res.json({
    'error': 'Invalid Request'
  });
});

app.use('/chart', require('./chart-endpoints')(HC_PORT));

var server = app.listen(PORT, function () {
  var host = server.address().address
  var port = server.address().port

  // spawn highchart-convert server
  var hc_convert = spawn('phantomjs', ['highcharts-scripts/highcharts-convert.js', '-host', '127.0.0.1', '-port', HC_PORT], { cwd: __dirname });
  
  hc_convert.stdout.on('data', function (data) {
    console.log('highcharts_convert DEBUG: ' + data);
  });
  // highchart error listener
  hc_convert.stderr.on('data', function (data) {
    console.log('highcharts_convert ERROR: ' + data);
  });

  console.log('Chart server listening at http://%s:%s', host, port)
});