var Plants = IgeEntity.extend(
{
	classId: 'Plants',
	
	init: function()
	{
		this.plants = new Object();
		this.plants['wheat'] = { name: 'wheat', maturationRate: 10, decayTime: 10, Productivity: 10, Storability: 10, SeedPrice: 10, texturePath: './assets/tomato-', minFertility: 20, minHumidity: 10};
		this.plants['tomatoes'] = { name: 'tomatoes', maturationRate: 10, decayTime: 10, Productivity: 10, Storability: 10, SeedPrice: 10, texturePath: './assets/tomato-', minFertility: 20, minHumidity: 10};
		this.plants['corn'] = { name: 'corn', maturationRate: 10, decayTime: 10, Productivity: 10, Storability: 10, SeedPrice: 10, texturePath: './assets/tomato-', minFertility: 20, minHumidity: 10};
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Plants; }