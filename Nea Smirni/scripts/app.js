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
		app.settings.set("hostName", "dctlt060:8000")
		app.settings.set("hostName", "qqw.directit.ca:8000")

		app.currentInspectionId = ""
		
		app.settings.isInetConnected = true
		app.headersDataSource.transport.options.read.url = app.settings.get("headersURL()")
		app.headersDataSource.read();
		app.isLoggedIn = true;
		
		kendo.bind($("#settingsListView"), app.settings);
		kendo.bind($("#loginDeviceId"), app.settings);
		kendo.bind($("#openHomePage"), app.settings);
		kendo.bind($("#no-host"), app.settings);
		
		app.settings.set("isHostConnected", false)

		app.headersDataSource.bind("error", function (e) {
			app.settings.set("isHostConnected", false)
		});
	
    }, false);


	app.isInetConnected = false;

	app.imageCount = 0;

	app.settings = new kendo.data.ObservableObject({
		deviceId: "noDeviceId"
		, hostName: "noHostName"
		, serviceHostURL: function () {
			return "http://" + this.get("hostName") + "/permitservice"
        }
		, headersURL: function () {
			return this.get("serviceHostURL()") + "/GetInspectionHeaders?deviceid=" + this.get("deviceId")
		}
		, insbaseURL: function () {
			return this.get("serviceHostURL()") + "/GetInspection?deviceid=" + this.get("deviceId")
		}
		, dsDataType: "jsonp"
		, isHostConnected: false

    });
	
	app.headersDataSource = new kendo.data.DataSource ({
		transport: {
			read: {
				//url: "http://192.168.2.5:8000/permitservice/GetInspectionHeaders?deviceid=b32f2b6527524b5c"
				url: ""
				, dataType: "jsonp"
				, timeout: 5000
				, complete: function(e) {app.settings.set("isHostConnected", !!app.headersDataSource.data().length); app.application.hideLoading()}
				, beforeSend: function(e) {app.application.showLoading()}
            }
		},
		schema: {
			model: {
				id: "InspectionId",
				fields: {
					InspectionId:    {type: "Number"},
					InspectionDate:  {type: "String"},
					PropertyAddress: {type: "String"},
					InspectionNo:    {type: "String"}
				}
			}
		}
    });

	app.notesDataSource = new kendo.data.DataSource ({
		data: []
		,sort: { field: "CreateDate", dir: "desc" }
	})
	
	app.detailsDataSource = new kendo.data.DataSource ({
		transport: {
			read: {
				url: "",
				dataType: "jsonp"
			}
		},
		schema: {
			model: {
				id: "InspectionNo",
				fields: {
						 "AssignedInspector": {type: "String"}
						,"ConstructionType":  {type: "String"}
						,"CurrentUse":        {type: "String"}
						,"InspectionDate":    {type: "String"}
						,"InspectionId":      {type: "Number"}
						,"InspectionNo":      {type: "String"}
						,"InspectionStatus":  {type: "String"}
						,"InspectionType":    {type: "String"}
						,"IntendedUse":       {type: "String"}
						,"LegalDescription":  {type: "String"}
						,"Owner":             {type: "String"}
						,"PermitDate":        {type: "String"}
						,"PermitDescription": {type: "String"}
						,"PermitDocId":       {type: "Number"}
						,"PermitNo":          {type: "String"}
						,"PermitType":        {type: "String"}
						,"PropertyAddress":   {type: "String"}
						,"RequestDate":       {type: "String"}
						,"RollNo":            {type: "String"}
						,"RollNoDisplay":     {type: "String"}
				}
			}
		}
    });

	app.detailsViewModel = new kendo.observable({
		detailsGroupedList: [ {
		header: "Inspection Information",
		fields: [
			{desc: "Inspected", ix: "InspectionDate"},
			{desc: "Assigned To", ix: "AssignedInspector"},
			{desc: "Status", ix: "InspectionStatus"},
			{desc: "Type", ix: "InspectionType"},
			{desc: "Requested", ix: "RequestDate"},
			{desc: "Number", ix: "InspectionNo"}
		]}, {
		header: "Property Information",
		fields: [
			{desc: "Address", ix: "PropertyAddress"},
			{desc: "Owner", ix: "Owner"},
			{desc: "Legal Description", ix: "LegalDescription"},
			{desc: "Rol #", ix: "RollNoDisplay"}
		]},  {
		header: "Permit Information",
		fields: [
			{desc: "Description", ix: "PermitDescription"},
			{desc: "Doc. Date", ix: "PermitDate"},
			{desc: "Construction type", ix: "ConstructionType"},
			{desc: "Permit type", ix: "PermitType"},
			{desc: "Current use", ix: "CurrentUse"},
			{desc: "Intended use", ix: "IntendedUse"},
			{desc: "Conditional permit", ix: ""},
			{desc: "Permit notes", ix: function(){return app.detailsDataSource.data()[0].InspectionNotes.length || "No notes"}},
			{desc: "Permit inspections", ix: function(){return app.detailsDataSource.data()[0].HistoricalInspections.length || "None"}}
		]}]
	})
	
	app.closeLoginModalView = function (e) {
        $("#loginModalView").kendoMobileModalView("close");
		if (e.sender.element.text().trim() !== "Cancel") {
			app.isLoggedIn = !app.isLoggedIn;
			//$("#openHomePage").data("kendoMobileButton").enable(app.isLoggedIn);
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

	app.getHostName = function () {
		app.headersDataSource.transport.options.read.url = app.settings.get("headersURL()")
		app.headersDataSource.read();
    }

	app.onNotesShow = function (e) {
		app.currentInspectionId = e.view.params.inspectionId || app.currentInspectionId // In case the drawer is used
		app.detailsDataSource.transport.options.read.url = app.settings.insbaseURL() + "&inspectionid=" + app.currentInspectionId
		app.detailsDataSource.fetch(function () {
			app.notesDataSource.data(app.detailsDataSource.data()[0].InspectionNotes)
        })
    }
	
	app.onDetailsShow = function () {
		$("#i-detail-section").data("kendoMobileListView").refresh()
    }

	app.getHostName1 = function () {
		var ds = new kendo.data.DataSource({
			transport:{
				read: {
					url:"http://192.168.2.5:8000/permitservice/GetInspectionHeaders?deviceid=b32f2b6527524b5c"
					//, dataType: "jsonp"
                }
            }
        })
		function dataSource_error(e) {
			console.log(e.status); // displays "error"
		}
		dataSource_error({status: "status"});
		ds.bind("error", dataSource_error);
		ds.fetch();		
    }
	

})(window);