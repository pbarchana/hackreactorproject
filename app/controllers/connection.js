var mongoose = require('mongoose');
var Connection = mongoose.model('Connection');

module.exports.getAll = function(req, res) {
  Connection.find(function (err, connections) {
    if (err) console.log(err);// TODO handle err
    console.log('RETRIEVED:' + connections);
    res.set("Content-Type", "application/json");
    res.send(connections);
  });
};