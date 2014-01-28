// App
require("./client/app.js");

// Dynamically generated templates (needs to come before everything else)
require("./client/templates.js");

// Services
require("./client/services/networkDataService.js");

// Controllers
require("./client/controllers/accordionController.js");
require("./client/controllers/mainController.js");
require("./client/controllers/zoomInController.js");
require("./client/controllers/dataCenterController.js");

// Directives
require("./client/directives/map.js");
require("./client/directives/networkGraph.js");
require("./client/directives/zoomIn.js");

// Routes
require("./client/config/routes.js");

