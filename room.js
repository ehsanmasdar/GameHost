var fs = require('fs');
var _ = require('lodash');
var uuid = require('node-uuid');
var engines = {};
engines.tictactoe = require('./tictactoe.js');
//engine.ENGINE_NAME = require('./ENGINE_SOURCE/);

// helper function
_.removeElems = function (array, elems) {
    _.forEach(elems, function (elem) {
	i = array.indexOf(elem);
	if (i > -1) {
	    array.splice(i, 1);
	}
    });
    return array;
};

// global data
var roomnames = fs.readFileSync('./static/roomnames.txt').toString().split("\n");
var allUsers = [];
var searchingUsers = {};

// populate searchingUsers with an empty array for each engine
for (var engine in engines) {
    searchingUsers[engine] = [];
}


function initConnection(socket) {
    socket.id = uuid.v1();
    allUsers.push(socket);
    console.log("Curent users: " + allUsers.length);
    socket.emit('hello', { "id" : socket.id});
}

function onReply(socket, data){
    socket.emit('hello', _.extend(data, {'server': 'reply'}));
}

// join with wildcards
function onJoin(self, data) {
    console.log( 'user ' + self.id + '  requested join for ' + data);
    e = data.engine; // specifies which game engine manages the game-specific logic
    self.engine = data.engine;
    self.constraints = data.constraints;

    searchingUsers[e].push(self);

    usersInGame = engines[e].findCompatible(searchingUsers[e]);
    if (usersInGame) {
	var room = {'ID': uuid.v1(), 'name': _.sample(roomnames, 1)[0]};
	_.removeElems(searchingUsers[e], usersInGame);
	_.forEach(usersInGame, function (user) {
	    // Tell clients what room they are connected to
	    // Room is a random name
	    user.room = room;
	    user.otherPlayers = usersInGame;
	    user.join(room.ID);
	    user.emit('connection', {'room': room});
	});
    }
}

function onGamesend(self, data) {
    if (self.otherPlayers) { // if connected to a game
	console.log(data);
	data.playerID = 1;
	_.forEach(_.without(self.otherPlayers, self), function (other) {
	    other.emit('gamerecieve', data);
	});
	// it would be cooler if I could send to a room, rather than to every player
	//socket.broadcast.to(socket.room.ID).send(data);
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
