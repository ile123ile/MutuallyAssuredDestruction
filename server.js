var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var id = 0;
var playerWait;

io.on('connection', function(socket){
	var pid = id++;
	var player = {socket: socket, pid: pid};
	if(playerWait == null)
	{
		playerWait = player;
	}
	else
	{
		socket.emit('move', 'You connected with ' + playerWait.pid);
		playerWait.socket.emit('move', 'You connected with ' + pid);
		player.partner = playerWait;
		playerWait.partner = player;
		var game = {
			head: player.pid, 
			body: playerWait.pid,
			level: 1 
		};
		console.log(player.pid+' connected with '+playerWait.pid);


		playerWait = null;
	}
	console.log(pid+': a user connected');
	socket.on('disconnect', function(){
		console.log(pid+': a user disconnected');
		if(player.partner != null)
		{
			player.partner.socket.emit('message', 'haha you fucker your partner left');
		}
		if(playerWait.pid === player.pid)
		{
			playerWait = null;
		}
	});
	socket.on('move', function(msg){
		console.log('message: '+msg);
		player.move = msg;
		if(player.partner != null){
			if(player.partner.move != null){
				player.socket.emit('move', player.partner.move);
				player.partner.socket.emit('move', player.move);
				player.partner.move = null;
				player.move = null;
			}
		}
	});
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});