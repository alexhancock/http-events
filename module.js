(function(){
  var _ = require('underscore');
  var request = require('request');
  var EventEmitter = require('events').EventEmitter;

  var Emitter = EventEmitter;

  // Maintain pairings of events and registered callback urls
  var pairings = {};

  Emitter.prototype._on = function(eventName, callBackUrl){

    // Push the url onto the list of listeners for the event,
    // or start a new list if the event doesn't have any subs
    if (pairings[eventName]){
      if (!_.contains(pairings[eventName], callBackUrl)){
        pairings[eventName].push(callBackUrl);
      }
    } else {
      pairings[eventName] = [callBackUrl];
    }

    // Don't pile up subscriptions for the same event/callBack url
    if (EventEmitter.listenerCount(this, eventName)) return;

    this.on(eventName, function(data){
      // Notify all callbacks of the event
      _.each(pairings[eventName], function(url){
        request.post({ uri: url, json: data }, function(err, res){
          if (err) throw new Error('Problem calling: ' + url);
        });
      }, this);
    });
  };

  Emitter.prototype._off = function(eventName, callBackUrl){
    if (!pairings[eventName]) return;

    var urlIndex = pairings[eventName].indexOf(callBackUrl);
    if (urlIndex === -1) return;

    // Remove the url from the list to call back when the event fires
    pairings[eventName].splice(urlIndex, 1);

    // Check to see if it was the last url for the event type,
    // remove the handlers all together, and delete it from pairings
    if (!pairings[eventName].length){
      delete pairings[eventName];
      this.removeAllListeners(eventName);
    }
  };

  Emitter.prototype._emit = function(eventName, data){
    this.emit(eventName, data);
  };

  module.exports = Emitter;

}());
