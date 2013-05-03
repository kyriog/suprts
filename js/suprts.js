// Setting popovers
$("#register_confirm_password").popover({
	placement: "bottom",
	trigger: "manual",
	container: "#hoverlay",
	content: "Passwords must be the same!"
});
$("#register-btn").popover({
	placement: "bottom",
	trigger: "manual",
	container: "#hoverlay",
	content: "An error occured while registering :("
});
$("#login-btn").popover({
	placement: "bottom",
	trigger: "manual",
	container: "#hoverlay",
	content: "Sorry, I can't connect you :("
});

// Auto hiding "different passwords" popover when focusing confirm password field
$("#register_confirm_password").focus(function() {
	$(this).popover('hide');
});

// Activating buttons when focusing forms
$('#login').focusin(function() {
	$("#login-btn").addClass("btn-primary").popover("hide");;
});
$('#login').focusout(function() {
	$("#login-btn").removeClass("btn-primary");
});
$('#register').focusin(function() {
	$("#register-btn").addClass("btn-primary").popover("hide");
});
$('#register').focusout(function() {
	$("#register-btn").removeClass("btn-primary");
});

// What have to be done when trying to login or register
$('#login').submit(function(e, h) {
	e.preventDefault();
	data = {'email': $('#login_email').val(), 'password': $('#login_password').val()};
	ige.network.send('playerLogin', data);
});
$('#register').submit(function(e, h) {
	e.preventDefault();
	if($('#register_password').val() == $('#register_confirm_password').val()) {
		data = {
			'email': $('#register_email').val(),
			'password': $('#register_password').val(),
			'difficulty': $('#register_difficulty').val()
		};
		ige.network.send('playerRegister', data);
	} else
		$("#register_confirm_password").popover('show');
});

// Handling administration link
$("#admin-link").click(function() {
	ige.network.send("adminlink");
});

// Handling administration save button
$("#admin").submit(function(e) {
	e.preventDefault();
	content = {};
	$("#admin :input").each(function() {
		if(this.name)
			content[this.name] = $(this).val();
	});
	ige.network.send("updateadmin",content);
	$("#admin-content").slideUp("1000");
	$("#hoverlay").fadeOut("1000");
});

$(".hoverlay-close-btn").click(function() {
	$("#admin-content").slideUp("1000");
	$("#hoverlay").fadeOut("1000");
});
