var MainControler = IgeClass.extend(
{

	init: function()
	{
		
	},
	
	SetMode: function(mode)
	{
		switch(mode)
		{
			case 'Fertilize':
			break;
		
			case 'Watering':
			break;

			case 'Plant':
			break;

			case 'Harvest':
			break;
		
			case 'TakeTile':
			break;
			
			case 'Build':
			break;			
		
		}
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = MainControler; }