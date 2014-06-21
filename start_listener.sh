#!/bin/bash
java -Dmetric.http.listener=true -Dmetric.http.listener.port=8081 -jar machineagent.jar
