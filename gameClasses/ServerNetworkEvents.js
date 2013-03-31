var ServerNetworkEvents = {
	_onPlayerRegister: function(data, clientId) {
		if(!ige.server.users[data.email]) {
			ige.server.users[data.email] = {'password': data.password};
			ige.server.clients[clientId] = data.email;
			ige.network.send('playerLogin');
		} else
			ige.network.send('playerRegisterError');
	},
	
	_onPlayerLogin: function(data, clientId) {
		if(ige.server.users[data.email] && ige.server.users[data.email]['password'] == data.password)
			ige.network.send('playerLogin');
		else
			ige.network.send('playerLoginError');
	},
	
	_onPlayerDisconnect: function(clientId) {
		delete(ige.server.clients[clientId]);
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ServerNetworkEvents; }
