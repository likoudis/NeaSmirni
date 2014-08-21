app.headersDataSource = new kendo.data.DataSource ({
	transport: {
		read: {
			url: function () {return app.settings.headersURL()}
			, dataType: "jsonp"
			, data: {
				deviceid: function () { return app.settings.deviceId}
				, daterange: function () { return app.settings.get("headerDateRange")}
			}
			, timeout: 5000
			, beforeSend: function(e) {app.application.showLoading()}
			, complete:   function(e) {app.application.hideLoading()
			}
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
});

app.onInspectionShow = function(e) {
	var filterParam = e.view.params.filter;
	//console.log(filterParam)
	$("#inspxListViewNavBar").data("kendoMobileNavBar").title( 
		filterParam === "today" ? "Today's Inspections" :
		filterParam === "yesterday" ? "Yesterday's Inspections" :
		filterParam === "thisWeek" ? "This week's Inspections" :
		filterParam === "lastWeek" ? "Last week's Inspections" : "All Inspections"
	);
	//console.log(filterParam)
	app.settings.set ("headerDateRange", filterParam)
	app.headersDataSource.read(); // no need if auto-bind
}

app.mobileListViewFiltering = function (e) {
	$("#filterList").kendoMobileListView({
		template: $("#inspx-template").text()
		, dataSource: app.headersDataSource
		//, filterable: true
		//, filterable: {
		//	field: "PropertyAddress"
		//	, operator:"contains"
		//	, placeholder: "Search addresses..."
		//	, ignoreCase: true
		//	, autoFilter: true
		//}
	})
}
