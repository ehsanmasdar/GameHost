// Setup basic express server
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3001;
app.use("/styles", express.static(__dirname + '/styles'));
// Routing
app.get('/', function(req, res){
  res.sendfile('index.html');
});
var currentusers = 0;
var totalusers = 0;
var users = [];
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
    socket.searching = true;
    for (var i = 0; i < users.length; i++){
      entry = users[i];
      if (entry.searching == true && entry != socket){
        socket.searching = false;
        entry.searching = false;
        socket.connectedTo = i;
        entry.connectedTo = id;
        entry.player = 0;
        socket.player = 1;
        socket.join = true;
        entry.join = true;
        socket.emit("connection", {"id":i});
        entry.emit("connection", {"id":id});
        console.log("Player id " + i + " successfully connected to player " + id);
      }
    }
  });
  socket.on('disconnect', function () {
    console.log( 'user ' + id + '  disconnected');
    currentusers--;
    console.log("Curent Users: " + currentusers);
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