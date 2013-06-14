var HarvestAction = 
{
	onHarvestTile: function(x,y,choice,clientID)
	{
		console.log('onHarvestTile: function('+x+','+y+','+choice+','+clientID+')');
		
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
				if(choice == 'sell')
				{
					this.onHarvestAndSell(x,y,clientID);
				}
				else if ( choice == 'store')
				{
					this.onHarvestAndStore(x,y,clientID);
				}
			}
		}
	},
	
	onHarvestAndSell: function(x,y,clientID)
	{
		var plant = ige.$('Plant_'+x+'_'+y);
		
		if(plant)
		{
			var dbconfig = ige.server.dbconfig;
			
			if(plant.percentRate > 80)
			{
				PlayerStats.getPlayer(ige.server.clients[clientID], function(player)
				{
					PlayerStats.addGold(player.id, dbconfig.plantCorrectSell);
				});
			}
			else if(plant.percentRate == 100)
			{
				PlayerStats.getPlayer(ige.server.clients[clientID], function(player)
				{
					PlayerStats.addGold(player.id, dbconfig.plantBestSell);
				});
			}
			
			var query = 'DELETE FROM plants WHERE x = "'+x+'" AND y = "'+y+'";';
			ige.mysql.query(query, function(err, rows) 
			{
				if(err)
				{
					console.log(err);
				}
			});
			plant.destroy();
			delete plant;
		}
	},
	
	onHarvestAndStore: function(x,y,clientID)
	{
		var plant = ige.$('Plant_'+x+'_'+y);
		
		if(plant)
		{
			var dbconfig = ige.server.dbconfig;
			
			if(plant.percentRate > 80)
			{
				PlayerStats.getPlayer(ige.server.clients[clientID], function(player)
				{
					PlayerStats.addGold(player.id, dbconfig.plantCorrectSell);
				});
			}
			else if(plant.percentRate == 100)
			{
				PlayerStats.getPlayer(ige.server.clients[clientID], function(player)
				{
					PlayerStats.addGold(player.id, dbconfig.plantBestSell);
				});
			}
			plant.destroy();
			delete plant;
		}
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = HarvestAction; }
