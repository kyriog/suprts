var AttackAction = 
{
	onAttackTile: function(x,y,clientId)
	{
		var xChunk = x - x%10;
		var yChunk = y - y%10;
			
		if(x < 0)
		{
			xChunk = ( Math.ceil(x / 10) * 10);
			if(x % 10 != 0)
			{
				xChunk = xChunk - 10;
			}
		}
			
		if(y < 0)
		{
			yChunk = ( Math.ceil(y / 10) * 10);
			if(y % 10 != 0)
			{
				yChunk = yChunk - 10;
			}
		}
			
			
		var xTitle = xChunk - x;
		var yTitle = yChunk - y;
			
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
		var Distance = Math.abs(xCharacter - x) + Math.abs(yCharacter - y);
		
		if( Distance <= 2 )
		{
			var chunk = ige.server.world.chunksCache[xChunk + ' ' + yChunk];
			var tile = chunk.getTitle(xTitle,yTitle);
			
			if(tile.owned == false)
			{
				AttackAction._AttackNeuterTile(xTitle,yTitle,tile,chunk,clientId);
			}
			else
			{
				AttackAction._AttackPlayerTile(xTitle,yTitle,tile,chunk,clientId);
			}
		}
	},
	
	_AttackNeuterTile: function(x,y,tile,chunk,clientId)
	{
		// Updating tile on server
		tile.owned = true;
		tile.owner = ige.server.clients[clientId];
		ige.server.world.UpdateChunk(chunk);
		
		// Sending update to clients
		var data = {
			xChunk: chunk.xChunk,
			yChunk: chunk.yChunk,
			xTile: x,
			yTile: y,
			owner: tile.owner,
		}
		ige.network.send('tileConquest', data);
		PlayerStats.addLevel(tile.owner);
	},
	
	_AttackPlayerTile: function(x,y,tile,chunk,clientId)
	{
		tile.attackedBy = ige.server.clients[clientId];
		tile.autocapture = true;
		var data = {
			xChunk: chunk.xChunk,
			yChunk: chunk.yChunk,
			xTile: x,
			yTile: y,
		}
		
		ige.network.send('tileBlinking', data, clientId);
		
		PlayerStats.getPlayer(tile.owner, function(player) {
			if(player.clientId)
			{
				ige.network.send('tileAttack', data, player.clientId);
			}
		});
		
		setTimeout(function() 
		{
			if(tile.autocapture)
			{
				PlayerStats.subLevel(tile.owner);
				PlayerStats.addLevel(tile.attackedBy);

				tile.owner = tile.attackedBy;
				tile.attackedBy = 0;
				tile.autocapture = false;

				data.owner = tile.owner;
				ige.network.send('tileConquest', data);
			}
		}, 20000);
	},
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = AttackAction; }
