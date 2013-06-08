var Hit = IgeEntity.extend(
{
	classId: 'Hit',
	
	init: function () 
	{
		var self = this;
		IgeEntity.prototype.init.call(this);
		self.counter = 0;
		self.size3d(40, 40, 40);
		this.texture(new IgeTexture('./assets/hit.png'));
	},
	
	
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Hit; }
