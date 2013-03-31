var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,

	init: function (options) {
		var self = this;
		ige.timeScale(1);
		
		this.users = {};
		this.clients = {};
		
		this.implement(ServerNetworkEvents);
		
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
						
						ige.network.on('disconnect', self._onPlayerDisconnect);
						
						ige.network.acceptConnections(true);
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }
