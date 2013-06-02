var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;
		ige.timeScale(1);
		
		this.users = {};
		this.clients = {};
		this.players = {};
		this.characters = {};
		this.conquests = [];
		this.attacks = {};
		this.world = new World();
		self.plants = new Plants();
		
		this.implement(ServerNetworkEvents);
		
		// Connecting to MySQL server
		ige.addComponent(IgeMySqlComponent, options.db).mysql.connect(function(err, db) {
			if(err)
				console.log(err);
		});
		
		// Add the networking component
		ige.addComponent(IgeNetIoComponent)
			// Start the network server
			.network.start(2000, function () {
				// Networking has started so start the game engine
				ige.start(function (success) {
					// Check if the engine started successfully
					if (success) {
						// Create some network commands we will need
						ige.network.define('playerRegisterError');
						ige.network.define('playerRegister', self._onPlayerRegister);
						ige.network.define('playerLogin', self._onPlayerLogin);
						ige.network.define('playerLoginError');
						ige.network.define('playerLogout', self._onPlayerLogout);
						ige.network.define('playerEntity');
						ige.network.define('playerUpdate');
						
						ige.network.define('characterMove');
						ige.network.define('mapSection', self._onMapSection);
						ige.network.define('playerConquerAction', self._onPlayerConquerAction);
						
						ige.network.define('adminlink', self._onAdminLink);
						ige.network.define('updateadmin', self._onUpdateAdmin);
						
						ige.network.on('disconnect', self._onPlayerDisconnect);
						
						ige.network.define('onRightClick', self._onRightClick);
						ige.network.define('onLeftClick', self._onLeftClick);
						
						ige.network.define('tileBlinking');
						ige.network.define('tileAttack');
						ige.network.define('tileConquest');
						
						ige.network.define('updateLife');
						
						// Add the network stream component
						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(30) // Send a stream update once every 30 milliseconds
							.stream.start(); // Start the stream
						
						ige.network.acceptConnections(true);
						
						// Create the scene
						self.mainScene = new IgeScene2d()
							.id('mainScene')
							.drawBounds(false)
							.drawBoundsData(false);

						// Create the scene
						self.objectScene = new IgeScene2d()
							.id('objectScene')
							.depth(0)
							.drawBounds(false)
							.drawBoundsData(false)
							.mount(self.mainScene);
						
						// Create the main viewport and set the scene
						// it will "look" at as the new scene1 we just
						// created above
						self.vp1 = new IgeViewport();
						self.vp1.id('vp1');
						self.vp1.autoSize(true);
						self.vp1.scene(self.mainScene);
						self.vp1.drawBounds(true);
						self.vp1.drawBoundsData(true);
						self.vp1.mount(ige);
								
						// Create an isometric tile map
						self.TitleMap = new IgeTileMap2d()
						self.TitleMap.id('TitleMap')
						self.TitleMap.tileWidth(40)
						self.TitleMap.tileHeight(40)
						self.TitleMap.mount(self.objectScene);
						
						self.world = new World();
						PlantAction.LoadPlants();
						
						// Starting life regeneration of players
						setInterval(PlayerStats.regenLife, 3000);
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }
