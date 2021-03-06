(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {

		app.application = new kendo.mobile.Application(document.body, {
			initial: "view-landing"
		});

        navigator.splashscreen.hide();
		app.application.skin("flat");

		app.settings.bind("change",function(e) {
			var item=e.field
			switch(item) {
				case "hostName": case "useJson": case "dsTimeOut":
					localStorage.setItem("NeaSmyrni." + item, app.settings.get(item))
			}
        })

		app.itsTheSimulator = function() {
			return device.uuid.substr(0,2) === "e0"
        }

		app.lsInitialise("dsTimeOut", 5)
		app.settings.set("deviceId", device.uuid)
		app.lsInitialise("hostName", "qqw.directit.ca:8000")
		app.lsInitialise("useJson", true)
		app.settings.isInetConnected = true
		app.settings.set("isHostConnected", false)
		app.currentInspectionId = 0
		app.currentInspxAddress = ""
		app.currentPermitId = 0
		
		app.isLoggedIn = true;
		
		app.reportElement = ""
		
		kendo.bind($("#drawer-settings"), app.settings);
		kendo.bind($("#drawer-search"), app.settings);
		kendo.bind($("#loginDeviceId"), app.settings);
		kendo.bind($("#openHomePage"), app.settings);
		kendo.bind($("#no-host"), app.settings);
		kendo.bind($("#logout"), app.settings);
		kendo.bind($("#drawer-snap"), app.settings);

		app.validateDevice();
		
		document.addEventListener("backbutton", function(){}, false);
		
		app.acDictionary.read()

	}, false);


	app.isInetConnected = false;
	app.isDeviceValid   = false;
	
	app.newNoteText = "Note text";

	app.settings = new kendo.data.ObservableObject({
		deviceId: "noDeviceId"
		, hostName: "noHostName"
		, serviceHostURL: function () {
			return "http://" + this.get("hostName") + "/permitservice"
        }
		, devValidURL: function () {
			console.log("in valid url");
			console.log(this.serviceHostURL());
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
		, getInspxDictURL: function () {
			return this.get("serviceHostURL()") + "/GetInspectionDictionary"
		}
		, sendEmailURL: function () {
			return this.get("serviceHostURL()") + "/EmailInspectionReport"
		}
		, saveInspxImageURL: function (inspectionId) {
			return this.get(
			"serviceHostURL()") + "/SaveInspectionImage"
			+ "?DeviceId=" + this.get("deviceId")
			+ "&InspectionId=" + inspectionId
		}
		, getInspxCheckListXmlURL: function (inspectionId) {
			return this.get(
			"serviceHostURL()") + "/GetInspectionCheckListXml"
			+ "?DeviceId=" + this.get("deviceId")
			+ "&InspectionId=" + inspectionId
		}
		, changeInspxStatusURL: function() {
			return this.get(
			"serviceHostURL()") + "/ChangeInspectionStatus"
        }
		, useJson: false
		, dsDataType: function () {return "json" + (app.settings.useJson ? "" : "p")}
		, dsTimeOut: 5
		, isHostConnected: false
		, isInetConnected: false
		, isDeviceValid: false
		, headerDateRange: "all"
		, contains: ""
		, uploadProgress: 0
		, allowSnap: true

    });
	
	// Connection related stuff
	document.addEventListener("online", onOnline, false);
	
	function onOnline() {
    	app.isInetConnected = true;
	}

	document.addEventListener("offline", onOffline, false);
	
	function onOffline() {
    	app.settings.set("isHostConnected", false);
		app.headersDataSource.data([])
	}

	app.closeAssessModalView = function (e) {
		if (e.sender && e.sender.options.name === "ModalView") { // on show
			$('input[name="assessAs"]').attr('checked', false)
			$("#submit-assess").data("kendoMobileButton").enable(false)
			return
		}

		if (e.value !== undefined) { // on radio change
			$("#submit-assess").data("kendoMobileButton").enable(true)
			return
        }

		$("#modal-psfc").kendoMobileModalView("close");

		if (e.target.text() === "Cancel") return // on Cancel press

		$("#right-drawer").data("kendoMobileDrawer").hide()

		app.ajax4datasouce(
			{ success: function (){}
			, error: function (){}
			}
			, app.settings.changeInspxStatusURL()
			, {
				inspectionId: app.currentInspectionId, 
				newStatus: $('input[name="assessAs"]:checked').attr('value')
			}
		)
    };
	
	app.validateDevice = function (e) {
		$.ajax({
			url: app.settings.devValidURL()
			, success: function (serverResponse) {
				app.settings.set("isDeviceValid", serverResponse)
			}
			, error: function (x,s) {
				app.settings.set("isDeviceValid", undefined)
				app.showStatus("Could not authorize the device: " + s)
			}
			, timeout: app.settings.get("dsTimeOut")*1000
			, callbackParameter: 'callback'
    	});
	}

	app.acDictionary = new kendo.data.DataSource({
		transport: {
			read: function(option) {
				app.ajax4datasouce(
					option
					, app.settings.getInspxDictURL()
				)
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
		statusLineElement.innerHTML = message
		setTimeout(
			function() {
				statusLineElement.style.webkitTransition= "opacity 2s"
				statusLineElement.style.opacity = 0
			}
			, 10000
		);
    }
	
	app.ajax4datasouce = function (option, url, dataObject, that) {
		$.ajax({
			url: url
			, dataType: app.settings.dsDataType()
			, data: $.extend(
				{deviceid: app.settings.deviceId }
				, dataObject)
			, timeout: app.settings.get("dsTimeOut")*1000
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
				app.showStatus("Result: "+ result.statusText)
			}
		})
    }
	
	app.guid = function () {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
		function(c) {var r = Math.random()*16 | 0, v = c ==='x' ? r: r & 0x3 | 0x8;return v.toString(16);})
    }
	
	app.lsInitialise = function(item, value) {
		if (localStorage.getItem("NeaSmyrni."+item) !== null)
			app.settings.set(item, localStorage.getItem("NeaSmyrni."+item))
		else {
			app.settings.set(item, value)
		}
    }
	
	app.fileSystemError = function (e) {
		switch (e.code) {
    		case FileError.NOT_FOUND_ERR:               msg = 'NOT_FOUND_ERR';               break;//1
    		case FileError.SECURITY_ERR:                msg = 'SECURITY_ERR';                break;//2
    		case FileError.NOT_READABLE_ERR:            msg = 'NOT_READABLE_ERR';            break;//4
    		case FileError.ENCODING_ERR:                msg = 'ENCODING_ERR';                break;//5
    		case FileError.NO_MODIFICATION_ALLOWED_ERR: msg = 'NO_MODIFICATION_ALLOWED_ERR'; break;//6
    		case FileError.INVALID_STATE_ERR:           msg = 'INVALID_STATE_ERR';           break;//7
    		case FileError.INVALID_MODIFICATION_ERR:    msg = 'INVALID_MODIFICATION_ERR';    break;//9
    		case FileError.QUOTA_EXCEEDED_ERR:          msg = 'QUOTA_EXCEEDED_ERR';          break;//10
    		case FileError.TYPE_MISMATCH_ERR:           msg = 'TYPE_MISMATCH_ERR';           break;//11
    		case FileError.PATH_EXISTS_ERR:             msg = 'PATH_EXISTS_ERR';             break;//12
    		default:                                    msg = 'Unknown Error';               break;
		}
		return msg
	}
	
	app.onDictionaryRefresh = function (e) { //why is this function executed twice???
		if (e.button) {
			app.acDictionary.read()
		}
    }
})(window);
