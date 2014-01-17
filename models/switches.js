var mongoose = require('mongoose');

// switch schema
var Schema = mongoose.Schema;
var switchSchema = new Schema ({
  attributes: {},
  components: {
    nics: []
  }
});

// switch model
module.exports = mongoose.model('Switches', switchSchema);
