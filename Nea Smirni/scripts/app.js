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
		app.settings.set("hostName", "dctlt063:8000")
		app.settings.set("hostName", "dctlt060:8000")
		app.settings.set("hostName", "192.168.2.60:8000")
		app.settings.set("hostName", "192.168.2.50:8000")

		app.currentInspectionId = 0
		
		app.settings.isInetConnected = true
		app.isLoggedIn = true;
		
		app.reportElement = ""
		
		kendo.bind($("#settingsListView"), app.settings);
		kendo.bind($("#loginDeviceId"), app.settings);
		kendo.bind($("#openHomePage"), app.settings);
		kendo.bind($("#no-host"), app.settings);
		
		app.settings.set("isHostConnected", false)

		app.checkValidDevice()
		
		app.itsTheSimulator = function() {
			return device.uuid.substr(-6) === "010333"
        }
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
		, getInspxPicturesURL: function () {
			return this.get("serviceHostURL()") + "/GetInspectionImages"
		}
		, saveInspxImageURL: function (inspection, filename) {
			return this.get(
			"serviceHostURL()") + "/SaveInspectionImage"
			+ "?deviceid=" + this.get("deviceId")
			+ "&Inspectionid=" + inspection
			+ "&ImageFileName=" + filename
		}
		, getInspxCheckListXmlURL: function (inspection) {
			return this.get(
			"serviceHostURL()") + "/GetInspectionCheckListXml"
			+ "?deviceid=" + this.get("deviceId")
			+ "&Inspectionid=" + inspection
		}
		, dsDataType: "jsonp"
		, isHostConnected: false
		, isInetConnected: false
		, isDeviceValid: false
		, headerDateRange: "all"

    });
	
	app.galleryDataSource = new kendo.data.DataSource({
		transport: {
			read: {
				url: function() {return app.settings.getInspxPicturesURL()}
				, dataType: "jsonp"
				, data: {
					deviceid: function () { return app.settings.deviceId}
					, inspectionId: function () { return app.currentInspectionId}
				}
			}
		}
	})

	app.galleryShow = function () {

		app.galleryDataSource.read()
		//app.itsTheSimulator()
		//? [
		//{fname:"file://C|/Users/Pavlos/Documents/Telerik/Icenium/Simulator/Storage/Persistent/MyInspections/000000000_000.jpg"},
		//{fname:"file://C|/Users/Pavlos/Documents/Telerik/Icenium/Simulator/Storage/Persistent/MyInspections/000000000_001.jpg"},
		//{fname:"file://C|/Users/Pavlos/Documents/Telerik/Icenium/Simulator/Storage/Persistent/MyInspections/000000000_002.jpg"},
		//{fname:"file://C|/Users/Pavlos/Documents/Telerik/Icenium/Simulator/Storage/Persistent/MyInspections/000000000_003.jpg"}
		//] : [
		//{fname:"/storage/sdcard0/MyInspections/000000000_000.jpg"},
		//{fname:"/storage/sdcard0/MyInspections/000000000_001.jpg"},
		//{fname:"/storage/sdcard0/MyInspections/000000000_002.jpg"},
		//{fname:"/storage/sdcard0/MyInspections/000000000_003.jpg"}
		//]
		//)
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

	app.checkValidDevice = function () {
		$.ajax({
			url: app.settings.devValidURL()
			, success: function (data) {
				app.settings.set("isDeviceValid", data)
			}
			, error: function (x,s,e) {
				app.settings.set("isDeviceValid", undefined)
			}
        })
    }

	app.setAndReadFor = function (InspectionId) {
		if (app.currentInspectionId !== InspectionId) {
			app.currentInspectionId = InspectionId || app.currentInspectionId
        }
		return true
    }
	
	app.renderReport = function () {
		var xml = new XMLHttpRequest();
		 xml.open("GET", app.settings.getInspxCheckListXmlURL(app.currentInspectionId) ,false);
		//xml.open("GET", "data/MyInspections/temp/inspection00000.xml" ,false);
		xml.send("");
		var xsl = new XMLHttpRequest();
		xsl.open("GET", "data/MyInspections/Reports/CheckList.xsl",false);
		xsl.send("");
		xsltProcessor = new XSLTProcessor();
		xsltProcessor.importStylesheet(xsl.responseXML);
		resultDocument = xsltProcessor.transformToFragment(xml.responseXML, document);
		app.reportElement = true // app.reportElement === ""
			? document.getElementById("scroller-report").appendChild(resultDocument)
			: document.getElementById("scroller-report").replaceChild(resultDocument, app.reportElement);
	}



})(window);