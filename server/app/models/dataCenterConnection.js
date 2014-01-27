var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;

// connect by data center IDs
// var connectionSchema = new Schema ({
//   origin: Schema.Types.ObjectId,
//   connection: Schema.Types.ObjectId
// });

var connectionSchema = new Schema ({
  origin: {type: Schema.ObjectId, ref: 'DataCenter'},
  connection: {type: Schema.ObjectId, ref: 'DataCenter'}
});

mongoose.model('DataCenterConnection', connectionSchema);