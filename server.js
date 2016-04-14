var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/test', function(req, res){
  res.sendFile(__dirname + '/test.html');
});
/*function routeGameFile(URI, fileName) {
	app.get(URI, function(req, res){
		res.sendFile(__dirname + '/PhaserProject/PhaserProject/' + fileName);
	});
}
routeGameFile('/game.html', 'index.html');
routeGameFile('/game.js', 'game.js');
routeGameFile('/phaser.js', 'phaser.js');
routeGameFile('/TitleScreenState.js', 'TitleScreenState.js');
routeGameFile('/GameObjects/Player.js', '/GameObjects/Player.js');*/
app.use(express.static(__dirname + '/PhaserProject/PhaserProject/Public'));
var id = 0;
var playerWait;

io.on('connection', function(socket){
	var pid = id++;
	var player = {socket: socket, pid: pid, move: ''};
	var moveInterval;
	if(playerWait == null)
	{
		playerWait = player;
	}
	else
	{
		socket.emit('message', 'You are head. You connected with body ' + playerWait.pid);
		playerWait.socket.emit('message', 'You are body. You connected with head ' + pid);
		player.partner = playerWait;
		playerWait.partner = player;
		var game = {
			head: player.pid, 
			body: playerWait.pid,
			level: 1 
		};
		player.isHead = true;
		playerWait.isBody = true;
		console.log(player.pid+' connected with '+playerWait.pid);


		playerWait = null;
		moveInterval = setInterval(function(){
			moves = {'head':player.move, 'body':player.partner.move};
			player.socket.emit('move', moves);
			player.partner.socket.emit('move', moves);
			player.move = '';
			player.partner.move = '';
		}, 3*1000);
	}
	console.log(pid+': a user connected');
	socket.on('disconnect', function(){
		console.log(pid+': a user disconnected');
		if(player.partner != null)
		{
			player.partner.socket.emit('message', 'Warning: haha you fucker');
		}
		if(playerWait != null && playerWait.pid === player.pid)
		{
			playerWait = null;
		}
		if(player.isHead === true)
		{
			clearInterval(moveInterval);
		}
	});
	/*socket.on('move', function(msg, fn){
		console.log('message: '+msg);
		player.move = msg;
		if(player.partner != null){
			if(player.partner.move != null){
				player.socket.emit('move', player.partner.move);
				player.partner.socket.emit('move', player.move);
				console.log('you both moved you fux');
				player.partner.move = null;
				player.move = null;
			}
			else{
				player.partner.socket.emit('message', 'Your partner has moved');
				fn('received');
			}
		}
	});*/
	socket.on('move', function(msg){
		player.move = msg;
	});
});



http.listen((process.env.PORT || 3000), function(){
  console.log('listening on *: '+ (process.env.PORT || 3000));
});
