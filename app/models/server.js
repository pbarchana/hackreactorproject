var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;
var serverSchema = new Schema ({
  type: String,
  date: Number,
  attributes: {},
  components: {}
}, {strict: false});

mongoose.model('Server', serverSchema);
