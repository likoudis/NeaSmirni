(function (global) {
    var app = global.app = global.app || {};
	
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
    }, false);

   app.application = new kendo.mobile.Application(document.body, {});

	app.isLoggedIn = false;

	app.closeLoginModalView = function (e) {
        $("#loginModalView").kendoMobileModalView("close");
		app.isLoggedIn = !app.isLoggedIn;
        $("#openHomePage").data("kendoMobileButton").enable(app.isLoggedIn);
    };
	
	app.foo = {
		init: function () {
		    $("#my-drawer").data("kendoMobileDrawer").show();
        }
    };
})(window);