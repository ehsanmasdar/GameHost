// Setup basic express server
var express = require('express');
var app = express();
var _ = require('lodash');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var room = require('./room.js');
var path = require('path');
var routes = require('./routes/index');
var port = 3002;
// Routing
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/static", express.static(__dirname + '/static'));
app.use('/', routes);
io.on('connection', _.partial(room.onConnection, io));

http.listen(port, function () {
    console.log('Server listening at port %d', port);
});
