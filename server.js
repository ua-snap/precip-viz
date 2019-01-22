#!/bin/env node
var express = require('express'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  stylus = require('stylus'),
  nib = require('nib'),
  morgan = require('morgan'),
  server = express()
var util = require('util')
var moment = require('moment');


function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

server.set('views', __dirname + '/views')
server.set('view engine', 'pug')
server.use(express.static(__dirname + '/public'))
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use(morgan('combined'))
server.locals.moment = moment;

server.get('/', function (req, res) {
  res.render('index',
  { title : 'Weather Visualizations' }
  )
})
server.get('/precipplot', function (req, res) {
  let stationfile = fs.readFileSync('stations.json');
  let stations = JSON.parse(stationfile);
  res.render('precipplot',
  { title : 'Daily Precipitation Plots', stations: stations }
  )
})
server.get('/abovetemp', function (req, res) {
  let stationfile = fs.readFileSync('stations.json');
  let stations = JSON.parse(stationfile);
  res.render('abovetempplot',
  { title : 'Daily Temperature Plots', stations: stations }
  )
})
server.get('/belowtemp', function (req, res) {
  let stationfile = fs.readFileSync('stations.json');
  let stations = JSON.parse(stationfile);
  res.render('belowtempplot',
  { title : 'Daily Temperature Plots', stations: stations }
  )
})
server.get('/minmaxtemp', function (req, res) {
  let stationfile = fs.readFileSync('stations.json');
  let stations = JSON.parse(stationfile);
  res.render('minmaxtempplot',
  { title : 'Daily Temperature Plots', stations: stations }
  )
})
server.get('/mintemp', function (req, res) {
  let stationfile = fs.readFileSync('stations.json');
  let stations = JSON.parse(stationfile);
  res.render('mintempplot',
  { title : 'Daily Temperature Plots', stations: stations }
  )
})
server.get('/maxtemp', function (req, res) {
  let stationfile = fs.readFileSync('stations.json');
  let stations = JSON.parse(stationfile);
  res.render('maxtempplot',
  { title : 'Daily Temperature Plots', stations: stations }
  )
})

var port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log("Listening on " + port);
});
