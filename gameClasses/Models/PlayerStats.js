var PlayerStats =
{
	getPlayer: function(id, callback)
	{
		if(!ige.server.players[id])
		{
			var query = 'SELECT email, difficulty, money, level, hp FROM users WHERE id="'+id+'" LIMIT 1;';
			ige.mysql.query(query, function(err, rows) {
				if(!err && rows[0])
				{
					ige.server.players[id] =
					{
						id: id,
						email: rows[0].email,
						difficulty: rows[0].difficulty,
						gold: rows[0].money,
						level: rows[0].level,
						hp: rows[0].hp,
						maxHp: function() {
							return this.level * 10 + 10;
						},
						capturing: 0,
						isResting: false,
					}
					callback(ige.server.players[id]);
				}
			});
		}
		else
		{
			callback(ige.server.players[id]);
		}
	},
	
	_updatePlayer: function(player)
	{
		if(player.clientId)
		{
			var data = { level: player.level, gold: player.gold }
			ige.network.send('playerUpdate', data, player.clientId);
		}
		var query = 'UPDATE users SET level = "'+player.level+'", money = "'+player.gold+'" WHERE id = "'+player.id+'";';
		ige.mysql.query(query);
	},
	
	addLevel: function(id, qty)
	{
		if(typeof qty !== "number")
			qty = 1;
		
		this.getPlayer(id, function(player) {
			player.level += qty;
			PlayerStats._updatePlayer(player);
		});
	},
	
	subLevel: function(id, qty)
	{
		if(typeof qty !== "number")
			qty = 1;
		
		this.getPlayer(id, function(player) {
			player.level -= qty;
			PlayerStats._updatePlayer(player);
		});
	},
	
	setLevel: function(id, level)
	{
		this.getPlayer(id, function(player) {
			player.level = qty;
			PlayerStats._updatePlayer(player);
		});
	},
	
	addGold: function(id, qty)
	{
		if(typeof qty !== "number")
			qty = 1;
		
		this.getPlayer(id, function(player) {
			player.gold += qty;
			PlayerStats._updatePlayer(player);
		});
	},
	
	subGold: function(id, qty)
	{
		if(typeof qty !== "number")
			qty = 1;
		
		this.getPlayer(id, function(player) {
			player.gold -= qty;
			PlayerStats._updatePlayer(player);
		});
	},
	
	setGold: function(id, gold)
	{
		this.getPlayer(id, function(player) {
			player.gold = qty;
			PlayerStats._updatePlayer(player);
		});
	},
	
	regenLife: function()
	{
		for(id in ige.server.players)
		{
			var player = ige.server.players[id];
			if(player.hp != player.maxHp())
			{
				if(player.hp > player.maxHp())
				{
					player.hp = player.maxHp();
				}
				else if(player.hp < player.maxHp())
				{
					player.hp += Math.round(0.5 * player.level + 1);
					if(player.hp > player.maxHp())
					{
						player.hp = player.maxHp();
					}
				}
				
				if(player.isResting && player.hp == player.maxHp())
				{
					player.isResting = false;
				}
				
				if(player.clientId)
				{
					var data = {
						currentHp: player.hp,
						maxHp: player.maxHp(),
						isResting: player.isResting,
					};
					ige.network.send("updateLife", data, player.clientId);
				}
				
				var query = 'UPDATE users SET hp = "'+player.hp+'" WHERE id = "'+id+'" LIMIT 1;';
				ige.mysql.query(query);
			}
		}
	},
	
	subLife: function(player, qty)
	{
		player.hp -= qty;
		if(player.hp < 0)
		{
			player.hp = 0;
		}
		if(player.hp === 0)
		{
			player.isResting = true;
		}
		
		if(player.clientId)
		{
			var data = {currentHp: player.hp, maxHp: player.maxHp()};
			ige.network.send("updateLife", data, player.clientId);
		}
		
		var query = 'UPDATE users SET hp = "'+player.hp+'" WHERE id = "'+id+'" LIMIT 1;';
		ige.mysql.query(query);
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerStats; }
