var Title = IgeEntity.extend(
{
	classId: 'Title',

	init: function (x,y)
	{
		this.Fertility = 0;
		this.MaxFertility = 0;
		this.Humidity = 0;
		this.owned = false;
		this.owner = 0;
		this.attackedBy = 0;
		this.autocapture = false;
	},
	
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Title; }
