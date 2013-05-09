var config = {
	include: [
		{name: 'ServerNetworkEvents', path: './gameClasses/Network/ServerNetworkEvents'},
		{name: 'Player', path: './gameClasses/Entities/Player'},
		{name: 'World', path: './gameClasses/World/World'},
		{name: 'Character', path: './gameClasses/Entities/Character'},
		{name: 'Chunk', path: './gameClasses/World/Chunk'},
		{name: 'Title', path: './gameClasses/World/Title'},
		{name: 'extend', path: './gameClasses/utils/extend'},
		{name: 'WorldGenerator', path: './gameClasses/World/WorldGenerator'},
		{name: 'AttackAction', path: './gameClasses/PlayerAction/AttackAction'},
		{name: 'FertilizeAction', path: './gameClasses/PlayerAction/FertilizeAction'},
		{name: 'HarvestAction', path: './gameClasses/PlayerAction/HarvestAction'},
		{name: 'WateringAction', path: './gameClasses/PlayerAction/WateringAction'},
		{name: 'PlantAction', path: './gameClasses/PlayerAction/PlantAction'},
		//{name: 'DatabaseManager', path: './gameClasses/Database/DatabaseManager'}
	],
	db: {
		type: 'mysql',
		host: 'localhost',
		user: 'root',
		pass: 'mathieu59',
		dbName: 'suprts'
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
