app.headersDataSource = new kendo.data.DataSource ({
	transport: {
		read: {
			url: function () {return app.settings.headersURL()}
			, dataType: "jsonp"
			, data: {
				deviceid: function () { return app.settings.deviceId}
			}
			, timeout: 5000
			, beforeSend: function(e) {app.application.showLoading()}
			, complete:   function(e) {app.application.hideLoading()
			}
        }
	},
	schema: {
		model: {
			id: "InspectionId",
			fields: {
				InspectionId:      {type: "Number"}
				, InspectionDate:  {type: "String"}
				, PropertyAddress: {type: "String"}
				, InspectionNo:    {type: "String"}
			}
		}
	}
});

app.onInspectionShow = function(e) {
	var filterParam = e.view.params.filter;
	
	$("#inspxListViewNavBar").data("kendoMobileNavBar").title( 
		filterParam === "all" ? "All Inspections" :
		filterParam === "today" ? "Today's Inspections" :
		filterParam === "weeks" ? "This week's Inspections" : "All Inspections"
	);

	//app.headersDataSource.read(); // no need if auto-bind
}

