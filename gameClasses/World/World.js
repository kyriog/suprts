var World = IgeClass.extend(
{
	classId: 'World',
	
	
	init: function () 
	{
		this.Generator = new WorldGenerator(1);
		this.chunksCache = new Object();
	},
		
	getChunkRef: function(x,y)
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
			
		return ige.server.world.chunksCache[xChunk + ' ' + yChunk];
	
	},
	
	getTileRef: function(x,y)
	{
		var chunk = this.getChunkRef(x,y);
		var xTitle = chunk.xChunk - x;
		var yTitle = chunk.yChunk - y;
			
		if(xTitle < 0)
		{
			xTitle = xTitle * -1;
		}
			
		if(yTitle < 0)
		{
			yTitle = yTitle * -1;
		}
		
		return chunk.getTitle(xTitle,yTitle);
	},
	
	getChunk: function(x,y,callback)
	{
		var self = this;
		if(this.chunksCache.hasOwnProperty(x+' '+y))
		{
			callback(this.chunksCache[x+' '+y]);
		}
		else
		{
			// Then Try to load it from database
			var query = 'SELECT x,y,data FROM chunks WHERE x = "'+x+'" AND y = "'+y+'";';
			ige.mysql.query(query, function(err, rows) 
			{
				if(err) 
				{
				}
				else if(rows.length == 0) // Then generating it
				{
					var c = new Chunk(x,y);
					self.Generator.GenerateChunk(c);
					self.SaveChunk(c);
					self.chunksCache[x+' '+y] = c;
					callback(c);
				}
				else
				{	
					var c = new Chunk();
					var c1 = eval('(' + rows[0].data + ')');
					extend(c,c1);
					self.chunksCache[x+' '+y] = c;
					callback(c);
				}
			});

		}
	},
	
	getChunks: function(x,y,radius, callback)
	{		
		var minX = x - radius*10;
		var minY = y - radius*10;
		var maxX = x + radius*10;
		var maxY = y + radius*10;
		
		console.log('minX: ' + minX + ' minY: ' + minY + ' maxX: ' + maxX + ' maxY: '+ maxY);
		
		for(var X = minX; X < maxX; X=X+10)
		{
			for(var Y = minY; Y < maxY; Y=Y+10)
			{
				this.getChunk(X,Y,callback);
			}
		}
		
	},

	SaveChunk: function(chunk)
	{
		var query = 'INSERT INTO chunks (x,y,data) VALUES ("'+chunk.xChunk+'", "'+chunk.yChunk+'", \''+JSON.stringify(chunk)+'\');';
		ige.mysql.query(query, function(err, rows) 
		{
			if(err)
			{
				console.log(err);
			}
		});
	},
	
	UpdateChunk: function(chunk)
	{
		var query = 'UPDATE chunks SET data = \''+JSON.stringify(chunk)+'\' WHERE x = "'+chunk.xChunk+'" AND y = "'+chunk.yChunk+'"';
		ige.mysql.query(query, function(err, rows) 
		{
			if(err)
			{
				console.log(err);
			}
		});
	}
	
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = World; }