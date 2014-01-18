# hackreactorproject

## Setup
* make sure [mongoDB](http://www.mongodb.org/) is installed and running on default port by running
* Run `npm install` and `bower install` to get dependencies. 
* Run `mongod` to start the DB
* Run `node server` to start the server.
* Run `grunt generate` to generate mock data

## Making requests to the server
* GET /nodes to get D3 formatted data (nodes and links arrays)
* GET /all to get all data
* GET /server to get server data
* GET /server/:id to get server data
* GET /switch to get all switch data
* GET /switch/:id to get all switch data
* GET /connection to get all connection data
