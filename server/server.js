// Dependencies
var express   = require('express'),
    mongoose  = require('mongoose'),
    config    = require('./config/config'),
    path      = require('path'),
    nib       = require('nib'),
    fs        = require('fs');

var app = express();

var dest = 'dist';

// set up environments
app.use(express.logger('dev'));
app.use(express.json()); // parses json
app.use(express.compress()); // gzips data if user agent supports it
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, '..', dest)));

// Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js$|coffee$)/.test(file)) {
        require(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};
walk(models_path);

// Bootstrap routes
require('./config/routes')(app);

// Bootstrap db connection
mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // Open the connection
  app.listen(8080);
  console.log("Listening on http://localhost:8080");
});
