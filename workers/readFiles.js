var fs = require('fs');
var path = require("path");
var mockDir = path.join(__dirname, '..', 'mockData/out/');

var clearDatabase = function(Model) {
  Model.remove({}, function(err) {
    console.log('collection removed');
  });
};

var saveToDB = function(Model, json) {
  var model = new Model(JSON.parse(json));
  model.save(function (err, Model) {
    if (err) console.log(err);
    console.log('saved server to db');
  });
};

// Save all files in a directory to a database model
module.exports = function(Model, pathToDir) {
  // clear any collections data from the database
  clearDatabase(Model);
  // readfiles each file in the mockData/out dir and save them to the DB
  fs.readdir(pathToDir, function(err, files){
    if (err) throw err;
    files.forEach(function(file){
      fs.readFile(pathToDir + file, 'utf-8', function(err, json) {
        if (err) throw err;
        saveToDB(Model, json);
      });
    });
  });
};
