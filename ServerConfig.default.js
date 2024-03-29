var config = {
	include: [
		{name: 'DbConfig', path: './gameClasses/Utils/DbConfig'},
		{name: 'ServerNetworkEvents', path: './gameClasses/Network/ServerNetworkEvents'},
		{name: 'Player', path: './gameClasses/Entities/Player'},
		{name: 'Plant', path: './gameClasses/Entities/Plant'},
		{name: 'Plants', path: './gameClasses/Models/Plants'},
		{name: 'PlayerStats', path: './gameClasses/Models/PlayerStats'},
		{name: 'World', path: './gameClasses/World/World'},
		{name: 'Character', path: './gameClasses/Entities/Character'},
		{name: 'Chunk', path: './gameClasses/World/Chunk'},
		{name: 'Title', path: './gameClasses/World/Title'},
		{name: 'extend', path: './gameClasses/Utils/extend'},
		{name: 'WorldGenerator', path: './gameClasses/World/WorldGenerator'},
		{name: 'DefendAction', path: './gameClasses/PlayerAction/DefendAction'},
		{name: 'AttackAction', path: './gameClasses/PlayerAction/AttackAction'},
		{name: 'FertilizeAction', path: './gameClasses/PlayerAction/FertilizeAction'},
		{name: 'HarvestAction', path: './gameClasses/PlayerAction/HarvestAction'},
		{name: 'WateringAction', path: './gameClasses/PlayerAction/WateringAction'},
		{name: 'PlantAction', path: './gameClasses/PlayerAction/PlantAction'},
	],
	db: {
		type: 'mysql',
		host: 'localhost',
		user: 'root',
		pass: '',
		dbName: 'suprts'
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = config; }
