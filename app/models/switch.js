var mongoose = require('mongoose');

// switch schema
var Schema = mongoose.Schema;
var switchSchema = new Schema ({
  // _switchId: new mongoose.Types.ObjectId,
  attributes: {},
  components: {
    nics: []
  }
});

mongoose.model('Switch', switchSchema);
