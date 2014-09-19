// Setup basic express server
var express = require('express');
var app = express();
var _ = require('lodash');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var room = require('./room.js');
var uuid = require('node-uuid');
var port = 3002;
// Routing
app.engine('html', require('ejs').renderFile);
app.use("/styles", express.static(__dirname + '/styles'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/static", express.static(__dirname + '/static'));
app.get('/', function(req, res){
    res.render('index.html');
});
app.get('/register', function(req, res){
	var newid = uuid.v1();
	console.log(newid);
    res.render('register.html', {id:newid});
});

io.on('connection', _.partial(room.onConnection, io));

http.listen(port, function () {
    console.log('Server listening at port %d', port);
});
