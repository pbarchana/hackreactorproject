// =============== Load Controllers =================

var appCtrl = require('../app/controllers/app.js');
var serverCtrl = require('../app/controllers/server.js');
var switchCtrl = require('../app/controllers/switch.js');
var connectionCtrl = require('../app/controllers/connection.js');
var datacenterCtrl = require('../app/controllers/datacenter.js');
var dataCenterConnectionCtrl = require('../app/controllers/dataCenterConnection.js');

// =================== Routes ======================

module.exports = function(app) {
  // get all data
  app.get('/all-zoomed', appCtrl.getAllZoomed);

  // get datacenter data
  app.get('/data-center', datacenterCtrl.getAll);
  app.get('/data-center/:id', datacenterCtrl.getById);
  app.get('/data-center-connection', dataCenterConnectionCtrl.getAll);
  
  // get server data
  app.get('/server', serverCtrl.getAll);
  app.get('/server/:id', serverCtrl.getById);

  // get switch data
  app.get('/switch', switchCtrl.getAll);
  app.get('/switch/:id', switchCtrl.getById);
  app.get('/switchConn/:id', switchCtrl.getByIdWithConnections);

  // get switch data
  app.get('/connection', connectionCtrl.getAll);
};