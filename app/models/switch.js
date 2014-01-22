var mongoose = require('mongoose');

// switch schema
var Schema = mongoose.Schema;
var switchSchema = new Schema ({
  type: String,
  cluster_id: {type: Schema.ObjectId, ref: 'Cluster'},
  attributes: {},
  components: {
    nics: []
  }
});

mongoose.model('Switch', switchSchema);
