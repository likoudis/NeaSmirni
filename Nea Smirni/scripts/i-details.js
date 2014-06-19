function initInspectionDataSources () {
		
	app.notesDataSource = new kendo.data.DataSource ({
		data: []
		,sort: { field: "CreateDate", dir: "desc" }
	})
	
	app.historyDataSource = new kendo.data.DataSource ({
		data: []
		,sort: { field: "InspectionDate", dir: "desc" }
	})

	app.updateNotesDataSource = function () {
		app.application.hideLoading()
		//app.notesDataSource.data(
		//	app.detailsViewModel.detailsDataSource.data()[0].InspectionNotes)
	}

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
			{desc: "Permit Number", ix: "PermitNo"},
			{desc: "Permit type", ix: "PermitType"},
			{desc: "Current use", ix: "CurrentUse"},
			{desc: "Intended use", ix: "IntendedUse"},
			{desc: "Conditional permit", ix: ""},
			{desc: "Permit notes", ix: function(){return app.detailsViewModel.detailsDataSource.data()[0].InspectionNotes.length || "No notes"}},
			{desc: "Permit inspections", ix: function(){return app.detailsViewModel.detailsDataSource.data()[0].HistoricalInspections.length || "None"}}
		]},  {
		header: "History"}
		]
			
		, currentInspectionId: function () {
			return app.currentInspectionId
        }

		, updateNotesDataSource: function () {
			app.notesDataSource.data(
				app.detailsViewModel.detailsDataSource.data()[0].InspectionNotes)
        }

		, detailsDataSource: new kendo.data.DataSource ({
			transport: {
				read: {
					url: function () { return app.settings.insbaseURL()} // "http://192.168.2.6:8000/permitservice/GetInspection" // 
					, dataType: "jsonp"
					, data: {
						deviceid: function () { return app.settings.deviceId}
						, inspectionId: function () { return app.currentInspectionId}
					//, timeout: 5000
					, beforeSend: function(e) {app.application.showLoading()}
					//, complete: function(e) {app.application.hideLoading()}
					, complete: function(e) {app.updateNotesDataSource()}
					}
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
		})
		, notesDataSource: new kendo.data.DataSource ({
			data: []
			, sort: { field: "CreateDate", dir: "desc" }
			})
	})

	app.onNotesShow = function (e) {
		//app.detailsViewModel.set("currentInspectionId",  e.view.params.inspectionId
		//	|| app.detailsViewModel.get("currentInspectionId")) // In case the drawer or back has been used
		//app.currentInspectionId = e.view.params.inspectionId || app.currentInspectionId
		//app.detailsViewModel.detailsDataSource.transport.options.read.url = app.settings.insbaseURL()
	
		//console.log(app.currentInspectionId)
		//app.detailsViewModel.detailsDataSource.read({
		//	deviceid: app.settings.deviceId
		//	, inspectionId: app.currentInspectionId
		//})
		//app.notesDataSource.data(
			//app.detailsViewModel.detailsDataSource.data()[0].InspectionNotes)
 	}
	
	app.onHistoryShow = function (e) {
		app.historyDataSource.fetch(function () {
			app.historyDataSource.data(app.detailsDataSource.data()[0].HistoricalInspections)
        })
    }
	
	app.onDetailsShow = function () {
		$("#i-detail-section").data("kendoMobileListView").refresh()
    }

}