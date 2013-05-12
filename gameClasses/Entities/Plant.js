var Plant = IgeEntity.extend(
{
	classId: 'Plant',

	init: function () 
	{
		var self = this;
		IgeEntity.prototype.init.call(this);
		self.counter = 0;
		self.size3d(40, 40, 40);
		this.streamSections(['transform', 'percentRate', 'seed']);
		
		this.plantType = 0;

		this.percentRate = 0;
		this.seed = 0;
		
		this.loaded = false;
		
		// Server Only:
		
		this.tile = 0;
		this.chunk = 0;
		this.x;
		this.y;
		
		this.updateCallback;
	},
	
	streamSectionData: function (sectionId, data) 
	{
		if (sectionId === 'percentRate') 
		{
			if (data) 
			{
				this.percentRate = data;
			} 
			else 
			{
				return this.percentRate;
			}
		} 
		else if (sectionId === 'seed' )
		{
			if (data) 
			{
				this.seed = data;
			} 
			else 
			{
				return this.seed;
			}
		}
		else 
		{
			return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
		}
	},
	
	
	load: function(seed)
	{
		if(this.seed != 0)
		{
			if(!this.loaded)
			{
				if(!ige.isServer)
				{
					this._clientLoad(seed);			
				}
				else
				{
					this._serverLoad(seed);
				}
				
				this.loaded = true;
			}
		}
	},
	
	
	_serverLoad: function(seed)
	{
		this.plantType = ige.server.plants.plants[seed];
	},
	
	
	_clientLoad: function(seed)
	{
		this.plantType = ige.client.plants.plants[seed];
			
		this.tex1 = new IgeTexture( this.plantType.texturePath + '1.png');
		this.tex2 = new IgeTexture( this.plantType.texturePath + '2.png');
		this.tex3 = new IgeTexture( this.plantType.texturePath + '3.png');
		this.tex4 = new IgeTexture( this.plantType.texturePath + '4.png');
		this.tex5 = new IgeTexture( this.plantType.texturePath + '5.png');
	},

	
	tick: function (ctx) 
	{	
		this.load(this.seed);
		this.depth(this._translate.y);
		
		if(!ige.isServer)
		{
			this._clientTick(ctx);
		}
		else
		{
			this._serverTick(ctx);
		}

		IgeEntity.prototype.tick.call(this, ctx);
	},
	
	
	_serverTick: function(ctx)
	{	
		this.counter++;
		
		if(this.percentRate < 100 ) // Growing Time
		{
			if( this.counter == this.plantType.maturationRate)
			{			
				//TODO: Fix It, need to adapt value
				/*
				if(	this.tile.Fertility > this.plantType.minFertility && this.tile.Humidity  > this.plantType.minHumidity )
				{
					this.percentRate++;
				}
				else
				{
					if(this.percentRate != 0)
						this.percentRate--;
				}
				
				if(this.tile.Fertility != 0)
					this.tile.Fertility--;
					
				if(this.tile.Humidity != 0)
					this.tile.Humidity--;
				
				ige.server.world.UpdateChunk(this.chunk);
				*/
				this.percentRate++;
				this.counter = 0;
				this.updateCallback(this);
			}
		}
		else // Decay Time
		{
		
		}
	
	},
	
	
	_clientTick: function(ctx)
	{
		if(this.seed != 0)
		{
			if(this.percentRate == 0)
			{
				this.texture(this.tex1);
			}
			else if(this.percentRate == 25)
			{
				this.texture(this.tex2);
			}
			else if(this.percentRate == 50)
			{
				this.texture(this.tex3);
			}
			else if(this.percentRate == 75)
			{
				this.texture(this.tex4);
			}
			else if(this.percentRate == 100)
			{
				this.texture(this.tex5);
			}
			
		}
	}
	
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Plant; }