var mongoose = require('mongoose');

// switch schema
var Schema = mongoose.Schema;
var switchSchema = new Schema ({
  type: String,
  attributes: {},
  components: {
    nics: []
  }
});

mongoose.model('Switch', switchSchema);
