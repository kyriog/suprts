/**
 * Adds mouse control to the entity this component is added to.
 * @type {IgeClass}
 */
var ClickComponent = IgeClass.extend(
{
	classId: 'ClickComponent',
	componentId: 'click',

	init: function (entity, options) 
	{
		var self = this;
		self._entity = entity;
		self._options = options;

		ige.input.on('mouseUp', function (event, x, y, button) { self._mouseUp(event, x, y, button); });
	},


	_mouseUp: function (event, x, y, button) 
	{
		switch(button)
		{
			case 1:
			{
				this._mouseLeft(event, x, y, button);
				break;
			}
				
			case 2:
			{
				this._mouseMid(event, x, y, button);
				break;
			}
							
			case 3:
			{
				this._mouseRight(event, x, y, button);
				break;
			}
			
		}
		
	},
	
	// Deplacement
	_mouseLeft: function (event, x, y, button)
	{
		console.log('_mouseLeft: ' + event + ' x:' + x + ' y:' + y );
		var tilePoint = ige.$('TitleMap').mouseTileWorldXY().to2d();	
		ige.network.send('playerMove', {x: tilePoint.x,y: tilePoint.y});
	},
	
	// Action
	_mouseRight: function (event, x, y, button)
	{
		if(ige.client.activeButton) {
			console.log('_mouseRight: ' + event + ' x:' + x + ' y:' + y );
			var tilePoint = ige.$('TitleMap').mouseTileWorldXY().to2d();
			var xTitle = tilePoint.x/40;
			var yTitle = tilePoint.y/40;
			ige.network.send("player"+$(ige.client.activeButton).attr("id"), {x: xTitle,y: yTitle});
		}
	},
	
	// Joker ^^
	_mouseMid: function (event, x, y, button)
	{
		console.log('_mouseMid: ' + event + ' x:' + x + ' y:' + y );
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClickComponent; }
