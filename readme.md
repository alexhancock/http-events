# HTTP-EVENTS

A straight-forward module which exposes the services of an event emitter over HTTP.

## Usage

You can listen to events, supplying a URL and receive simple HTTP `POST` requests with data when the event is emitted.

This module is an experiment designed to support loosely coupled infrastructural components much in the same way an 
`EventEmitter` does for application components.

## Installation

`npm install http-events`

## API

This module has one call...

* `listen` - Takes a integer value, to specify which port the `http-event` server should listen on.

All the rest of the interaction with this module is done using `application/json` traffic over HTTP. URL Schemes are as follows...

* `/on/:eventName` - Subscribe to have POSTs sent to the callback URL whenever an event fires
* `/off/:eventName` - Unsubscribe from POSTs when the event fires the URL
* `/emit/:eventName` - Emit an event and pass data to other subscribed components

* Both the `/on` and `/off` expect an `application/json` payload of format...
```
{ postBack: 'example.com/someHandlerPath' }
```

* The `/emit` endpoint expects an `application/json` payload with the arguments for the event emission.
```
{ whatever: { json: 'you would like to send' } }
```

## Example

```javascript
// server.js
var httpEvents = require('http-events');
httpEvents.listen(8080);
```

```javascript
// component_one.js
var request = require('request-json');
var express = require('express');
var app = express();
app.use(express.bodyParser());

var client = request.newClient('http://0.0.0.0:8080/');

client.post('on/someEvent', { postBack: 'http://0.0.0.0:9091/someEventHandler' }, function(err, res){
  // res.body === 'subscribed'
});

app.post('/someEventHandler', function(req, res){
  console.log(req.body); // { message: 'Hi!' }
  res.end();
});

app.listen(9091);
```

```javascript
// component_two.js
var request = require('request-json');
var client = request.newClient('http://0.0.0.0:8080/');

client.post('emit/someEvent', { message: 'Should get this' }, function(err, res){
  // res.body === 'emitted'
});
```

## TODOS

* Unit tests
