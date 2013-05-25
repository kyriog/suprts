//MOSTLY DONE, TODO reloadOnStartup: implémenter la persistence ( save, update reload des plants au start du serveur).
//DONE: Trouver une méthode pour gérer plusieurs types de plantes de facon simple
//DONE, NEED TO WORK ON VALUE: Faire évoluer la Fertilité/Water de la tile ou est planté la graine
//DONE: Check de distance classique pour qu on puisse uniquement faire des actions a une case de distance

var PlantAction = 
{
	onPlantAction: function(x,y,choice,clientID)
	{
		var characterCoordinate = ige.server.characters[clientID].worldPosition().thisTo2d();
		var xCharacter = Math.round( characterCoordinate.x/40 );
		var yCharacter = Math.round( characterCoordinate.y/40 );
		var Distance = Math.abs(xCharacter - x) + Math.abs(yCharacter - y);
		
		if( Distance <= 2 )
		{
			console.log('onPlantAction: function('+x*40+','+y*40+','+choice+','+clientID+')');
			var chunk = ige.server.world.getChunkRef(x,y);
			var tile = ige.server.world.getTileRef(x,y);
			
			if(ige.server.clients[clientID] == tile.owner) // On verifie qu'on est bien sur une de nos tiles;
			{
				this.CheckPlant(x,y, tile, chunk, choice,this, this.AddNewPlant);
			}
		}
	},
	
	
	AddNewPlant: function(x,y,tile,chunk,choice,ctx)
	{
		var p = new Plant();
		p.id('Plant_'+x+'_'+y);
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
		var ctx = this;
		var query = 'SELECT * FROM plants WHERE 1';
		ige.mysql.query(query, function(err, rows) 
		{
			if(err)
			{
				console.log(err);
			}
			
			for(var i = 0; i < rows.length; i++)
			{
				var p = new Plant();
				p.id('Plant_'+rows[i].x+'_'+rows[i].y);
				
				p.percentRate = rows[i].percent;
				var seed = rows[i].type;
				var xP = rows[i].x;
				var yP = rows[i].y;
				
				ige.server.world.getChunkRef(xP,yP, function(chunk)
				{
					p.chunk = chunk;
					p.seed = seed;
					
					var xTitle = chunk.xChunk - xP;
					var yTitle = chunk.yChunk - yP;
						
					if(xTitle < 0)
					{
						xTitle = xTitle * -1;
					}
						
					if(yTitle < 0)
					{
						yTitle = yTitle * -1;
					}

					p.tile = chunk.getTitle(xTitle,yTitle);
					
					p.updateCallback = ctx.UpdatePlant;
						
					p.x = xP;
					p.y = yP;
					
					p.streamMode(1).mount(ige.server.TitleMap);
					var point = new IgePoint(p.x*40 - 8, p.y*40 - 9, 0);
					p.translateToPoint(point.thisToIso());
				});
			}
		});
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlantAction; }