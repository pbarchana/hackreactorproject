var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;
var clusterSchema = new Schema ({
  type: String,
  name: String,
  dataCenter_id: {type: Schema.ObjectId, ref: 'DataCenter'},
  longitude: Number,
  latitude: Number
});

mongoose.model('Cluster', clusterSchema);