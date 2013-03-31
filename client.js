var Client = IgeClass.extend({
	classId: 'Client',
	init: function () {
		// Remember to delete this when going to production mode, it's a debug thing!
		ige.showStats(1);

		var self = this;

		// Enable networking
		ige.addComponent(IgeNetIoComponent);
		
		// Implement our game methods
		this.implement(ClientNetworkEvents);

		ige.input.debug(true);
		
		// Create the HTML canvas
		ige.createFrontBuffer(true);
		
		// Start the engine
		ige.start(function (success) {
			// Check if the engine started successfully
			if (success) {
				ige.network.start('http://localhost:2000', function () {
					// Setup the network command listeners
					ige.network.define('playerRegisterError', self._onPlayerRegisterError);
					ige.network.define('playerLogin', self._onPlayerLogin);
					ige.network.define('playerLoginError', self._onPlayerLoginError);
				});
			}
		});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }
