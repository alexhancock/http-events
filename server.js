(function(){
  var http = require('http');
  var HttpEvents = require('./module');
  var express = require('express');
  var app = express();
  app.use(express.bodyParser());

  var events = new HttpEvents();

  app.post('/on/:eventName', function(req, res){
    var eventName = req.params.eventName;
    events._on(eventName, req.body.postBack);
    res.end('subscribed');
  });

  app.post('/off/:eventName', function(req, res){
    var eventName = req.params.eventName;
    var cbUrl = req.body.postBack;
    events._off(eventName, cbUrl);
    res.end('unsubscribed');
  });

  app.post('/emit/:eventName', function(req, res){
    var eventName = req.params.eventName;
    events._emit(eventName, req.body);
    res.end('emitted');
  });

  module.exports = app;
}());
