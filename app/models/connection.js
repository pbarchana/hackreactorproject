var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;
var connectionSchema = new Schema ({
  interfaces: {}
});

mongoose.model('Connection', connectionSchema);