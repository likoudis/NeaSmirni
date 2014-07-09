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
	, detailsDataSource: new kendo.data.DataSource ({
		transport: {
			read: {
				url: function () { return app.settings.insbaseURL()}
				, dataType: "jsonp"
				, data: {
					deviceid: function () { return app.settings.deviceId}
					, inspectionId: function () { return app.currentInspectionId}
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
})

app.onDetailsShow = function () {
	app.detailsViewModel.detailsDataSource.read()
	//$("#i-detail-section").data("kendoMobileListView").refresh()
	//console.log(app.detailsViewModel.detailsDataSource.data())
}
