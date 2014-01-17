var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;
var serverSchema = new Schema ({
  date: Number,
  attributes: {},
  components: {}
});

// Servers model
module.exports = mongoose.model('Servers', serverSchema);
