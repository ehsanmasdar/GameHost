// Setup basic express server
var express = require('express');
var app = express();
var _ = require('lodash');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var room = require('./room.js');
var port = 3002;

// Routing
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/static", express.static(__dirname + '/static'));
app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', _.partial(room.onConnection, io));

http.listen(port, function () {
    console.log('Server listening at port %d', port);
});
