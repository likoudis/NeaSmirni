app.historyDataSource = new kendo.data.DataSource ({
	transport: {
		read: function(option) {
				app.ajax4datasouce(
					option
					, app.settings.getHistoryURL()
					, {permitDocId: app.currentPermitId}
				)
		}
	}
	, schema: {
		model: {
			id: "InspectionId",
			fields: {
				InspectionId:      {type: "Number"}
				, InspectionDate:  {type: "Date"}
				, PropertyAddress: {type: "String"}
				, InspectionNo:    {type: "String"}
				, ThumbnailBase64: {type: "String"}
			}
		}

	//,  filter: { field: "PropertyAddress", operator: "contains", value: "Paul" }

	}
	,sort: { field: "InspectionDate", dir: "desc" }
})

	app.onHistoryShow = function (e) {
		var t = e.view.header.find(".km-navbar").data("kendoMobileNavBar")
		t.title("History - " + app.currentInspxAddress)

		app.historyDataSource.read()
    }
