var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;
		ige.timeScale(1);
		
		this.users = {};
		this.clients = {};
		this.characters = {};
		this.world = new World();
		
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
						ige.network.define('playerEntity');
						ige.network.define('playerMove', self._onPlayerMove);
						
						ige.network.define('characterMove');
						ige.network.define('mapSection', self._onMapSection);
						ige.network.define('playerNeuterConquest', self._onPlayerNeuterConquest);
						
						ige.network.on('disconnect', self._onPlayerDisconnect);
						
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
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }
