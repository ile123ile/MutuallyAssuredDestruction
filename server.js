var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var id = 0;
var playerWait;
var games = [];

io.on('connection', function(socket){
	var pid = id++;
	var player = {socket: socket, pid: pid};
	if(playerWait == null)
	{
		playerWait = player;
	}
	else
	{
		socket.emit('chat message', 'You connected with ' + playerWait.pid);
		playerWait.socket.emit('chat message', 'You connected with ' + pid);
		player.partner = playerWait;
		playerWait.partner = player;

		playerWait = null;
	}
	console.log(pid+': a user connected');
	socket.on('disconnect', function(){
		console.log(pid+': a user disconnected');
	});
	socket.on('chat message', function(msg){
		console.log('message: '+msg);
		if(player.partner != null){
			player.partner.socket.emit('chat message', pid+': '+msg);
		}
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});