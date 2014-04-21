(function (global) {
    var app = global.app = global.app || {};
	
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
    }, false);

	app.application = new kendo.mobile.Application(document.body, {});

	app.isLoggedIn = false;

	app.closeLoginModalView = function (e) {
        $("#loginModalView").kendoMobileModalView("close");
		if (e.sender.element.text().trim() !== "Cancel") {
			app.isLoggedIn = !app.isLoggedIn;
			$("#openHomePage").data("kendoMobileButton").enable(app.isLoggedIn);
        }
    };
	
	app.onSnapShow = function (e) {
			sessionStorage.removeItem('imagepath');
			// Take picture using device camera and retrieve image as base64-encoded string
			navigator.camera.getPicture(
				onPhotoDataSuccess, 
				onFail, { 
					quality: 50, 
					destinationType: Camera.DestinationType.FILE_URI
				}
			);
		}
		
		function onPhotoDataSuccess(imageURI) { 
			// Uncomment to view the base64 encoded image data
			// console.log(imageData);
		
			window.resolveLocalFileSystemURI(imageURI, resolveOnSuccess, resOnError); 
		}

		function onFail(message) {
			alert('Failed because: ' + message);
		}

		//Callback function when the file system uri has been resolved
		function resolveOnSuccess(entry){ 
			//new file name
			var newFileName = new Date();
			newFileName = newFileName.getTime();
			newFileName = newFileName + ".jpg";
			var NSAppFolder = "MyInspections";
		
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
			//The folder is created if doesn't exist
				fileSys.root.getDirectory( NSAppFolder,
					{create:true, exclusive: false},
					function(directory) {
						entry.moveTo(directory, newFileName,  successMove, resOnError);
					},
					resOnError
				);
			},
			resOnError);
		}
		
		//Callback function when the file has been moved successfully - inserting the complete path
		function successMove(entry) {
			//Store imagepath in session for future use
			// like to store it in database
			sessionStorage.setItem('imagepath', entry.fullPath);
			document.getElementById("snap-fname").innerHTML=entry.fullPath;
			document.getElementById("snap-thumb").src=entry.fullPath;
			//document.getElementById("snap-thumb").src="styles/images/My_municipality.png";
		}
		
		function resOnError(error) {
			alert(error.code);
		}
})(window);