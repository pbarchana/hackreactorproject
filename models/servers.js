var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;
var serverSchema = new Schema ({
  // _serverId: new mongoose.Types.ObjectId,
  date: Number,
  attributes: {},
  components: {}
}, {strict: false});

// Servers model
module.exports = mongoose.model('Servers', serverSchema);
