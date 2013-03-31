var ClientNetworkEvents = {
	_onPlayerRegisterError: function() {
		$("#register_message").text("Registration error");
	},
	
	_onPlayerLogin: function(data) {
		$("#hoverlay").hide();
	},
	
	_onPlayerLoginError: function() {
		$("#login_message").text("Login error");
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }
