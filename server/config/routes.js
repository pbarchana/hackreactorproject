// Load controllers
var appCtrl = require('../app/controllers/app.js');
var serverCtrl = require('../app/controllers/server.js');
var switchCtrl = require('../app/controllers/switch.js');
var connectionCtrl = require('../app/controllers/connection.js');
var datacenterCtrl = require('../app/controllers/datacenter.js');
var dataCenterConnectionCtrl = require('../app/controllers/dataCenterConnection.js');

// Routes
module.exports = function(app) {
  // get all data
  // app.get('/all', appCtrl.getAll);
  app.get('/all-zoomed', appCtrl.getAllZoomed);
  // app.get('/all-minimized', appCtrl.getAllMinimized);
  // get D3 data
  // app.get('/d3data', appCtrl.getD3Data);

  // get datacenter data
  app.get('/datacenter', datacenterCtrl.getAll);
  app.get('/datacenter/:id', datacenterCtrl.getById);
  app.get('/dataCenterConnection', dataCenterConnectionCtrl.getAll);
  
  // get server data
  app.get('/server', serverCtrl.getAll);
  app.get('/server/:id', serverCtrl.getById);

  // get switch data
  app.get('/switch', switchCtrl.getAll);
  app.get('/switch/:id', switchCtrl.getById);

  // get switch data
  app.get('/connection', connectionCtrl.getAll);
};