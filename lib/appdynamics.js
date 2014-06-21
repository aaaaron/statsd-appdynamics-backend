/*jshint node:true, laxcomma:true */
/*
cloned from console.js
docs: http://docs.appdynamics.com//pages/viewpage.action?title=Standalone%20Machine%20Agent%20HTTP%20Listener&spaceKey=PRO13S
target url: http://host:port/machineagent/metrics?name=Custom Metrics|Test|My Metric&value=42&type=average
20140620 aaron - initial pass
*/
var util = require('util');
var http = require('http');

/// HTTP helper method from http://docs.nodejitsu.com/articles/HTTP/clients/how-to-create-a-HTTP-request
callback = function(response)
{
	var str = '';
	
	//another chunk of data has been recieved, so append it to `str`
	response.on('data', function (chunk)
	{
		str += chunk;
	});
	
	//the whole response has been recieved, so we just print it out here
	response.on('end', function ()
	{
		console.log(str);
	});
}

function AppDynamicsBackend(startupTime, config, emitter)
{
	var self = this;
	var base_url = '';
	this.lastFlush = startupTime;
	this.lastException = startupTime;
	this.config = config.appdynamics || {};
	
	// attach
	emitter.on('flush', function(timestamp, metrics) { self.flush(timestamp, metrics); });
	emitter.on('status', function(callback) { self.status(callback); });
}

AppDynamicsBackend.prototype.flush = function(timestamp, metrics)
{
	console.log('Flushing stats at ', new Date(timestamp * 1000).toString());
	
	//?name=Custom Metrics|Test|My Metric&value=42&type=average
	for (var counter in metrics.counters)
	{
		// If the hide_statsd flag is set, skip these two metrics that statsd creates
		if ( this.config.hide_statsd 
		    && (counter == 'statsd.bad_lines_seen'
		    ||  counter == 'statsd.packets_received'
		)) continue;
		// Statsd sends dot-separated metrics, so lets convert to AppD style
		var target_url = this.config.base_url;
		target_url += '?name=Custom+Metrics|'+counter.replace('.','|');
		target_url += '&value='+metrics.counters[counter];
		target_url += '&type=average';
		console.log(target_url);
		http.request(target_url, callback).end();
	};

/*
// Ignoring timers and gauges at present
  var out = {
    counters: metrics.counters,
    timers: metrics.timers,
    gauges: metrics.gauges,
    timer_data: metrics.timer_data,
    counter_rates: metrics.counter_rates,
    sets: function (vals) {
      var ret = {};
      for (var val in vals) {
        ret[val] = vals[val].values();
      }
      return ret;
    }(metrics.sets),
    pctThreshold: metrics.pctThreshold
  };
*/

};

AppDynamicsBackend.prototype.status = function(write)
{
	['lastFlush', 'lastException'].forEach(function(key)
	{
	    write(null, 'console', key, this[key]);
	}, this);
};

exports.init = function(startupTime, config, events) {
	var instance = new AppDynamicsBackend(startupTime, config, events);
	return true;
};
