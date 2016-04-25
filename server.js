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

function randomRange(min, max)
{
	return Math.floor(Math.random()*(max-min+1)+min);
}

function makeEnemies(game, numEnemies, min, max)
{
	game.enemyArray = [];
	for (var i = 0; i < numEnemies; i++) {
    	//generate random coordinates
        a = randomRange(min, max);
        b = randomRange(min, max);
        for (var count = 0; count < game.enemyArray.length; count++) {
            while ((game.enemyArray[count].x == a && game.enemyArray[count].y == b)) {
                a = randomRange(min, max);
                b = randomRange(min, max);
            }
        }
        var enemy = {x: a, y: b, name: 'redEnemy'};
        game.enemyArray.push(enemy);
    }
}

function createGame(headPid, bodyPid, level)
{
	game = {head: headPid, body: bodyPid, level: level, hasBegun: false};
	game.player = {x: 0, y: 0};
	makeEnemies(game, 8, 5, 14);
	return game;
}

function movePlayer(game)
{
	if(game.moves.body == 'left')
	{
		game.player.x--;
	}
	else if(game.moves.body == 'right')
	{
		game.player.x++;
	}
	else if(game.moves.body == 'down')
	{
		game.player.y--;
	}
	else if(game.moves.body == 'up')
	{
		game.player.y++;
	}
}

function moveEnemies(game)
{
	var player = game.player;
	for(var i = 0; i < game.enemyArray.length; i++)
	{
		var newPos = {x: game.enemyArray[i].x, y: game.enemyArray[i].y};
		if(player.x > newPos.x)
		{
			newPos.x++;
		}
		else if(player.x < newPos.x)
		{
			newPos.x--;
		}
		else if(player.y > newPos.y)
		{
			newPos.y++;
		}
		else
		{
			newPos.y--;
		}
		var isGood = true;
		for(var j = 0; j < i; j++)
		{
			if(game.enemyArray[j].x == newPos.x && game.enemyArray[j].y == newPos.y)
			{
				isGood = false;
			}
		}
		if(isGood)
		{
			game.enemyArray[i].x = newPos.x;
			game.enemyArray[i].y = newPos.y;
		}
	}
}

function updateGame(game)
{
	movePlayer(game);
	moveEnemies(game);

}

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
		var game = createGame(player.pid, playerWait.pid, 1);
		player.game = game;
		playerWait.game = game;
		player.isHead = true;
		playerWait.isBody = true;
		console.log(player.pid+' connected with '+playerWait.pid);
		console.log(game);

		playerWait = null;
		moveInterval = setInterval(function(){
			if(!game.hasBegun)
			{
				game.hasBegun = true;
				player.socket.emit('begin', game);
				player.partner.socket.emit('begin', game);
			}
			moves = {'head':player.move, 'body':player.partner.move};
			game.moves = moves;
			updateGame(game);
			player.socket.emit('move', game);
			player.partner.socket.emit('move', game);
			player.move = '';
			player.partner.move = '';
		}, 3*1000);
	}
	console.log(pid+': a user connected');
	socket.on('disconnect', function(){
		console.log(pid+': a user disconnected');
		if(player.partner != null)
		{
			player.partner.socket.emit('message', 'Warning: haha you fucker ducker');
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
