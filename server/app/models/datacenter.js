var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;
var dataCenterSchema = new Schema ({
  type: String,
  name: String,
  location: String,
  longitude: Number,
  latitude: Number
  // _connectionIds: [{type: Schema.Types.ObjectId, ref: 'DataCenter'}]
});

mongoose.model('DataCenter', dataCenterSchema);