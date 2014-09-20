(function (global) {
    var app = global.app = global.app || {};

	//alert(localStorage.getItem("NeaSmyrni.settings"))
    document.addEventListener('deviceready', function () {

		app.application = new kendo.mobile.Application(document.body, {
			platform: !0 ? !0 ? "android" : "ios" : "ios7",
			initial: "view-welcome"
		});

        navigator.splashscreen.hide();
		app.application.skin("flat");

		app.settings.bind("change",function(e) {
			var item=e.field
			switch(item) {
				case "hostName": case "useJson":
					localStorage.setItem("NeaSmyrni." + item, app.settings.get(item))
			}
        })

		app.settings.set("deviceId", device.uuid)
		//app.settings.set("deviceId", "b32f2b6527524b5c")
		app.lsInitialise("hostName", "qqw.directit.ca:8000")
		//app.settings.set("hostName", "qqw.directit.ca:8000")
		//app.settings.set("hostName", "89.210.253.91:8000")
		//app.settings.set("hostName", "192.168.2.6:8000")
		//app.settings.set("hostName", "dctlt063:8000")
		//app.settings.set("hostName", "dctlt060:8000")
		//app.settings.set("hostName", "192.168.2.50:8000")
		//app.settings.set("hostName", "192.168.2.60:8000")

		app.lsInitialise("useJson", true)
		app.settings.isInetConnected = true
		app.settings.set("isHostConnected", false)
		app.currentInspectionId = 0
		app.currentInspxAddress = ""
		app.currentPermitId = 0
		
		app.isLoggedIn = true;
		
		app.reportElement = ""
		
		kendo.bind($("#drawer-settings"), app.settings);
		kendo.bind($("#drawer-filter"), app.settings);
		kendo.bind($("#loginDeviceId"), app.settings);
		kendo.bind($("#openHomePage"), app.settings);
		kendo.bind($("#no-host"), app.settings);
		kendo.bind($("#logout"), app.settings);

		app.checkValidDevice()
		
		app.itsTheSimulator = function() {
			return device.uuid.substr(-6) === "010333"
        }

		document.addEventListener("backbutton", function(){}, false);
		
	}, false);


	app.isInetConnected = false;
	app.isDeviceValid   = false;
	
	app.newNoteText ="Note text";

	//app.imageCount = 0;

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
		, getHistoryURL: function () {
			return this.get("serviceHostURL()") + "/GetHistoricalInspectionHeaders"
		}
		, getInspxPicturesURL: function () {
			return this.get("serviceHostURL()") + "/GetInspectionImages"
		}
		, saveInspxImageURL: function (inspection, filename) {
			return this.get(
			"serviceHostURL()") + "/SaveInspectionImage"
			+ "?DeviceId=" + this.get("deviceId")
			+ "&InspectionId=" + inspection
			//+ "&ImageFileName=" + filename
		}
		, getInspxCheckListXmlURL: function (inspection) {
			return this.get(
			"serviceHostURL()") + "/GetInspectionCheckListXml"
			+ "?DeviceId=" + this.get("deviceId")
			+ "&InspectionId=" + inspection
		}
		, useJson: false
		, dsDataType: function () {return "json" + (app.settings.useJson ? "" : "p")}
		, isHostConnected: false
		, isInetConnected: false
		, isDeviceValid: false
		, headerDateRange: "all"
		, contains: ""
		, uploadProgress: 0

    });
	
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
		setTimeout(function() {navigator.splashscreen.hide()}, 2000)
	};

	app.checkValidDevice = function () {
		$.ajax({
			url: app.settings.devValidURL()
			, success: function (data) {
				//console.log(data)
				app.settings.set("isDeviceValid", data)
			}
			, error: function (x,s) {
				//console.log(x,s,e)
				app.settings.set("isDeviceValid", undefined)
				app.showStatus("Could not authorize the device: " + s)
			}
			, timeout: 5000
			, callbackParameter: 'callback'
    	});
	}

	app.onReportShow = function (e) {
		var t = e.view.header.find(".km-navbar").data("kendoMobileNavBar")
		t.title("Report - " + app.currentInspxAddress)

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
		if (document.querySelector("#xlistXMLTable1")) {
			document.getElementById("scroller-report").removeChild(
				document.getElementById("xlistXMLTable1"))
			document.getElementById("scroller-report").removeChild(
				document.getElementById("xlistXMLH2"))
			document.getElementById("scroller-report").removeChild(
				document.getElementById("xlistXMLTable3"))
        }
		document.getElementById("scroller-report").appendChild(resultDocument)
	}

	app.onEmailShow = function (e) {
		var t = e.view.header.find(".km-navbar").data("kendoMobileNavBar")
		t.title("Email - " + app.currentInspxAddress)
	}

	app.acDictionary = new kendo.data.DataSource({
		transport: {
		 	read: {
		 	 	url: "data/MyInspections/dictionary.json",
		 	 	dataType: "json"
		 	}
		}
    })
	
	app.logout = function () {
		app.settings.set("isDeviceValid", false)
    }
	
	app.onWelcomeShow = function () {
		history.go(-history.length+1)
    }
	
	app.showStatus = function(message) {
		var statusLineElement = document.getElementById("status-line")
		statusLineElement.style.webkitTransition= "opacity 0s"
		statusLineElement.style.opacity = 1
		statusLineElement.innerHTML =message
		setTimeout(
			function() {
				statusLineElement.style.webkitTransition= "opacity 2s"
				statusLineElement.style.opacity = 0
			}
			, 5000
		)
    }
	
	app.ajax4datasouce = function (option, url, dataObject, that) {
		$.ajax({
			url: url
			, dataType: app.settings.dsDataType()
			, data: $.extend(
				{deviceid: app.settings.deviceId }
				, dataObject)
			, timeout: 5000
			, beforeSend: function(e) {app.application && app.application.showLoading()}
			, complete:   function(e) {
				app.application && app.application.hideLoading();
}
			, success: function(result){
				// notify the data source that the request succeeded
				option.success(result)
			}
			, error: function(result) {
				// notify the data source that the request failed
				option.error(result);
				app.application && app.application.hideLoading()
				app.showStatus("Datasource transport reports: "+ result.statusText)
			}
		})
    }
	
	app.guid = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
		function(c) {var r = Math.random()*16|0, v=c==='x'?r:r&0x3|0x8;return v.toString(16);})
    }
	
	app.lsInitialise = function(item, value) {
		if (localStorage.getItem("NeaSmyrni."+item) !== null)
			app.settings.set(item, localStorage.getItem("NeaSmyrni."+item))
		else {
			app.settings.set(item, value)
		}
    }
})(window);