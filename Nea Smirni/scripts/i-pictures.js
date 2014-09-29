app.pixDataSource = new kendo.data.DataSource({
	transport: {
		read: function(option) {
			app.ajax4datasouce(
				option
				, app.settings.getInspxPicturesURL()
				, {inspectionId: app.currentInspectionId}
			)
		}
	},
	schema: {
		total: "ImageCount",
		data: "Images"
    }
})

app.pixShow = function (e) {
	var t = e.view.header.find(".km-navbar").data("kendoMobileNavBar")
	t.title("Pictures - " + app.currentInspxAddress)
	app.pixDataSource.read()
}

