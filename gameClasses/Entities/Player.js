// Define our player
var Player = IgeEntity.extend(
{
	classId: 'Player',

	init: function () 
	{
		var self = this;
		IgeEntity.prototype.init.call(this);
		this.streamSections(['transform', 'money', 'level']);
		
		this.money = 0;
		this.level = 0;
		
		this.guiCallback; // Proto: guiCallback(attributeName, value);
		
		this.drawBounds(false);
		this.drawBoundsData(false);
		this.isometric(true);

		// Setup the entity 3d bounds
		self.size3d(20, 20, 40);

		// Create a character entity as a child of this container
		self.character = new Character().id(this.id() + '_character').setType(3).drawBounds(false).drawBoundsData(false).originTo(0.5, 0.6, 0.5).mount(this);
	},

	streamSectionData: function (sectionId, data) 
	{
		if (sectionId === 'money') 
		{
			if (data) 
			{				
				if(!ige.isServer && this.money != data)
				{
					this.money = data;
					this.guiCallback('money',this.money); // for update GUI
				}
			} 
			else 
			{
				return this.money;
			}
		} 
		else if(sectionId == 'level')
		{
			if (data) 
			{

				if(!ige.isServer && this.level != data)
				{
					this.level = data;
					this.guiCallback('level',this.level); // for update GUI
				}
			} 
			else 
			{
				return this.level;
			}
		}
		else 
		{
			return IgeEntity.prototype.streamSectionData.call(this, sectionId, data);
		}
	},
	/**
	 * Tweens the character to the specified world co-ordinates.
	 * @param x
	 * @param y
	 * @return {*}
	 */
	walkTo: function (x, y) 
	{
		console.log('CharacterContainer Walking to (' + x + ',' + y + ')');
		var self = this,
			distX = x - this.translate().x(),
			distY = y - this.translate().y(),
			distance = Math.distance(this.translate().x(),this.translate().y(),x,y),
			speed = 0.1,
			time = (distance / speed),
			direction = '';

		// Set the animation based on direction - these are modified
		// for isometric views
		if (distY < 0) 
		{
			direction += 'N';
		}

		if (distY > 0) 
		{
			direction += 'S';
		}

		if (distX > 0) 
		{
			direction += 'E';
		}

		if (distX < 0) 
		{
			direction += 'W';
		}

		switch (direction)
		{		
			case 'N':
				this.character.animation.select('walkRight');
				break;

			case 'S':
				this.character.animation.select('walkLeft');
				break;

			case 'E':
				this.character.animation.select('walkRight');
				break;

			case 'W':
				this.character.animation.select('walkLeft');
				break;

			case 'SE':
				this.character.animation.select('walkDown');
				break;

			case 'NW':
				this.character.animation.select('walkUp');
				break;

			case 'NE':
				this.character.animation.select('walkRight');
				break;

			case 'SW':
				this.character.animation.select('walkLeft');
				break;
		}

		// Start tweening the little person to their destination
		this._translate.tween().stopAll().properties({x: x, y: y}).duration(time).afterTween(function () {self.character.animation.stop();}).start();

		return this;
	},

	tick: function (ctx) 
	{
		// Set the depth to the y co-ordinate which basically
		// makes the entity appear further in the foreground
		// the closer they become to the bottom of the screen
		this.depth(this._translate.y);
		IgeEntity.prototype.tick.call(this, ctx);
	}

	
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Player; }
