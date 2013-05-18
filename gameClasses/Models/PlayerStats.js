var PlayerStats =
{
	getPlayer: function(id, callback)
	{
		if(!ige.server.players[id])
		{
			var query = 'SELECT email, difficulty, money, level FROM users WHERE id="'+id+'" LIMIT 1;';
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
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = PlayerStats; }
