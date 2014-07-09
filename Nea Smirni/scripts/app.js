(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {

		app.application = new kendo.mobile.Application(document.body, {
			platform: !0 ? !0 ? "android" : "ios" : "ios7",
			initial: "view-welcome"
		});

        navigator.splashscreen.hide();
		app.application.skin("flat");

		app.settings.set("deviceId", device.uuid)
		app.settings.set("hostName", "qqw.directit.ca:8000")
		app.settings.set("hostName", "89.210.253.91:8000")
		app.settings.set("hostName", "192.168.2.6:8000")
		app.settings.set("hostName", "dctlt060:8000")
		app.settings.set("hostName", "dctlt063:8000")
		app.settings.set("hostName", "192.168.2.50:8000")

		app.currentInspectionId = ""
		
		app.settings.isInetConnected = true
		app.isLoggedIn = true;
		
		kendo.bind($("#settingsListView"), app.settings);
		kendo.bind($("#loginDeviceId"), app.settings);
		kendo.bind($("#openHomePage"), app.settings);
		kendo.bind($("#no-host"), app.settings);
		
		app.settings.set("isHostConnected", false)

		$.ajax({
			url: app.settings.devValidURL()
			, success: function (data) {
				app.settings.set("isDeviceValid", data)
			}
			, error: function (x,s,e) {
				app.settings.set("isDeviceValid", undefined)
			}

        })

	}, false);


	app.isInetConnected = false;
	app.isDeviceValid   = false;
	
	app.newNoteText ="Note text";

	app.imageCount = 0;

	app.settings = new kendo.data.ObservableObject({
		deviceId: "noDeviceId"
		, hostName: "noHostName"
		, serviceHostURL: function () {
			return "http://" + this.get("hostName") + "/permitservice"
        }
		, devValidURL: function () {
			return this.get("serviceHostURL()") + "/IsDeviceValid?deviceid=" + this.get("deviceId")
        }
		, headersURL: function () {
			return this.get("serviceHostURL()") + "/GetInspectionHeaders"
		}
		, insbaseURL: function () {
			return this.get("serviceHostURL()") + "/GetInspection"
		}
		, notesURL: function () {
			return this.get("serviceHostURL()") + "/GetInspectionNotes"
		}
		, addNoteURL: function () {
			return this.get("serviceHostURL()") + "/AddInspectionNote"
		}
		, dsDataType: "jsonp"
		, isHostConnected: false
		, isInetConnected: false
		, isDeviceValid: false

    });
	
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
    	app.isInetConnected = true;
		//alert("online")
	}

	document.addEventListener("offline", onOffline, false);
	function onOffline() {
    	app.settings.set("isHostConnected", false);
		app.headersDataSource.data([])
		//alert("offline")
	}

	app.closeAssessModalView = function (e) {
        $("#modal-psfc").kendoMobileModalView("close");
    };
	
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
		navigator.splashscreen.show()
		setTimeout(function() {navigator.splashscreen.hide()}, 3000)
	};

	app.getHostName = function () {
		//app.headersDataSource.transport.options.read.url = app.settings.get("headersURL()")
		//app.headersDataSource. read();
    }

	app.setAndReadFor = function (InspectionId) {
		if (app.currentInspectionId !== InspectionId) {
			app.currentInspectionId = InspectionId || app.currentInspectionId
        }
		return true
    }

})(window);