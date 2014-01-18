var mongoose = require('mongoose');
var Server = mongoose.model('Server');

module.exports.getAll = function(req, res) {
  Server.find().lean().exec(function (err, servers) {
    if (err) console.log(err);// TODO handle err
    console.log('RETRIEVED:' + servers);
    res.set("Content-Type", "application/json");
    res.send(servers);
  });
};

module.exports.getById = function(req, res) {
  // lean returns a plain javascript object with not mongoose stuff atached to it
  Server.findById(req.params.id, function(err, server) {
    res.set("Content-Type", "application/json");
    res.send(server);
  });
};