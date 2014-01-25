var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;

// connect by data center IDs
var connectionSchema = new Schema ({
  origin: Schema.Types.ObjectId,
  connection: Schema.Types.ObjectId
});

mongoose.model('DataCenterConnection', connectionSchema);