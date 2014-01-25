var mongoose = require('mongoose');
var DataCenterConnection = mongoose.model('DataCenterConnection');

module.exports.getAll = function(req, res) {
  DataCenterConnection.find(function (err, dataCenterConnections) {
    if (err) console.log(err);// TODO handle err
    console.log('RETRIEVED:' + dataCenterConnections);
    res.set("Content-Type", "application/json");
    res.send(dataCenterConnections);
  });
};