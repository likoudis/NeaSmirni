app.notesDataSource = new kendo.data.DataSource ({
	transport: {
		read: {
			url: function () { return app.settings.notesURL()}
			, dataType: "jsonp"
			, data: {
				deviceid: function () { return app.settings.deviceId}
				, inspectionId: function () { return app.currentInspectionId}
			}
			, timeout: 5000
        }
	}
	,sort: { field: "CreateDate", dir: "desc" }
})

app.onNotesShow = function (e) {
	app.notesDataSource.read()
	app.detailsViewModel.detailsDataSource.read()
}