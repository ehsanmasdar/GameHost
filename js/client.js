var socket = io();
var id;
var other;

socket.on('hello', function (data) {
	console.log('hello:', data);
	$('#id').text(function(i, oldText) {
		id = data.id;
		return data.id;
	});
});

socket.on('gamerecieve', function (data) {
	$('#player').html(function (i, oldtext) {
		return 'It is ' + (data.expectedPlayer == id ? 'your' : (other.name + "'s")) + ' turn';
	});
	console.log('gamerecieve:', data);
	if (data.winner) {
		$('#player').html(function (i, oldtext) {
			return data.winner == id ? 'you win' : (other.name + ' wins!');
		});
	}
	GAME.tic.update(data.board);

});

socket.on('message', function (data) {
	console.log(data);
});

socket.on('connection', function (data) {
	other = data.users[0].ID == id ? data.users[1] : data.users[0];
	console.log('connection:', data);
	$('#connection').html(function(i, oldText) {
		return "Connected to room "  + data.room.name + " (" + data.room.ID + ")<br>Playing user " + other.name + " (" + other.ID + ")";
	});
	GAME.tic = new tictactoe([id, other.id]);
	document.getElementById("canvas").style.visibility="visible"; 
});

$("#join").submit(function(event) {
	event.preventDefault(); // disable normal form submit behavior
	name = $('#name').val();
	socket.emit('join', {
		'engine': 'tictactoe',
		'name': name,
		'constraints': {
			'players': 2
		}
	});
	return false; // prevent further bubbling of event
});
