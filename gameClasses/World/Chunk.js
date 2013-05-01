var Chunk = IgeClass.extend(
{
	classId: 'Chunk',

	init: function (x,y)
	{
		this.xChunk = x;
		this.yChunk = y;
		this.titles = new Array(100);
	},
	
	getTitles: function()
	{
		return this.titles;
	},
	
	getTitle: function(x,y)
	{
		return this.titles[10*x+y];
	},
	
	setTitle: function(x,y,value)
	{
		this.titles[10*x+y] = value;
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Chunk; }