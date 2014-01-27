var mongoose = require('mongoose');
var Switch = mongoose.model('Switch');

module.exports.getById = function(req, res) {
  Switch.findById(req.params.id, function(err, mySwitch) {
    res.set("Content-Type", "application/json");
    res.send(mySwitch);
  });
};

module.exports.getAll = function(req, res) {
  Switch.find(function (err, switches) {
    if (err) console.log(err);// TODO handle err
    console.log('RETRIEVED:' + switches);
    res.set("Content-Type", "application/json");
    res.send(switches);
  });
};