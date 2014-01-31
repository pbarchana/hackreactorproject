var mongoose = require('mongoose');

// server schema
var Schema = mongoose.Schema;

// connect by data center IDs
// var connectionSchema = new Schema ({
//   origin: Schema.Types.ObjectId,
//   connection: Schema.Types.ObjectId
// });

var connectionSchema = new Schema ({
  sourceId: {type: Schema.ObjectId, ref: 'DataCenter'},
  targetId: {type: Schema.ObjectId, ref: 'DataCenter'}
});

mongoose.model('DataCenterConnection', connectionSchema);