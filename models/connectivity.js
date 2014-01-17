var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;
var connectivitySchema = new Schema ({
  interfaces: {}
});

// Servers model
module.exports = mongoose.model('Connectivity', connectivitySchema);