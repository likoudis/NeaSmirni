(function (global) {
    var app = global.app = global.app || {};
	
    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();
		app.application.skin("flat");
    }, false);

	app.application = new kendo.mobile.Application(document.body, {
		platform: !0 ? !0 ? "android" : "ios" : "ios7"});

	app.isLoggedIn = false;
	app.isConnected = false;
	
	app.imageCount = 0;
	
	app.settings = new kendo.observable({
		serviceHostURL: "http://dctlt063:8000/directit.permitting/service"
    });

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

	// Connection related stuff

	document.addEventListener("online", onOnline, false);

	function onOnline() {
    	app.isConnected = true;
		//alert("online")
	}

	document.addEventListener("offline", onOffline, false);

	function onOffline() {
    	app.isConnected = false;
		//alert("offline")
	}

	app.closeAssessModalView = function (e) {
        $("#modal-psfc").kendoMobileModalView("close");
    };
	
	app.onInspectionShow = function(e) {
		var filterParam = e.view.params.filter;
		
		$("#inspxListViewNavBar").data("kendoMobileNavBar").title( 
			filterParam === "all" ? "All Inspections" :
			filterParam === "today" ? "Today's Inspections" :
			filterParam === "weeks" ? "This week's Inspections" : "All Inspections"
		);
    }

	app.changeSkin = function (e) {
		var mobileSkin = "flat";

		if (e.sender.element.text() === "Flat") {
			mobileSkin = "flat";
			e.sender.element.text("Native");
		} else {
			mobileSkin = "";
			e.sender.element.text("Flat");
		}
		app.application.skin(mobileSkin);
	};

	app.inspxDataList = new kendo.data.DataSource({
		transport: {
			read: {
				url: "data/InspxList_all.json",
				dataType: "json"
			}
		}
	});

	app.initInspxs = function () {
		app.inspxDataList.read();

    }
})(window);