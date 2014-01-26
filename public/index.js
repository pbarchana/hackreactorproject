// angular setup
require('angular');
require('angular-route/angular-route');
require('angular-animate/angular-animate');
require('angular-bootstrap/ui-bootstrap-tpls');

require("./client/app.js");

require("./client/services/networkDataService.js");

require("./client/controllers/d3Controller.js");
require("./client/controllers/accordionController.js");
require("./client/controllers/mainController.js");
require("./client/controllers/zoomInController.js");
require("./client/controllers/dataCenterController.js");

require("./client/directives/map.js");
require("./client/directives/networkGraph.js");

require("./client/config/routes.js");

require("./stylesheets/style.css");