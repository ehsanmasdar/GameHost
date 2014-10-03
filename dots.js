_ = require('lodash');

module.exports.findCompatible = function (users) {
	if (users.length >= 2) {
		return users.slice(0, 2);
	} else {
		return false;
	}
};

module.exports.Game = function (players) {
	var n = 5;
	this.players = players;
	this.lastmove = [false];
	this.gameBoard = new Array(n);
	for (var i = 0; i < n; i++) {
		this.gameBoard[i] = new Array(n);
		for (var j = 0; j < n; j++) {
			this.gameBoard[i][j] = new Array(4);
			for (var k = 0; k < 4; k++) {
				this.gameBoard[i][j][k] = false;
			}
		}
	}

	this.init = function () {
		i = _.random(0, 1);
		this.expectedPlayer = this.players[i].ID;
		return this.sendBoard();
	};

	this.inputMove = function (input) {
		if (this.isMoveValid(input)) {
			this.updateBoard(input);
			this.logMove(input);
			this.toggleUser();
		}
	};

	this.isMoveValid = function (input) {
		return this.players[0].ID === input.playerID &&
		       this.gameBoard[input.x][input.y][input.z] === false;
	};

	this.updateBoard = function (input) {
		this.gameBoard[input.x][input.y][input.z] = input.playerID;
		if (input.z === 0) {
			this.gameBoard[input.x][input.y - 1][2] = input.playerID;
		}
		if (input.z === 1) {
			this.gameBoard[input.x - 1][input.y][3] = input.playerID;
		}
		if (input.z == 2) {
			this.gameBoard[input.x][input.y + 1][0] = input.playerID;
		}
		if (input.z == 3) {
			this.gameBoard[input.x + 1][input.y][1] = input.playerID;
		}
	};

	this.logMove = function (input) {

	};

	this.toggleUser = function () {
		if (this.players[0].ID === input.playerID) {
			this.expectedPlayer = this.players[1].ID;
		} else {
			this.expectedPlayer = this.players[0].ID;
		}
	};

	this.sendBoard = function () {
		data = {
			'board': this.gameBoard,
			'expectedPlayer': this.expectedPlayer,
			'lastmove': this.lastmove[this.lastmove.length - 1]
		};
		msgs = _.map(this.players, function (user) {
			shallow = {};
			shallow.data = data;
			shallow.target = user;
			return shallow;
		});
		return msgs;
	};
};
