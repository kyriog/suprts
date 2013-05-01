var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/ServerNetworkEvents'},
		{name: 'Character', path: './gameClasses/Character'},
		{name: 'CharacterContainer', path: './gameClasses/CharacterContainer'},
		{name: 'World', path: './gameClasses/World/World'},
		{name: 'Chunk', path: './gameClasses/World/Chunk'},
		{name: 'Title', path: './gameClasses/World/Title'},
		{name: 'WorldGenerator', path: './gameClasses/World/WorldGenerator'},
		//{name: 'DatabaseManager', path: './gameClasses/Database/DatabaseManager'}
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
