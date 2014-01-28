var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;
var connectionSchema = new Schema ({
  links: {
    source: String,
    target: String,
    sourceId: Schema.Types.ObjectId,
    targetId: Schema.Types.ObjectId
  }
});

mongoose.model('Connection', connectionSchema);