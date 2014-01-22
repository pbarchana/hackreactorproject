var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;
var dataCenterSchema = new Schema ({
  type: String,
  name: String,
  longitude: Number,
  latitude: Number
});

mongoose.model('DataCenter', dataCenterSchema);