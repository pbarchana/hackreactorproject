var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;
var clusterSchema = new Schema ({
  type: String,
  name: String,
  dataCenter_id: {type: Schema.ObjectId, ref: 'DataCenter'},
});

mongoose.model('Cluster', clusterSchema);