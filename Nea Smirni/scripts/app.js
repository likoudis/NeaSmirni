(function (global) {
    var app = global.app = global.app || {};
	
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
    }, false);

	app.application = new kendo.mobile.Application(document.body, {});

	app.isLoggedIn = false;
	
	app.imageCount = 0;

	app.closeLoginModalView = function (e) {
        $("#loginModalView").kendoMobileModalView("close");
		if (e.sender.element.text().trim() !== "Cancel") {
			app.isLoggedIn = !app.isLoggedIn;
			$("#openHomePage").data("kendoMobileButton").enable(app.isLoggedIn);
        }
    };
	
	app.onSnapShow = function (e) {
		// Take picture using device camera and retrieve image file
		navigator.camera.getPicture(
			onPhotoDataSuccess, 
			onFail, 
			{   quality: 50, 
				destinationType: Camera.DestinationType.FILE_URI
			}
		);
	}
	
	function onPhotoDataSuccess(imageURI) { 
		window.resolveLocalFileSystemURI(imageURI, resolveOnSuccess, resOnError); 
	}
		function onFail(message) {
		alert('Failed because: ' + message);
	}
		//Callback function when the file system uri has been resolved
	function resolveOnSuccess(entry){ 
		//new file name
		var fname = app.imageCount;
		fname = fname < 100 ? fname < 10 ? "00"+ fname : "0" + fname : fname ;
		fname = "000000000_" + fname + ".jpg";
		var NSAppFolder = "MyInspections";
	
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
		//The folder is created if doesn't exist
			fileSys.root.getDirectory( NSAppFolder,
				{create:true, exclusive: false},
				function(directory) {
					entry.moveTo(directory, fname,  successMove, resOnError);
				},
				resOnError
			);
		},
		resOnError);
	}
	
	//Callback function when the file has been moved successfully - inserting the complete path
	function successMove(entry) {
		app.imageCount = app.imageCount < 999 ? app.imageCount + 1 : 0;
		document.getElementById("snap-fname").innerHTML=entry.fullPath;
		document.getElementById("snap-thumb").src=entry.fullPath;
	//document.getElementById("snap-thumb").src="styles/images/My_municipality.png";
	}
	
	function resOnError(error) {
		alert(error.code);
	}

})(window);