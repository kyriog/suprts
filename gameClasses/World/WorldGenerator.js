var WorldGenerator = IgeClass.extend(
{
	classId: 'WorldGenerator',
	init: function (s) 
	{
		var seed = s;
	},
	
	GenerateChunk: function(chunk)
	{
		for(var i = 0; i < 100; i++)
		{
			chunk.titles[i] = new Title();
			chunk.titles[i].MaxFertility = Math.ceil(Math.random() * 100);
			chunk.titles[i].Fertility = Math.ceil(Math.random() * chunk.titles[i].MaxFertility);
			chunk.titles[i].Humidity = Math.ceil(Math.random() * 100);
		}
	}
	
	
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = WorldGenerator; }