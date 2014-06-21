#!/bin/bash 
while [ 1 -gt 0 ]; do
	echo "statsd.test:20|c" | nc -u -w0 127.0.0.1 8125
	echo "Sending metric"
	sleep 20
done
