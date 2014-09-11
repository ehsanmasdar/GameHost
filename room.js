var fs = require('fs');
var _ = require('lodash');
var uuid = require('node-uuid');

// global data
var allUsers = [];
var searchingUsers = [];
var roomnames = fs.readFileSync('./static/roomnames.txt').toString().split("\n");

function initConnection(socket) {
    socket.id = uuid.v1();
    allUsers.push(socket);
    console.log("Curent AllUsers: " + allUsers.length);
    socket.emit('hello', { "id" : socket.id});
}

function onReply(socket, data){
    socket.emit('hello', _.extend(data, {'server': 'reply'}));
}

function onJoin(socket, data) {
    console.log( 'user ' + socket.id + '  requested join for ' + data);
    // start searching for other allUsers that match the game data
    socket.gameConstraints = data;
    searchingUsers.push(socket);

    _.forEach(searchingUsers, function (entry) {
	if (entry != socket && _.isEqual(socket.gameConstraints, entry.gameConstraints)) {
	    searchingUsers = _.without(searchingUsers, entry, socket);

	    // Tell clients what room they are connected to
	    // Room is a random name
	    var room = {'ID': uuid.v1(), 'name': _.sample(roomnames, 1)};
	    socket.room = room;
	    entry.room = room;

	    // Finally, give each player a turn order number (0 for first, 1 for second)
	    entry.player = 0;
	    socket.player = 1;

	    socket.join(room.ID);
	    entry.join(room.ID);

	    socket.emit('connection', {"id":socket.player, "room":room});
	    entry.emit('connection', {"id": entry.player, "room":room});

	    console.log("Player id " + socket.id + " successfully connected to player " + entry.id + " at room " + room.ID + " which is aliased to " + room.name);
	}
    });
}

function onGamesend(socket, data) {
    if (! (socket in searchingUsers)){
	console.log(data);
	data.playerID = 1;
	socket.broadcast.to(socket.room.ID).send(data);
	//io.to(socket.room.ID).emit('gamerecieve', data);
	//socket.broadcast.to(socket.room.ID).emit('gamerecieve', data);
	//io.sockets.in(socket.room.ID).emit('gamerecieve', data);
    } 
}

function onDisconnect(socket) {
    allUsers = _.without(allUsers, socket);
    console.log( 'user ' + socket.id + '  disconnected');
    console.log("Users: " + allUsers);
}

module.exports.onConnection = function (io, socket) {
    initConnection(socket);
    // Notice the naming convention
    socket.on('reply', _.partial(onReply, socket));
    socket.on('join', _.partial(onJoin, socket));
    socket.on('gamesend', _.partial(onGamesend, socket));
    socket.on('disconnect', _.partial(onDisconnect, socket));
};
