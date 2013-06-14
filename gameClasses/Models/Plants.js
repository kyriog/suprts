var Plants = IgeEntity.extend(
{
	classId: 'Plants',
	
	init: function(dbconfig)
	{
		this.plants = new Object();
		if(ige.isServer)
		{
		this.plants['wheat'] = { name: 'wheat', maturationRate: dbconfig.wheatMaturation, decayTime: dbconfig.wheatDecay, Productivity: dbconfig.wheatProductivity, Storability: dbconfig.wheatStorability, SeedPrice: dbconfig.wheatPrice, texturePath: './assets/tomato-', minFertility: dbconfig.wheatFertility, minHumidity: dbconfig.wheatHumidity};
		this.plants['tomatoes'] = { name: 'tomatoes', maturationRate: dbconfig.tomatoMaturation, decayTime: dbconfig.tomatoDecay, Productivity: dbconfig.tomatoProductivity, Storability: dbconfig.tomatoStorability, SeedPrice: dbconfig.tomatoPrice, texturePath: './assets/tomato-', minFertility: dbconfig.tomatoFertility, minHumidity: dbconfig.tomatoHumidity};
		this.plants['corn'] = { name: 'corn', maturationRate: dbconfig.cornMaturation, decayTime: dbconfig.cornDecay, Productivity: dbconfig.cornProductivity, Storability: dbconfig.cornStorability, SeedPrice: dbconfig.cornPrice, texturePath: './assets/tomato-', minFertility: dbconfig.cornFertility, minHumidity: dbconfig.cornHumidity};
		}
		else
		{
			this.plants['wheat'] = { texturePath: './assets/tomato-' };
			this.plants['tomatoes'] = { texturePath: './assets/tomato-' };
			this.plants['corn'] = { texturePath: './assets/tomato-' };
		}
	},
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Plants; }
