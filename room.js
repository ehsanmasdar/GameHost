var fs = require('fs');
var _ = require('lodash');

// global data
var currentusers = 0;
var totalusers = 0;
var users = [];
var rooms = 0;
var roomnames = fs.readFileSync('./static/roomnames.txt').toString().split("\n");
var id;

function initConnection(socket) {
    id = totalusers;
    totalusers++;
    currentusers++;
    users[id] = socket;
    console.log("Curent Users: " + currentusers);
    socket.emit('hello', { "id" : id});
}

function onReply(socket, data){
    socket.emit('hello', _.extend(data, {'server': 'reply'}));
}

function onJoin(socket) {
    console.log( 'user ' + id + '  requested join');
    //Set socket sate to searching
    socket.searching = true;
    for (var i = 0; i < users.length; i++){
	entry = users[i];
	if (entry.searching === true && entry != socket){
	    //Match found, set searching to false and join to true
	    socket.searching = false;

	    entry.searching = false;
	    socket.isConnected = true;
	    entry.isConnected = true;
	    //Tell clients what room they are connected to
	    //Room is a random name
	    var room = roomnames[rooms];
	    rooms++;
	    socket.connectedToRoom = room;
	    entry.connectedToRoom = room;
	    //Finally, give each player a turn order number (0 for first, 1 for second)
	    entry.player = 0;
	    socket.player = 1;
	    socket.join(room);
	    entry.join(room);
	    socket.emit('connection', {"id":socket.player, "room":room});
	    entry.emit('connection', {"id": entry.player, "room":room});
	    console.log("Player id " + i + " successfully connected to player " + id + " at room " + room);
	}
    }
}

function onGamesend(socket, data) {
    if (socket.isConnected){
	console.log(data);
	data.playerID = 1;
	//To just other clients
	socket.to(socket.connectedToRoom).emit('gamerecieve', data);
	//To everyone
	//io.sockets.in(socket.connectedToRoom).emit('gamerecieve', data);
    } 
}

function onDisconnect(socket) {
    console.log( 'user ' + id + '  disconnected');
    currentusers--;
    console.log("Curent Users: " + currentusers);
    socket.isConnected = false;
}

module.exports.onConnection = function (socket) {
    initConnection(socket);
    socket.on('reply', _.partial(onReply, socket));
    socket.on('join', _.partial(onJoin, socket));
    socket.on('gamesend', _.partial(onGamesend, socket));
    socket.on('disconnect', _.partial(onDisconnect, socket));
};
