# StatsD AppDynamics backend

## Overview

This is a pluggable backend for [StatsD][statsd], which
publishes stats to [AppDynamics](https://appdynamics.com) using the Machine Agent custom metrics functionality.

The code converts from statsd dot notation to appdynamics pipe notation for metric path.

The 'Custom Metrics' portion of the path is automatically added.

* [Machine Agent HTTP Listener docs](http://docs.appdynamics.com/display/PRO12S/Machine+Agent+HTTP+Listener#MachineAgentHTTPListener-ToactivatetheHTTPlistener)

## Requirements

* [StatsD][statsd] versions >= 0.3.0.
* An [AppDynamics](https://appdynamics.com) account.

## Installation

    $ cd /path/to/statsd
    $ npm install statsd-appdynamics-backend

## Credits:

* Documentation & Readme copied from https://github.com/collectiveidea/statsd-instrumental-backend
* Console.js sample backend

## Running the machine agent

You need to be running the AppDynamics machine agent on some host.  The machine agent exposes a web 
interface that this statsd backend contacts.  If the agent isn't running, your metrics will not flow.
The Machine Agent configuration defines where your AppDynamics Controller is, credentials for 
accessing it, and which Application/Tier the metrics will be stored under.

`start_listener.sh` might help get your machine agent running

## Configuration

Add `statsd-appdynamics-backend` backend to the list of StatsD
backends in the StatsD configuration file:

```js
{
  backends: ["statsd-appdynamics-backend"]
, appdynamics: { base_url: 'http://localhost:8081/machineagent/metrics', hide_statsd: false }
}
```

* base_url: the URL to the Machine Agent listener
* hide_statsd: enable to suppress out the statsd.bad_lines_seen and statsd.packets_received metrics

Start/restart the statsd daemon and your StatsD metrics should now be
pushed to your appdynamics account.

## Test signal
`generate_stats.sh` will produce sample metrics data

## NPM Dependencies

* http

## Development

Pull Requests Accepted

[statsd]: https://github.com/etsy/statsd
