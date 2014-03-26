(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
    }, false);

    app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout"});

	app.closeLoginModalView = function () {
        $("#loginModalView").kendoMobileModalView("close");
    }


})(window);