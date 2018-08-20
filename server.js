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
  res.render('precipplot',
  { title : 'Daily Precipitation Plots' }
  )
})

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080  
, ip = process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
server.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);
