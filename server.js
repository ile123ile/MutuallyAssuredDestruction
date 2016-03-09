var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var id = 0;

io.on('connection', function(socket){
	var pid = id++;
	console.log(pid+': a user connected');
	socket.on('disconnect', function(){
		console.log(pid+': a user disconnected');
	});
	socket.on('chat message', function(msg){
		console.log('message: '+msg);
		io.emit('chat message', pid+': '+msg);
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
