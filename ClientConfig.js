var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'./gameClasses/Network/ClientNetworkEvents.js',
		'./gameClasses/Entities/Player.js',
		'./gameClasses/Entities/Character.js',
		'./gameClasses/Models/Plants.js',
		'./gameClasses/Entities/Plant.js',
		'./gameClasses/Entities/Hit.js',
		'./gameClasses/ClickComponent.js',
		'./gameClasses/World/Chunk.js',
		'./gameClasses/World/Title.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }
