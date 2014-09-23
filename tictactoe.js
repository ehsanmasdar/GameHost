_ = require('lodash');

module.exports.findCompatible = function (users) {
	// this is just place holder for now
	// for more complicated games, you could imagine logic that determines
	// whether or not two users can play together based on the game constraints
	// they asked for
	if (users.length >= 2) {
		return users.slice(0, 2);
	} else {
		return false;
	}
};

module.exports.Game = function (players) {
	this.players = players;
	this.gameBoard;
	// initialize game board with zeros
	 this.makeBoard = function(){
	 	console.log("asdfsdfsdfsdfasdfasdf")
    this.gameBoard = new Array(3);
    for (var i = this.gameBoard.length - 1; i >= 0; i--) {
      this.gameBoard[i] = new Array(3)
      for (var z = this.gameBoard[i].length - 1; z >= 0; z--) {
        this.gameBoard[i][z] = 0;

      };
  };
  }
  this.makeBoard();

	this.init = function () {
		i = _.random(0, 1);
		this.expectedPlayer = this.players[i].ID;
		return this.sendBoard();
	};

	this.inputMove = function (input) {
		if (this.isMoveValid(input)) {
			console.log('good move');
			this.gameBoard[input.row][input.column] = input.playerID;
			if (this.players[0].ID == input.playerID) {
				this.expectedPlayer = this.players[1].ID;
			} else {
				this.expectedPlayer = this.players[0].ID;
			}
		} else {
			console.log('bad move');
		}
		return this.sendBoard();
	};

	this.isMoveValid = function (input) {
		if (this.gameBoard[input.row][input.column] === false && 
			input.playerID == this.expectedPlayer &&
		   !this.hasWin()) {
			return true;
		} else { 
			return false;
		}
	};

	this.hasWin = function () {
		var g = this.gameBoard;
		var tie = true
		for (var i = 2; i >= 0; i--) {
			// check for a row
			if (g[i][0]==g[i][1] && g[i][1]==g[i][2] && g[i][0]) {
				console.log('row', i, g[i][0]);
				console.log(g);
				return g[i][0];
			}
		}
		for (var j = 2; j >= 0; j--) {
			// check for a column
			if (g[0][j]==g[1][j] && g[1][j]==g[2][j] && g[0][i]) {
				console.log('column', i, g[0][i]);
				console.log(g);
				return g[0][i];
			}
		}
		// check for diagonal
		if (g[0][0]==g[1][1] && g[1][1]==g[2][2] && g[2][2]) {
			return g[0][0];
		}
		// check for diagonal
		if (g[2][0]==g[1][1] && g[1][1]==g[0][2] && g[0][2]) {
			return g[2][0];
		}
		 for (var i = g.length - 1; i >= 0; i--) {
       for (var z = g[i].length - 1; z >= 0; z--) {
         if(g[i][z]==0){
          tie = false;
          console.log("ASDADF")
         }
       };
     };
     console.log(tie)
     if (tie) {
      //this.makeBoard();
     };

		return false;
	};

	this.sendBoard = function () {
		data = {
			'board': this.gameBoard,
			'expectedPlayer': this.expectedPlayer,
			'winner': this.hasWin()
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
