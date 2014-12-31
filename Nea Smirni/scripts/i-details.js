app.detailsDataSource = new kendo.data.DataSource ({
	transport: {
		read: function (option) {
			app.ajax4datasouce(
				option
				, app.settings.insbaseURL()
				, {inspectionId: app.currentInspectionId}
			)
		}
	},
	schema: {
		model: {
			id: "InspectionNo",
			fields: {
					 "AssignedInspector":   {type: "String"}
					,"ConstructionType":    {type: "String"}
					,"CurrentUse":          {type: "String"}
					,"InspectionDate":      {type: "Date"}
					,"InspectionId":        {type: "Number"}
					,"InspectionNo":        {type: "String"}
					,"InspectionStatus":    {type: "String"}
					,"InspectionType":      {type: "String"}
					,"IntendedUse":         {type: "String"}
					,"IsPermitConditional": {type: "Boolean"}
					,"LegalDescription":    {type: "String"}
					,"Owner":               {type: "String"}
					,"PermitDate":          {type: "Date"}
					,"PermitDescription":   {type: "String"}
					,"PermitDocId":         {type: "Number"}
					,"PermitNo":            {type: "String"}
					,"PermitType":          {type: "String"}
					,"PropertyAddress":     {type: "String"}
					,"RequestDate":         {type: "Date"}
					,"RollNo":              {type: "String"}
					,"RollNoDisplay":       {type: "String"}
			}
		}
	}
})

app.onDetailsShow = function (e) {
	var t = e.view.header.find(".km-navbar").data("kendoMobileNavBar")
	t.title("Details - " + app.currentInspxAddress)
	app.detailsDataSource.read()
	$("#i-detail-section").data("kendoMobileListView").refresh()
}
app.savePermitDocId = function () {
	app.currentPermitId = app.detailsDataSource.data()[0].PermitDocId
}