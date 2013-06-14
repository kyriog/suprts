var DbConfig = 
{
	loadConfig: function()
	{
		var query = "SELECT config_name, config_value FROM config";
		ige.mysql.query(query, function(err, rows) {
			if(!err)
			{
				for(id in rows)
				{
					var name = rows[id].config_name,
						value = rows[id].config_value;

					ige.server.dbconfig[name] = value;
				}
			}
			else
			{
				console.log(err);
			}
		});
	},
	
	setConfig: function(name, value)
	{
		if(ige.server.dbconfig[name]) // We can't create new config values!
		{
			ige.server.dbconfig[name] = parseFloat(value);
			
			var query = 'UPDATE config SET config_value="'+value+'" WHERE config_name="'+name+'" LIMIT 1;';
			ige.mysql.query(query, function(err) {
				if(err)
				{
					console.log("Unable to update value for "+name+" with value "+value);
				}
				else
				{
					console.log("Setting '"+name+"' to '"+value+"'");
				}
			});
		}
		else
		{
			console.log('Blocking creating config "'+name+'" with value "'+value+'"');
		}
	},
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = DbConfig; }
