var ServerNetworkEvents = 
{

	_onRightClick: function(data, clientId)
	{
		console.log('_onRightClick: function('+data+', '+clientId+')');
		switch(data.action)
		{
			case 'Attack':
				AttackAction.onAttackTile(data.x,data.y,clientId);
			break;
			
			case 'Fertilize':
				FertilizeAction.onFertilizeTitle(data.x,data.y,clientId);
			break;
			
			case 'Watering':
				WateringAction.onWateringTile(data.x,data.y,clientId);
			break;
			
			case 'Harvest':
				HarvestAction.onHarvestTile(data.x,data.y,data.arg,clientId);
			break;
			
			case 'Plant':
				PlantAction.onPlantAction(data.x,data.y,data.arg,clientId);
			break;
		}
	},
	
	
	_onLeftClick: function(data, clientId)
	{
		console.log('_onLeftClick: function('+data+', '+clientId+')');
		if(ige.server.characters[clientId]) 
		{		
			console.log('Walking ' + clientId + ' to (' + data.x + ',' + data.y + ')');
			ige.network.send('characterMove', { id : ige.server.characters[clientId].id() ,x : data.x ,y : data.y });
			ige.server.characters[clientId].walkTo(data.x, data.y);
		}
	},
	
	
	_onPlayerRegister: function(data, clientId) 
	{
		var query = 'SELECT config_value FROM config WHERE config_name="start_money"';
		ige.mysql.query(query, function(err, rows) 
		{
			if(!err) 
			{
				var money = 0;
				switch(data.difficulty) 
				{
					case "easy":
						money = rows[0].config_value;
						break;
					case "normal":
						money = rows[0].config_value / 2;
						break;
					case "hard":
						money = rows[0].config_value / 10;
						break; 
				}
				var query = 'INSERT INTO users (email, password, difficulty, money, currenthp, maxhp) VALUES ("'+data.email+'", SHA1("'+data.password+'"), "'+data.difficulty+'", "'+money+'");';
				ige.mysql.query(query, function(err, rows) 
				{
					if(!err) 
					{
						ige.server.clients[clientId] = rows.insertId;
						PlayerStats.getPlayer(rows.insertId, function(player) {
							player.clientId = clientId;
						});
						
						clientData = {
							is_admin: 0,
							// We may add a player name, it could be prettier than an ugly email address
							name: data.email,
							gold: money,
							level: 0,
							currentHp: 10,
							maxHp: 10,
						};
						ige.network.send('playerLogin', clientData, clientId);
						// We should move these 3 lines to another method to avoid duplicate code
						ige.server.characters[clientId] = new Player().id(clientId).streamMode(1).mount(ige.server.TitleMap);
						ige.server.characters[clientId].translateTo(0,0,0);
						ige.network.send('playerEntity', {id: ige.server.characters[clientId].id(), dbId: rows.insertId}, clientId);
					} 
					else 
					{
						console.log(err);
						ige.network.send('playerRegisterError', null, clientId);
					}
				});
			} 
			else 
			{
				console.log(err);
				ige.network.send('playerRegisterError', null, clientId);
			}
		});
	},
	
	
	_onPlayerLogin: function(data, clientId) 
	{
		var query = 'SELECT id, email, is_administrator FROM users WHERE email = "'+data.email+'" AND password = SHA1("'+data.password+'") LIMIT 1;';
		ige.mysql.query(query, function(err, rows) 
		{
			if(err) 
			{
				console.log(err);
				ige.network.send('playerLoginError', null, clientId);
			} 
			else if(rows.length == 0) 
			{
				ige.network.send('playerLoginError', null, clientId);
			}
			else 
			{
				ige.server.clients[clientId] = rows[0].id;
				PlayerStats.getPlayer(rows[0].id, function(player) {
					player.clientId = clientId;
					
					var clientData = {
						is_admin: rows[0].is_administrator,
						// We may add a player name, it could be prettier than an ugly email address
						name: rows[0].email,
						gold: player.gold,
						level: player.level,
						currentHp: player.level*10,
						maxHp: player.level*10,
					};
					ige.network.send('playerLogin', clientData, clientId);
				});
				
				// We should move these 3 lines to another method to avoid duplicate code
				ige.server.characters[clientId] = new Player().id(clientId).streamMode(1).mount(ige.server.TitleMap);
				ige.server.characters[clientId].translateTo(0,0,0);
				ige.network.send('playerEntity', {id: ige.server.characters[clientId].id(), dbId: rows[0].id}, clientId);
				ServerNetworkEvents._onMapSection(clientId);
			}
		});
	},
	
	
	_onMapSection: function(clientId) 
	{
		ige.server.world.getChunks(0,0,2, function(c) 
		{
			ige.network.send('mapSection', c);
		});
	},
	
	
	_onPlayerDisconnect: function(clientId) 
	{
		PlayerStats.getPlayer(ige.server.clients[clientId], function(player) {
			player.clientId = false;
		});
		delete(ige.server.clients[clientId]);
		
		if (ige.server.characters[clientId]) 
		{
			ige.server.characters[clientId].destroy();
			delete ige.server.characters[clientId];
		}
	},
	
	
	// Same as _onPlayerDisconnect, but seems we cannot share same event for a define() and a on() event
	_onPlayerLogout: function(data, clientId) 
	{
		delete(ige.server.clients[clientId]);
		
		if (ige.server.characters[clientId]) 
		{
			ige.server.characters[clientId].destroy();
			delete ige.server.characters[clientId];
		}
	},
	
	
	_onAdminLink: function(nodata, clientId) 
	{
		query = 'SELECT is_administrator FROM users WHERE id="'+ige.server.clients[clientId]+'" LIMIT 1;';
		ige.mysql.query(query, function(err, rows) 
		{
			if(err || !rows[0].is_administrator) 
			{
				data = { can_access: 0 };
				ige.network.send('adminlink', data, clientId);
			} 
			else 
			{
				query = "SELECT * FROM config";
				ige.mysql.query(query, function(err, rows) 
				{
					content = {};
					for(config in rows) 
					{
						content[rows[config].config_name] = rows[config].config_value; 
					}
					data = { can_access: 1, content: content };
					
					ige.network.send('adminlink', data, clientId);
				});
			}
		});
	},
	
	
	_onUpdateAdmin: function(data, clientId) 
	{
		query = 'SELECT is_administrator FROM users WHERE id="'+ige.server.clients[clientId]+'";';
		ige.mysql.query(query, function(err, rows) 
		{
			if(!err && rows[0].is_administrator) 
			{
				for(config in data) 
				{
					query = 'UPDATE config SET config_value="'+data[config]+'" WHERE config_name="'+config+'";';
					ige.mysql.query(query, function(err) 
					{
						if(err)
						{
							console.log("Unable to update value for "+config);
						}
						else
						{
							console.log("Setting '"+config+"' to '"+data[config]+"'");
						}
					});
				}
			}
		});
	},
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
