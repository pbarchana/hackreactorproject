# Network Visualizer
A web application for NodePrime that graphically displays connections between servers and switches of a warehouse-scale computer network.


## Setup
* Make sure [mongoDB](http://www.mongodb.org/) is installed and running on default port by running `mongod`
* While in the project folder run `npm install` to get dependencies
* [Generate](https://github.com/NodePrime/hackreactorproject/edit/develop/README.md#generating-data) a new set of mock data
* Run `gulp` to compile the application, and start the server

## Generating Data
* Run `gulp generate` to generate a set of mock data
* Adjust the quantities of servers, switches, and data centers in the **Config** section of gulpfile.js

## Making requests to the server
* GET /all-zoomed to get all server / switch data, formatted for D3 (nodes and links arrays)
* GET /server to get server data
* GET /server/:id to get specific server data
* GET /switch to get all switch data
* GET /switch/:id to get specific switch data
* GET /connection to get all connection data
* GET /data-center to get all data center info

## Views
* There are three views
  * A geographical representation datacenters
  * A flatened view of an individual datacenters
  * A Zoomed in view of an individual datacenter with interface representation

