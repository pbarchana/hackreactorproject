var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.send('hello world');
});
console.log("Listening on http://localhost:8080");
app.listen(8080);
