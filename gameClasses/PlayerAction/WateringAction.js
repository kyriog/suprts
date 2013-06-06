var WateringAction = 
{
	onWateringTile: function(x,y,clientId)
	{
		console.log('onWateringTile: function('+x+','+y+','+clientId+')');
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
				
			if(ige.server.clients[clientId] == tile.owner) // On verifie qu'on est bien sur une de nos tiles;
			{
			
				
				if(tile.Humidity < 91)
				{
					tile.Humidity = tile.Humidity + 10;
				}
				else
				{
					tile.Humidity = 100;
				}
				
				chunk.setTitle(x,y,tile);
				ige.server.world.UpdateChunk(chunk);
				ige.network.send('mapSection', chunk);
			}
		}
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = WateringAction; }
