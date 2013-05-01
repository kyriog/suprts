var ServerNetworkEvents = {
	_onPlayerRegister: function(data, clientId) {
		if(!ige.server.users[data.email]) {
			ige.server.users[data.email] = {'password': data.password};
			ige.server.clients[clientId] = data.email;
			ige.network.send('playerLogin');
		} else
			ige.network.send('playerRegisterError');
	},
	
	_onPlayerLogin: function(data, clientId) {
		if(ige.server.users[data.email] && ige.server.users[data.email]['password'] == data.password)
			ige.network.send('playerLogin');
		else
			ige.network.send('playerLoginError');
	},
	
	_onPlayerDisconnect: function(clientId) {
		delete(ige.server.clients[clientId]);
		if (ige.server.characters[clientId]) 
		{
			ige.server.characters[clientId].destroy();
			delete ige.server.characters[clientId];
		}
	},
	
	_onPlayerEntity: function (data, clientId) 
	{
		if (!ige.server.characters[clientId]) 
		{
			ige.server.characters[clientId] = new CharacterContainer().id(clientId).streamMode(1).mount(ige.server.TitleMap);
			ige.server.characters[clientId].translateTo(0,0,0);
			ige.network.send('playerEntity', ige.server.characters[clientId].id(), clientId);
			
			var chunks = ige.server.world.getChunks(0,0,2);
			console.log('chunks.length: ' + chunks.length);
			for(var i = 0; i < chunks.length; i++)
			{
				ige.network.send('mapSection', chunks[i]);
			}
		}
	},
	
	
	_onPlayerMove: function (data, clientId) 
	{
		if(ige.server.characters[clientId]) 
		{		
			console.log('Walking ' + clientId + ' to (' + data.x + ',' + data.y + ')');
			ige.network.send('characterMove', { id : ige.server.characters[clientId].id() ,x : data.x ,y : data.y });
			ige.server.characters[clientId].walkTo(data.x, data.y);
			
		}
	},
	
	_onPlayerNeuterConquest: function(data, clientId)
	{
		if(ige.server.characters[clientId]) 
		{
			var xChunk = data.x - data.x%10;
			var yChunk = data.y - data.y%10;
			
			if(data.x < 0)
			{
				xChunk = ( Math.ceil(data.x / 10) * 10);
				if(data.x % 10 != 0)
				{
					xChunk = xChunk - 10;
				}
			}
			
			if(data.y < 0)
			{
				yChunk = ( Math.ceil(data.y / 10) * 10);
				if(data.y % 10 != 0)
				{
					yChunk = yChunk - 10;
				}
			}
			
			
			var xTitle = xChunk - data.x;
			var yTitle = yChunk - data.y;
			
			if(xTitle < 0)
			{
				xTitle = xTitle * -1;
			}
			
			if(yTitle < 0)
			{
				yTitle = yTitle * -1;
			}

			var characterCoordinate = ige.server.characters[clientId].worldPosition().thisTo2d();
			var xCharacter = Math.round( characterCoordinate.x/40 );
			var yCharacter = Math.round( characterCoordinate.y/40 );
			var Distance = Math.abs(xCharacter - data.x) + Math.abs(yCharacter - data.y);

			/*
				console.log('data.x: ' + data.x + ' data.y: ' + data.y);
				console.log('xChunk: ' + xChunk + ' yChunk: ' + yChunk);
				console.log('xTitle: ' + xTitle + ' yTitle: ' + yTitle);
				console.log('xCharacter: ' + xCharacter + ' yCharacter: ' + yCharacter);
				console.log('Distance: ' + Distance);
			*/
			
			if( Distance <= 2 )
			{
				var chunk = ige.server.world.chunksCache[xChunk + ' ' + yChunk];
				chunk.getTitle(xTitle,yTitle).owned = true;
				chunk.getTitle(xTitle,yTitle).owner = clientId;
				ige.server.world.SaveChunk(chunk);
				ige.network.send('mapSection', chunk);
			}
			else
			{
				console.log('Too far for conquest title');		
			}
			
		}
		
	},
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
