_ = require('lodash');

module.exports.findCompatible = function (users) {
	if (users.length >= 2) {
		return users.slice(0, 2);
	} else {
		return false;
	}
};

module.exports.Game = function (players) {
	var n = 40;
	this.players = players;
	this.lastmove = [false];
	this.gameBoard = new Array(n);
	for (var i = 0; i < n; i++) {
		this.gameBoard[i] = new Array(n);
		for (var j = 0; j < n; j++) {
			for (var k = 0; k < 4; i++) {
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
			this.gameBoard[input.row][input.column] = input.playerID;
			this.logMove(input);
			this.toggleUser();
		}
	};

	this.logMove = function (input) {
		this.lastmove.push(_.pick(input, ['row', 'column', 'playerID']));
	};

	this.toggleUser = function () {
		if (this.players[0].ID == input.playerID) {
			this.expectedPlayer = this.players[1].ID;
		} else {
			this.expectedPlayer = this.players[0].ID;
		}
	};

	this.isMoveValid = function (input) {
		if (input.playerID == this.expectedPlayer && this.gameBoard[input.row][input.column] === false) {
			return true;
		} else {
			return false;
		}
	};

	this.sendBoard = function () {
		data = {
			'board': this.gameBoard,
			'expectedPlayer': this.expectedPlayer,
			'lastmove': this.lastmove[this.lastmove.length - 1]
		};
	};
};
