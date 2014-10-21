app.pixDataSource = new kendo.data.DataSource({
	transport: {
		read: function(option) {
			app.ajax4datasouce(
				option
				, app.settings.getInspxPicturesURL()
				, {inspectionId: app.currentInspectionId
				  , pageNo:option.data.page
				  , pageSize: option.data.pageSize}
			)
		}
	}
	//, serverPaging: true
	//, pageSize: 3
	, schema: {data: "Images", total: "ImageCount"}

})

app.pixShow = function (e) {
	var t = e.view.header.find(".km-navbar").data("kendoMobileNavBar")
	t.title("Pictures - " + app.currentInspxAddress)
	app.pixDataSource.read()
}

app.onPixScrollChange = function(e) {
	var fullFileName = e.data && e.data[0] !== undefined ? e.data[0].MobileFileName : ""
	if (app.itsTheSimulator()) {
		fullFileName = fullFileName.replace(/.*Persistent/, "filesystem://")
	}
	//alert("fullFileName:" + fullFileName)
	//alert("page" + e.page)
	window.resolveLocalFileSystemURL(
		fullFileName
		, function(entry){
			console.log(JSON.stringify(entry)) }
		, function () {
			window.requestFileSystem(
				LocalFileSystem.PERSISTENT
				, 0 // size
				, function(fileSys) { // on request success
					fileSys.root.getFile(
						fullFileName
						, {create: true, exclusive: true}
						, function(entry) { // on getFile success
							entry.createWriter( 
							function(writer) { // on writer success
								writer.write("data:image/jpg;base64," + e.data()[0].ImageBase64)
							}
							, function(writer){ // on writer error
								console.log("writer:" + JSON.stringify(writer))
							})
						}
						, function(error) { // on getFile error
							console.log("getFile:" + app.fileSystemError(error))
						})
				})
			}
	)
}