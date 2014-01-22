var mongoose = require('mongoose');
var DataCenter = mongoose.model('DataCenter');

module.exports.getAll = function(req, res) {
  DataCenter.find(function (err, dataCenters) {
    if (err) console.log(err);// TODO handle err
    console.log('RETRIEVED:' + dataCenters);
    res.set("Content-Type", "application/json");
    res.send(dataCenters);
  });
};

module.exports.getById = function(req, res) {
  // lean returns a plain javascript object with not mongoose stuff atached to it
  DataCenter.findById(req.params.id, function(err, dataCenter) {
    res.set("Content-Type", "application/json");
    res.send(dataCenter);
  });
};