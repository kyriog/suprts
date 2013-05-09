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
		var tilePoint = ige.$('TitleMap').mouseTileWorldXY().to2d();	
		ige.network.send('onLeftClick', {x: tilePoint.x,y: tilePoint.y});
	},
	
	// Action
	_mouseRight: function (event, x, y, button)
	{
		if(ige.client.activeButton) 
		{
			var tilePoint = ige.$('TitleMap').mouseTileWorldXY().to2d();
			var xTitle = tilePoint.x/40;
			var yTitle = tilePoint.y/40;
			var data = {x: xTitle,y: yTitle,action: $(ige.client.activeButton).attr("id")};
			if($(ige.client.activeButton).attr("data-arg"))
				data.arg = $(ige.client.activeButton).attr("data-arg");
			ige.network.send("onRightClick",data);
		}
	},
	
	// Joker ^^
	_mouseMid: function (event, x, y, button)
	{
		
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClickComponent; }
