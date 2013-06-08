var DefendAction = 
{
		onDefendTile: function(x, y, clientId)
		{
			var characterCoordinate = ige.server.characters[clientId].worldPosition().thisTo2d();
			var xCharacter = Math.round( characterCoordinate.x/40 );
			var yCharacter = Math.round( characterCoordinate.y/40 );
			var distance = Math.abs(xCharacter - x) + Math.abs(yCharacter - y);
			
			if(distance <= 2)
			{
				if(ige.server.attacks[x+' '+y] !== undefined)
				{
					var conquest = ige.server.conquests[ige.server.attacks[x+' '+y]];
					conquest.autocapture = false;
					if(conquest.defendInterval)
					{
						clearInterval(conquest.defendInterval);
					}
					if(conquest.attackInterval)
					{
						clearInterval(conquest.attackInterval);
					}
					DefendAction._disableAutocapture(conquest.tiles);
					
					PlayerStats.getPlayer(conquest.conqueror, function(player) {
						player.capturing++;
						conquest.defendInterval = setInterval(DefendAction._doDammage, 2000, conquest, player, xCharacter, yCharacter);
					});
					
					PlayerStats.getPlayer(conquest.attacked, function(player) {
						player.capturing++;
						conquest.attackInterval = setInterval(DefendAction._doDammage, 2000, conquest, player, x, y);
					});
				}
			}
		},
		
		_disableAutocapture: function(tiles)
		{
			for(id in tiles)
			{
				tiles[id].tile.autocapture = false;
			}
		},
		
		_doDammage: function(conquest, player, x, y)
		{
			if(Math.random() <= 0.8) // Default weapon hit ratio is 8/10
			{
				ige.network.send('attackAnim', {x: x, y: y});
				PlayerStats.subLife(player, 5);
				if(player.hp == 0) {
					DefendAction._stopWar(conquest);
				}
			}
		},
		
		_stopWar: function(conquest)
		{
			clearInterval(conquest.defendInterval);
			clearInterval(conquest.attackInterval);
			
			PlayerStats.getPlayer(conquest.attacked, function(attacked) {
				attacked.capturing = 0;
			});
			
			PlayerStats.getPlayer(conquest.conqueror, function(conqueror) {
				conqueror.capturing = 0;
				if(conqueror.hp == 0) // The conqueror is dead
				{
					console.log("Defenders wins!");
					for(id in conquest.tiles) {
						var tile = conquest.tiles[id]; 
						tile.tile.attackedBy = 0;
						var data = {
								xChunk: tile.xChunk,
								yChunk: tile.yChunk,
								xTile: tile.xTile,
								yTile: tile.yTile,
								owner: tile.tile.owner,
						}
						ige.network.send('tileConquest', data);
					}
				}
				else
				{
					console.log("Conqueror wins!");
					for(id in conquest.tiles) {
						var tile = conquest.tiles[id];
						
						PlayerStats.subLevel(tile.owner);
						PlayerStats.addLevel(tile.attackedBy);
						
						tile.tile.owner = tile.tile.attackedBy;
						tile.tile.attackedBy = 0;
						
						var data = {
								xChunk: tile.xChunk,
								yChunk: tile.yChunk,
								xTile: tile.xTile,
								yTile: tile.yTile,
								owner: tile.tile.owner,
						}
						ige.network.send('tileConquest', data);
					}
					
					var gracetime = ige.server.gracetime[conquest.conqueror];
					if(!gracetime)
					{
						ige.server.gracetime[conquest.conqueror] = gracetime = [];
					}
					gracetime.push({
						attacked: conquest.attacked,
						upto: new Date().getTime() + 3600000, // One hour
					});
				}
				delete(ige.server.attacks[conquest.conquerorPos.x+' '+conquest.conquerorPos.y]);
				delete(conquest);
			});
		}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DefendAction; }
