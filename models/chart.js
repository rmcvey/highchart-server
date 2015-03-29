// chart.js

var Chart = function(){}
Chart.prototype = {
  // default chart config
  getChart: function(cols,rows){
    cols = cols.split(',');
    rows = rows.split(',');

    return {
      credits: {
        enabled: false
      },
      chart: { style: {
        color: '#999999',
      }},
      xAxis: { 
        labels: {
           style: {
              color: '#999999'
           }
        },
        categories: cols },
      series: [ { data: rows } ]
    };
  },
  toRequestFormat: function(chart){
    return JSON.stringify({
      infile: JSON.stringify(chart)
    })
  },
  // overrides for line and area charts
  getLineChart: function(query, cols, rows){
    var chart = this.getChart(cols, rows);
    if(query.title){
      chart.title = { 
        text: query.title,
        style: {
          color: '#999999'
        }
      }
    }
    if(query.type){
      chart.chart = {
        type: query.type
      }
      chart.plotOptions = {
        line: {
          dataLabels: {
            enabled: true
          }
        }
      }
    }
    if(query.xName){
      chart.series[0].name = query.xName;
    }
    if(query.yName){
      chart.yAxis = {
        title: { text: query.yName }
      }
    }
    
    return this.toRequestFormat(chart);
  },
  // overrides for pie and wedge charts
  getPieChart: function(query, cols, rows){
    var chart = this.getChart(cols, rows);
    if(query.title){
      chart.title = { 
        text: query.title,
        style: {
          color: '#999999'
        }
      }
    }
    chart.plotOptions = {
      pie: {
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    }

    var temp = chart.series[0];
    temp.type = 'pie';
    temp.name = 'Demographics';
    temp.data = temp.data.map(function(item){
      var t = item.split(':');
      return [t[0], parseFloat(t[1])];
    });
    chart.series[0] = temp;

    return this.toRequestFormat(chart);
  }
};

module.exports = new Chart();