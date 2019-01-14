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
  res.render('precipplot',
  { title : 'Daily Precipitation Plots' }
  )
})
server.get('/belowtemp', function (req, res) {
  res.render('belowtempplot',
  { title : 'Daily Temperature Plots' }
  )
})
server.get('/mintemp', function (req, res) {
  res.render('mintempplot',
  { title : 'Daily Temperature Plots' }
  )
})

var port = process.env.PORT || 8080;
server.listen(port, function() {
  console.log("Listening on " + port);
});
