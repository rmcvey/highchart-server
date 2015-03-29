// chart.js
'use strict';
var _ = require('lodash');

class Chart {
  constructor(){

  }
  // default chart config
  getChart(cols,data){
    // expecting string values here, if cols & rows aren't arrays, convert them into them
    if(cols && !_.isArray(cols)){
      cols = cols.split(',');
    } else {
      cols = [];
    }
    if(data && !_.isArray(data)){
      data = data.split(',');
    } else {
      data = [];
    }

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
      series: [ { data: data } ]
    };
  }
  // turns the chart config into the object that highcharts-convert expects
  toRequestFormat(chart){
    return JSON.stringify({
      infile: JSON.stringify(chart)
    })
  }
  // overrides for line and area charts
  getLineChart(query, cols, data){
    var chart = this.getChart(cols, data);
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
  }
  // overrides for pie and wedge charts
  getPieChart(query, cols, data){
    var chart = this.getChart(cols, data);
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

    // there's a tendency for the numerous levels of JSON encoding to stringify the numbers, which causes issues with HighCharts,
    // map through the data values and convert them to floating point numbers
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