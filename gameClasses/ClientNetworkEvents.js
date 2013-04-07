var ClientNetworkEvents = {
	_onPlayerRegisterError: function() {
		$("#register-btn").popover("show");
	},
	
	_onPlayerLogin: function(data) {
		$("#hoverlay").hide();
	},
	
	_onPlayerLoginError: function() {
		$("#login-btn").popover("show");
	}
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = ClientNetworkEvents; }
