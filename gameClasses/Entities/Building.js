var Building = IgeEntity.extend(
{
	classId: 'Building',

	init: function () 
	{
		var self = this;
		IgeEntity.prototype.init.call(this);
	
		self.size3d(40, 40, 40);
		this.drawBounds(false);
		this.drawBoundsData(false);
		this.isometric(true);

		// Setup the entity 3d bounds
		//self.size3d(20, 20, 40);

		// Create a character entity as a child of this container
		if(!ige.isServer) 
		{
			// Load the character texture file
			this.Texture = new IgeTexture('./assets/textures/buildings/bakery1.png');

			// Wait for the texture to load
			this.Texture.on('loaded', function () { self.texture(self.Texture).dimensionsFromCell(); }, false, true);
		}
	},
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Building; }