# hackreactorproject

## Setup
* make sure [mongoDB](http://www.mongodb.org/) is installed and running on default port by running `mongod`.
* Run `npm install` and `bower install` to get dependencies. 
* Run `node server` to start the server.
* Run `grunt generate` to generate mock data

## Making requests to the server
* GET /nodes to get D3 formatted data (nodes and links arrays)
* GET /all to get all data
* GET /servers to get server data
* GET /switches to get all switch data
