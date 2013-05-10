var PlantAction = 
{
	onPlantAction: function(x,y,choice,clientID)
	{
		console.log('onPlantAction: function('+x*40+','+y*40+','+choice+','+clientID+')');
		var p = new Plant().streamMode(1).mount(ige.server.TitleMap);
		var point = new IgePoint(x*40 - 8, y*40 - 9, 0);
		p.translateToPoint(point.thisToIso());
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlantAction; }