var Plant = IgeEntity.extend(
{
	classId: 'Plant',

	init: function () 
	{
		var self = this;
		IgeEntity.prototype.init.call(this);
		self.counter = 1000;
		
		self.size3d(40, 40, 40);
		if(!ige.isServer) 
		{
			// Load the character texture file
			this.tomato0 = new IgeTexture('./assets/tomato-0.png');
			this.tomato1 = new IgeTexture('./assets/tomato-1.png');
			this.tomato2 = new IgeTexture('./assets/tomato-2.png');
			this.tomato3 = new IgeTexture('./assets/tomato-3.png');

			// Wait for the texture to load
			this.tomato0.on('loaded', function () { self.texture(self.tomato0); }, false, true);
		}
	},
	
	tick: function (ctx) 
	{
		
		this.depth(this._translate.y);
		
		this.counter--;
		
		if(!ige.isServer) 
		{
			if(this.counter == 750)
			{
				this.texture(this.tomato1);
			}
			
			if(this.counter == 500)
			{
				this.texture(this.tomato2);
			}
			
			if(this.counter == 250)
			{
				this.texture(this.tomato3);
			}
		}
		
		IgeEntity.prototype.tick.call(this, ctx);
	}
	
	
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Plant; }