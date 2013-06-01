// Setting popovers
$("#register_confirm_password").popover(
{
	placement: "bottom",
	trigger: "manual",
	container: "#hoverlay",
	content: "Passwords must be the same!"
});
$("#register-btn").popover(
{
	placement: "bottom",
	trigger: "manual",
	container: "#hoverlay",
	content: "An error occured while registering :("
});
$("#login-btn").popover(
{
	placement: "bottom",
	trigger: "manual",
	container: "#hoverlay",
	content: "Sorry, I can't connect you :("
});

// Auto hiding "different passwords" popover when focusing confirm password field
$("#register_confirm_password").focus(function() 
{
	$(this).popover('hide');
});

// Activating buttons when focusing forms
$('#login').focusin(function() 
{
	$("#login-btn").addClass("btn-primary").popover("hide");;
});

$('#login').focusout(function() 
{
	$("#login-btn").removeClass("btn-primary");
});

$('#register').focusin(function() 
{
	$("#register-btn").addClass("btn-primary").popover("hide");
});

$('#register').focusout(function() 
{
	$("#register-btn").removeClass("btn-primary");
});

// What have to be done when trying to login or register
$('#login').submit(function(e, h) 
{
	e.preventDefault();
	data = {'email': $('#login_email').val(), 'password': $('#login_password').val()};
	ige.network.send('playerLogin', data);
});

$('#register').submit(function(e, h) 
{
	e.preventDefault();
	if($('#register_password').val() == $('#register_confirm_password').val()) 
	{
		data = 
		{
			'email': $('#register_email').val(),
			'password': $('#register_password').val(),
			'difficulty': $('#register_difficulty').val()
		};
		ige.network.send('playerRegister', data);
	} 
	else
	{
		$("#register_confirm_password").popover('show');
		}
});

$("#logout-link").click(function() 
{
	ige.network.send("playerLogout");
	$("#hoverlay").fadeIn("1000");
	$("#login-content").slideDown("1000");
	$("#admin-link").fadeOut("1000");
	$("#player-section").fadeOut("1000", function() {
		// Resetting player section values to null to prevent privacy issues
		$(".player-name").text("");
		$(".player-gold").text("");
		$(".player-level").text("");
	});
	$("#top-buttons").fadeOut("1000");
	$("#health-bar").fadeOut("500", function() {
		$(".current-life").text("");
		$(".max-life").text("");
		$("#health-bar .graphic").css("width", "0px");
	});
	$("#action-bar").fadeOut("500", function() 
	{
		if(ige.client.activeButton) 
		{
			$(ige.client.activeButton).removeClass("clicked");
		}
	});
});

// Handling action bar actions
$("#action-bar .action").click(function() 
{
	if($(this).hasClass("arg") && !$(this).attr("data-arg"))
	{
		return;
	}
	if(ige.client.activeButton)
	{
		$(ige.client.activeButton).removeClass("clicked");
	}
	ige.client.activeButton = this;
	$(this).addClass("clicked");
});

$("#action-bar .subclick").click(function()
{
	if(ige.client.activeButton)
	{
		$(ige.client.activeButton).removeClass("clicked");
	}
	ige.client.activeButton = $(this).parent().parent().children()[0];
	$(ige.client.activeButton).attr("src",$(this).attr("src"));
	$(ige.client.activeButton).attr("data-arg",$(this).attr("data-arg"));
	$(ige.client.activeButton).addClass("click");
	$(ige.client.activeButton).addClass("clicked");
});

// Handling administration link
$("#admin-link").click(function() 
{
	ige.network.send("adminlink");
});

// Handling administration save button
$("#admin").submit(function(e) 
{
	e.preventDefault();
	content = {};
	$("#admin :input").each(function() 
	{
		if(this.name)
		{
			content[this.name] = $(this).val();
		}
	});
	ige.network.send("updateadmin",content);
	$("#admin-content").slideUp("1000");
	$("#hoverlay").fadeOut("1000");
});

$(".hoverlay-close-btn").click(function() 
{
	$("#admin-content").slideUp("1000");
	$("#hoverlay").fadeOut("1000");
});
