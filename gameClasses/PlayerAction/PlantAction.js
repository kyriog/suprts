//TODO: implémenter la persistence ( save, update reload des plants au start du serveur).
//DONE: Trouver une méthode pour gérer plusieurs types de plantes de facon simple
//DONE, NEED TO WORK ON VALUE: Faire évoluer la Fertilité/Water de la tile ou est planté la graine
//DONE: Check de distance classique pour qu on puisse uniquement faire des actions a une case de distance

var PlantAction = 
{
	onPlantAction: function(x,y,choice,clientID)
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

		var characterCoordinate = ige.server.characters[clientID].worldPosition().thisTo2d();
		var xCharacter = Math.round( characterCoordinate.x/40 );
		var yCharacter = Math.round( characterCoordinate.y/40 );
		var Distance = Math.abs(xCharacter - x) + Math.abs(yCharacter - y);
		
		if( Distance <= 2 )
		{
			console.log('onPlantAction: function('+x*40+','+y*40+','+choice+','+clientID+')');
			var chunk = ige.server.world.chunksCache[xChunk + ' ' + yChunk];
			var tile = chunk.getTitle(xTitle,yTitle);
			this.CheckPlant(x,y, tile, chunk, choice,this, this.AddNewPlant);
		}
	},
	
	
	AddNewPlant: function(x,y,tile,chunk,choice,ctx)
	{
		var p = new Plant();
		p.seed = choice;
		p.tile = tile;
		p.chunk = chunk;
		p.updateCallback = ctx.UpdatePlant;
			
		p.x = x;
		p.y = y;
			
		ctx.SavePlant(p);
		p.streamMode(1).mount(ige.server.TitleMap);
		var point = new IgePoint(x*40 - 8, y*40 - 9, 0);
		p.translateToPoint(point.thisToIso());
	},
	
	CheckPlant: function(x,y,tile,chunk,choice,ctx,callback)
	{
		var query = 'SELECT id FROM plants WHERE x = '+x+' AND y = '+y+'';
		ige.mysql.query(query, function(err, rows) 
		{
			if(err)
			{
				console.log(err);
			}
			
			if(rows.length == 0)
			{
				callback(x,y,tile,chunk,choice,ctx);
			}
			
		});
	},
	
	SavePlant: function(plant)
	{
		var query = 'INSERT INTO plants (x,y,type,percent) VALUES ("'+plant.x+'", "'+plant.y+'", \''+plant.seed+'\', '+plant.percentRate+');';
		ige.mysql.query(query, function(err, rows) 
		{
			if(err)
			{
				console.log(err);
			}
		});
	},
	
	UpdatePlant: function(plant)
	{
		var query = 'UPDATE plants SET percent = '+plant.percentRate+' WHERE x = "'+plant.x+'" AND y = "'+plant.y+'"';
		ige.mysql.query(query, function(err, rows) 
		{
			if(err)
			{
				console.log(err);
			}
		});
	},
	
	LoadPlants: function()
	{
		//TODO: Load plants at server starts.
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlantAction; }