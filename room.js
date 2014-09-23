var fs = require('fs');
var _ = require('lodash');
var uuid = require('node-uuid');
var engines = {};
engines.tictactoe = require('./tictactoe.js');
//engine.ENGINE_NAME = require('./ENGINE_SOURCE/);

// helper functions
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
	socket.ID = uuid.v1();
	allUsers.push(socket);
	console.log("Curent users: " + allUsers.length);
	socket.emit('hello', { "id" : socket.ID});
}

function onReply(socket, data){
	socket.emit('hello', _.extend(data, {'server': 'reply'}));
}

function onJoin(self, data) {
	e = data.engine; // specifies which game engine manages the game-specific logic
	self.name = data.name;
	self.engine = data.engine;
	self.constraints = data.constraints;
	var sameuser = false;
	_.forEach(searchingUsers[e], function (user) {
		if (user.ID == self.ID){
			sameuser = true;
		}
	});
	if(sameuser){console.log( self.ID + " is already searching");}
	else{
		console.log( 'user ' + self.ID + '  requested join for ' + data);
		searchingUsers[e].push(self);

		usersInGame = engines[e].findCompatible(searchingUsers[e]);
		if (usersInGame) {
			var room = {'ID': uuid.v1(), 'name': _.sample(roomnames, 1)[0]};
			_.removeElems(searchingUsers[e], usersInGame);
			// instantiate a new game engine for the users
			game = new engines[e].Game(usersInGame);
			_.forEach(usersInGame, function (user) {
				user.game = game;
				//user.room = room;
				//user.join(room.ID);
				console.log('sending connection to ' + user.name);
				user.emit('connection', {
					'room': room,
					'users': _.map(usersInGame, function (user) {
						return _.pick(user, 'name', 'ID');
					})
				});
			});

			msgs = game.init();
			_.forEach(msgs, function (msg) {
				msg.target.emit('gamerecieve', msg.data);
			});

		}
	}
}

function onGamesend(self, data) {
	if (self.game) { // if connected to a game
		data.playerID = self.ID; // investigate client side setting
		msgs = self.game.inputMove(data);
		console.log(data);

		_.forEach(msgs, function (msg) {
			console.log(msg.target.name);
			msg.target.emit('gamerecieve', msg.data);
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
	console.log( 'user ' + socket.ID + '  disconnected');
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
