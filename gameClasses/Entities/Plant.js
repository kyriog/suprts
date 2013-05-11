var Plant = IgeEntity.extend(
{
	classId: 'Plant',

	init: function () 
	{
		var self = this;
		IgeEntity.prototype.init.call(this);
		self.counter = 0;
		self.size3d(40, 40, 40);
		
		this.percentRate = 1;
		this.tile;
		this.plantType;
	
	},
	
	setType: function(seed)
	{
		if(!ige.isServer) 
		{
			this.plantType = ige.client.plants.plants[1];
		}
		else
		{
			this.plantType = ige.server.plants.plants[1];
		}
		
		if(!ige.isServer) 
		{
			this.tex1 = new IgeTexture( this.plantType.texturePath + '1.png');
			this.tex2 = new IgeTexture( this.plantType.texturePath + '2.png');
			this.tex3 = new IgeTexture( this.plantType.texturePath + '3.png');
			this.tex4 = new IgeTexture( this.plantType.texturePath + '4.png');
			this.tex5 = new Igetexture( this.plantType.texturePath + '5.png');
			// Wait for the texture to load
			this.tex1.on('loaded', function () { self.texture(self.tex1); }, false, true);
		}
	},
	
	decayTile: function(tile)
	{
		this.tile.Fertility--;
		this.tile.Humidity--;
	},
	
	tick: function (ctx) 
	{		
		this.depth(this._translate.y);
		this.counter++;
		
		if(this.percentRate < 100 ) // Growing Time
		{
			if( this.counter == this.plantType.maturationRate)
			{
				
				if(	this.tile.Fertility > this.plantType.minFertility && 
					this.tile.Humidity  > this.plantType.minHumidity )
				{
					this.percentRate++;
				}
				else // Plant will not grows if not min rate in Humidity/Fertility
				{
					this.percentRate--;
				}
				
				this.counter = 0;
				this.decayTile(this.tile);
				
				// TODO: Save
			}
		}
		else // Decay Time
		{
			
				//TODO: delete
		}

		// Update Graphic on clients
		if(!ige.isServer) 
		{
			if(this.percentRate == 25)
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
		
		IgeEntity.prototype.tick.call(this, ctx);
	}
	
	
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Plant; }