var Plants = IgeEntity.extend(
{
	classId: 'Plants',
	
	init: function()
	{
		this.plants = new Object();
		this.plants[0] = { name: 'wheat', maturationRate: 10, decayTime: 10, Productivity: 10, Storability: 10, SeedPrice: 10, texturePath: './assets/wheat-', minFertility: 20, minHumidity: 10};
		this.plants[1] = { name: 'tomatoes', maturationRate: 10, decayTime: 10, Productivity: 10, Storability: 10, SeedPrice: 10, texturePath: './assets/tomato-', minFertility: 20, minHumidity: 10};
		this.plants[2] = { name: 'corn', maturationRate: 10, decayTime: 10, Productivity: 10, Storability: 10, SeedPrice: 10, texturePath: './assets/corn-', minFertility: 20, minHumidity: 10};
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Plants; }