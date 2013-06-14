var FertilizeAction = 
{
	onFertilizeTitle: function(x,y,clientID)
	{
		console.log('onFertilizeTitle: function('+x+','+y+','+clientID+')');
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
		
		var chunk = ige.server.world.chunksCache[xChunk + ' ' + yChunk];
		var tile = chunk.getTitle(xTitle,yTitle);
		
		var characterCoordinate = ige.server.characters[clientID].worldPosition().thisTo2d();
		var xCharacter = Math.round( characterCoordinate.x/40 );
		var yCharacter = Math.round( characterCoordinate.y/40 );
		var Distance = Math.abs(xCharacter - x) + Math.abs(yCharacter - y);
		
		if( Distance <= 2 )
		{	
			if(ige.server.clients[clientID] == tile.owner) // On verifie qu'on est bien sur une de nos tiles;
			{
				PlayerStats.getPlayer(ige.server.clients[clientID], function(player)
				{
					var dbconfig = ige.server.dbconfig;
					
					console.log('PlayerStats.getPlayer('+ige.server.clients[clientID]+', function(player)');
					
					if(player.gold >= dbconfig.fertilizerCost)
					{
						tile.Fertility += dbconfig.fertilizerAddFertility;
						if(tile.Fertility > 100)
						{
							tile.Fertility = 100;
						}
						
						tile.MaxFertility += dbconfig.fertilizerAddFertility;
						if(tile.MaxFertility > 100)
						{
							tile.MaxFertility = 100;
						}
						
						console.log(tile);
						chunk.setTitle(x,y,tile);
						ige.server.world.UpdateChunk(chunk);
						ige.network.send('mapSection', chunk);
						PlayerStats.subGold(player.id, dbconfig.fertilizerCost);
						
					}
				});
			}
		}
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FertilizeAction; }
