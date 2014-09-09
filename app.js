// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3001;


app.use("/styles", express.static(__dirname + '/styles'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/static", express.static(__dirname + '/static'));
// Routing
app.get('/', function(req, res){
  res.sendfile('index.html');
});

var currentusers = 0;
var totalusers = 0;
var users = [];
var rooms = 0;
//read in file names
var fs = require('fs');
var roomnames = fs.readFileSync('./static/roomnames.txt').toString().split("\n");
io.on('connection', function (socket) {
  var id = totalusers;
  totalusers++;
  currentusers++;
  users[id] = socket;
  console.log("Curent Users: " + currentusers);
  socket.emit('hello', { "id" : id});
  socket.on('reply', function(data){
        socket.emit('hello', merge_options(data,{"server": "reply"}));
    });

  socket.on('join', function () {
    console.log( 'user ' + id + '  requested join');
    //Set socket sate to searching
    socket.searching = true;
    for (var i = 0; i < users.length; i++){
      entry = users[i];
      if (entry.searching == true && entry != socket){
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
  });

  socket.on('gamesend', function (data) {
    if (socket.isConnected){
      console.log(data);
      data.player = 1;
      //To just other clients
      socket.to(socket.connectedToRoom).emit('gamerecieve', data)
      //To everyone
      //io.sockets.in(socket.connectedToRoom).emit('gamerecieve', data);
    } 
  });

  socket.on('disconnect', function () {
    console.log( 'user ' + id + '  disconnected');
    currentusers--;
    console.log("Curent Users: " + currentusers);
    socket.isConnected = false;
  });

});


http.listen(port, function () {
  console.log('Server listening at port %d', port);
});


function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}