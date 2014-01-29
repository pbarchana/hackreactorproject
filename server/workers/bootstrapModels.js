// ================== Dependencies =======================
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');

// ================== Bootstrap Models =======================
var models_path = path.join(__dirname, '..', 'app/models');
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

// ================== Export Model References =======================
module.exports.Server = mongoose.model('Server');
module.exports.Switch = mongoose.model('Switch');
module.exports.Connection = mongoose.model('Connection');
module.exports.DataCenter = mongoose.model('DataCenter');
module.exports.DataCenterConnection = mongoose.model('DataCenterConnection');