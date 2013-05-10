var ClientNetworkEvents = 
{
	_onPlayerRegisterError: function() 
	{
		$("#register-btn").popover("show");
	},
	
	
	_onPlayerLogin: function(data) 
	{
		$("#hoverlay").fadeOut("1000");
		$("#login-content").slideUp("1000");
		$("#action-bar").fadeIn("500");
		$("#top-buttons").fadeIn("500");
		if(data.is_admin) 
		{
			$("#admin-link").show();
		}
		
		// Clearing all login/register fields
		$("#login_email").val("");
		$("#login_password").val("");
		$("#register_email").val("");
		$("#register_password").val("");
		$("#register_confirm_password").val("");
		$("#register_difficulty").val("");
	},
	
	
	_onPlayerLoginError: function() 
	{
		$("#login-btn").popover("show");
	},
	
	
	_onAdminLink: function(data) 
	{
		if(data.can_access) 
		{
			for(config in data.content) 
			{
				$('#admin input[name="'+config+'"]').val(data.content[config]);
			}
			
			$("#hoverlay").fadeIn("1000");
			$("#admin-content").slideDown("1000");
		}
	},
	
	
	_onPlayerEntity: function (data) 
	{
		if (ige.$(data.id)) 
		{
			ige.client.vp1.camera.trackTranslate(ige.$(data.id), 50);
			ige.client.playerId = data.dbId;
		} 
		else 
		{
			var self = this;
			self._eventListener = ige.network.stream.on('entityCreated', function (entity) 
			{
				if (entity.id() === data.id) 
				{
					ige.client.playerId = data.dbId;
					// Tell the camera to track out player entity
					ige.client.vp1.camera.trackTranslate(ige.$(data.id), 50);

					// Turn off the listener for this event now that we
					// have found and started tracking our player entity
					ige.network.stream.off('entityCreated', self._eventListener, function (result) 
					{
						if (!result) 
						{
							this.log('Could not disable event listener!', 'warning');
						}
					});
				}
			});
		}
	},
	
	
	_onCharacterMove: function (data)
	{
		console.log('Network Message: _onCharacterMove');
		ige.$(data.id).walkTo(data.x, data.y);
	},
	
	
	_onMapSection: function (data)
	{
		var Index = 0;
		
		ige.client.chunksCache[data.xChunk+' '+data.yChunk] = data;
		
		for (var x = data.xChunk; x < data.xChunk+10; x++) 
		{	
			for (var y = data.yChunk; y < data.yChunk+10; y++) 
			{
				// Code de draw, devra etre refait plus tard pour gérer les niveaux de fertilités mieux, l'humidité, les différentes plantes
				var xTitle = x;
				var yTitle = y;
				
				if(data.titles[Index].owned)
				{
					if(data.titles[Index].owner == ige.client.playerId)
					{
						ige.client.TextureMap.paintTile(xTitle, yTitle, 0, 4);
					}
					else
					{
						ige.client.TextureMap.paintTile(xTitle, yTitle, 0, 0);
					}
				}
				else
				{
					if(data.titles[Index].Fertility >= 0 && data.titles[Index].Fertility < 25)
					{
						ige.client.TextureMap.paintTile(xTitle, yTitle, 1, 1);	
					}
					else if (data.titles[Index].Fertility >= 25 && data.titles[Index].Fertility < 50)
					{
						ige.client.TextureMap.paintTile(xTitle, yTitle, 1, 2);	
					}
					else if (data.titles[Index].Fertility >= 50 && data.titles[Index].Fertility < 75)
					{
						ige.client.TextureMap.paintTile(xTitle, yTitle, 1, 3);		
					}
					else if (data.titles[Index].Fertility >= 75)
					{
						ige.client.TextureMap.paintTile(xTitle, yTitle, 1, 4);		
					}
				}
				
				Index++;
			}
		}
		
		ige.client.TextureMap.cacheForceFrame();
	},
	
	
	_onRightClick: function(data, clientId)
	{
	
	},
	
	
	_onLeftClick: function(data, clientId)
	{
	
	},
	
	_onNeuterConquest: function(data, clientId)
	{
		if(ige.client.chunksCache[data.xChunk+' '+data.yChunk])
		{
			var xTile = data.xChunk + data.xTile,
				yTile = data.yChunk + data.yTile;
			for(i=0;i<3;i++)
			{
				setTimeout(function() {
					ige.client.TextureMap.paintTile(xTile, yTile, 0, 0);
					ige.client.TextureMap.cacheForceFrame();
				}, i*1000);
				
				setTimeout(function()
				{
					ige.client.TextureMap.paintTile(xTile, yTile, 0, 4);
					ige.client.TextureMap.cacheForceFrame();
				}, i*1000+500);
			}
			
			if(data.owner != ige.client.playerId)
			{
				setTimeout(function()
				{
					ige.client.TextureMap.paintTile(xTile, yTile, 0, 0);
					ige.client.TextureMap.cacheForceFrame();
				}, 3000);
			}
		}
	},
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }