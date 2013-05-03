var ServerNetworkEvents = {
	_onPlayerRegister: function(data, clientId) {
		var query = 'INSERT INTO users (email, password, level) VALUES ("'+data.email+'", SHA1("'+data.password+'"), "'+data.difficulty+'");';
		ige.mysql.query(query, function(err, rows) {
			if(!err) {
				ige.server.clients[clientId] = rows.insertId;
				clientData = { is_admin: 1 };
				ige.network.send('playerLogin', clientData);
				// We should move these 3 lines to another method to avoid duplicate code
				ige.server.characters[clientId] = new CharacterContainer().id(clientId).streamMode(1).mount(ige.server.TitleMap);
				ige.server.characters[clientId].translateTo(0,0,0);
				ige.network.send('playerEntity', ige.server.characters[clientId].id(), clientId);
			} else {
				console.log(err);
				ige.network.send('playerRegisterError');
			}
		});
	},
	
	_onPlayerLogin: function(data, clientId) {
		var query = 'SELECT id, is_administrator FROM users WHERE email = "'+data.email+'" AND password = SHA1("'+data.password+'") LIMIT 1;';
		ige.mysql.query(query, function(err, rows) {
			if(err) {
				console.log(err);
				ige.network.send('playerLoginError');
			} else if(rows.length == 0) 
				ige.network.send('playerLoginError');
			else {
				ige.server.clients[clientId] = rows[0].id;
				clientData = { is_admin: rows[0].is_administrator };
				ige.network.send('playerLogin', clientData);
				// We should move these 3 lines to another method to avoid duplicate code
				ige.server.characters[clientId] = new CharacterContainer().id(clientId).streamMode(1).mount(ige.server.TitleMap);
				ige.server.characters[clientId].translateTo(0,0,0);
				ige.network.send('playerEntity', ige.server.characters[clientId].id(), clientId);
			}
		});
	},
		
	_onMapSection: function(clientId) {
		var chunks = ige.server.world.getChunks(0,0,2);
		console.log('chunks.length: ' + chunks.length);
		for(var i = 0; i < chunks.length; i++)
		{
			ige.network.send('mapSection', chunks[i]);
		}
	},
	
	_onPlayerDisconnect: function(clientId) {
		delete(ige.server.clients[clientId]);
		if (ige.server.characters[clientId]) 
		{
			ige.server.characters[clientId].destroy();
			delete ige.server.characters[clientId];
		}
	},
	
	
	_onPlayerMove: function (data, clientId) 
	{
		if(ige.server.characters[clientId]) 
		{		
			console.log('Walking ' + clientId + ' to (' + data.x + ',' + data.y + ')');
			ige.network.send('characterMove', { id : ige.server.characters[clientId].id() ,x : data.x ,y : data.y });
			ige.server.characters[clientId].walkTo(data.x, data.y);
			
		}
	},
	
	_onPlayerNeuterConquest: function(data, clientId)
	{
		if(ige.server.characters[clientId]) 
		{
			var xChunk = data.x - data.x%10;
			var yChunk = data.y - data.y%10;
			
			if(data.x < 0)
			{
				xChunk = ( Math.ceil(data.x / 10) * 10);
				if(data.x % 10 != 0)
				{
					xChunk = xChunk - 10;
				}
			}
			
			if(data.y < 0)
			{
				yChunk = ( Math.ceil(data.y / 10) * 10);
				if(data.y % 10 != 0)
				{
					yChunk = yChunk - 10;
				}
			}
			
			
			var xTitle = xChunk - data.x;
			var yTitle = yChunk - data.y;
			
			if(xTitle < 0)
			{
				xTitle = xTitle * -1;
			}
			
			if(yTitle < 0)
			{
				yTitle = yTitle * -1;
			}

			var characterCoordinate = ige.server.characters[clientId].worldPosition().thisTo2d();
			var xCharacter = Math.round( characterCoordinate.x/40 );
			var yCharacter = Math.round( characterCoordinate.y/40 );
			var Distance = Math.abs(xCharacter - data.x) + Math.abs(yCharacter - data.y);

			/*
				console.log('data.x: ' + data.x + ' data.y: ' + data.y);
				console.log('xChunk: ' + xChunk + ' yChunk: ' + yChunk);
				console.log('xTitle: ' + xTitle + ' yTitle: ' + yTitle);
				console.log('xCharacter: ' + xCharacter + ' yCharacter: ' + yCharacter);
				console.log('Distance: ' + Distance);
			*/
			
			if( Distance <= 2 )
			{
				var chunk = ige.server.world.chunksCache[xChunk + ' ' + yChunk];
				chunk.getTitle(xTitle,yTitle).owned = true;
				chunk.getTitle(xTitle,yTitle).owner = clientId;
				ige.server.world.SaveChunk(chunk);
				ige.network.send('mapSection', chunk);
			}
			else
			{
				console.log('Too far for conquest title');		
			}
			
		}
		
	},
	
	_onAdminLink: function(data, clientId) {
		query = 'SELECT is_administrator FROM users WHERE id="'+ige.server.clients[clientId]+'" LIMIT 1;';
		ige.mysql.query(query, function(err, rows) {
			if(err || !rows[0].is_administrator) {
				data = { can_access: 0 };
				ige.network.send('adminlink', data);
			} else {
				query = "SELECT * FROM config";
				ige.mysql.query(query, function(err, rows) {
					content = {};
					for(config in rows) {
						content[rows[config].config_name] = rows[config].config_value; 
					}
					data = { can_access: 1, content: content };
					
					ige.network.send('adminlink', data);
				});
			}
		});
	},
	
	_onUpdateAdmin: function(data, clientId) {
		query = 'SELECT is_administrator FROM users WHERE id="'+ige.server.clients[clientId]+'";';
		ige.mysql.query(query, function(err, rows) {
			if(!err && rows[0].is_administrator) {
				for(config in data) {
					query = 'UPDATE config SET config_value="'+data[config]+'" WHERE config_name="'+config+'";';
					ige.mysql.query(query, function(err) {
						if(err)
							console.log("Unable to update value for "+config);
						else
							console.log("Setting '"+config+"' to '"+data[config]+"'");
					});
				}
			}
		});
	},
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
