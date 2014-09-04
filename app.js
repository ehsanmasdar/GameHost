// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3001;
app.use("/styles", express.static(__dirname + '/styles'));
// Routing
app.get('/', function(req, res){
  res.sendfile('index.html');
});

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  socket.emit('hello', { hello: "test"});
});
http.listen(port, function () {
  console.log('Server listening at port %d', port);
});