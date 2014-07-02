app.historyDataSource = new kendo.data.DataSource ({
	data: []
	,sort: { field: "InspectionDate", dir: "desc" }
})

	app.onHistoryShow = function (e) {
		app.historyDataSource.fetch(function () {
			app.historyDataSource.data(app.detailsViewModel.detailsDataSource.data()[0].HistoricalInspections)
        })
    }
