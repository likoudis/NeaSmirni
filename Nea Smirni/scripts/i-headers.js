app.headersDataSource = new kendo.data.DataSource ({
	transport: {
		read: function(option) {
				app.ajax4datasouce(
					option
					, app.settings.headersURL()
					, {daterange: app.settings.get("headerDateRange")}
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
});

app.setAndReadFor = function (InspectionId, PropertyAddress) {
	if (app.currentInspectionId !== InspectionId) {
		app.currentInspectionId = InspectionId || app.currentInspectionId
		app.currentInspxAddress = PropertyAddress || app.currentInspxAddress
	}
	return true
}
	
app.onInspectionShow = function(e) {
	var filterParam = e.view.params.filter || app.settings.get("headerDateRange");
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
		, autoBind: false
		, pullToRefresh: false
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
