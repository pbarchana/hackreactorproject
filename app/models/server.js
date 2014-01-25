var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;
var serverSchema = new Schema ({
  type: String,
  date: Number,
  cluster_id: {type: Schema.ObjectId, ref: 'Cluster'},
  attributes: {},
  components: {}
}, {strict: false});

mongoose.model('Server', serverSchema);
