var World = IgeClass.extend(
{
	classId: 'World',
	
	
	init: function () 
	{
		this.Generator = new WorldGenerator(1);
		this.chunksCache = new Object();
	},
	
	getChunk: function(x,y)
	{
		if(this.ChunkExist(x,y) == true)
		{
			var c = this.LoadChunk(x,y);
			this.chunksCache[x+' '+y] = c;
			return c;
		}
		else
		{
			var c = new Chunk(x,y);
			this.Generator.GenerateChunk(c);
			this.SaveChunk(c);
			this.chunksCache[x+' '+y] = c;
			return c;
		}
	},
	
	getChunks: function(x,y,radius)
	{
		var chunks = new Array();
		var index = 0;
		
		var minX = x - radius*10;
		var minY = y - radius*10;
		var maxX = x + radius*10;
		var maxY = y + radius*10;
		
		console.log('minX: ' + minX + ' minY: ' + minY + ' maxX: ' + maxX + ' maxY: '+ maxY);
		
		for(var X = minX; X < maxX; X=X+10)
		{
			for(var Y = minY; Y < maxY; Y=Y+10)
			{
				chunks[index] = this.getChunk(X,Y);
				index++;
			}
		}
		
		return chunks;
	},
	
	// TODO: Implements better
	ChunkExist: function(x,y)
	{
		if(this.chunksCache.hasOwnProperty(x+' '+y))
		{
			return true;
		}
		else
		{
			return false;
		}
	},
	
	// TODO: Implements persistence
	LoadChunk: function(x,y)
	{
		return this.chunksCache[x+' '+y];
	},
	
	// TODO: Implements persistence
	SaveChunk: function(chunk)
	{
	}
	
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = World; }