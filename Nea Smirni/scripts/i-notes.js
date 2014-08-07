app.notesDataSource = new kendo.data.DataSource ({
	batch: true,
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
		, create: {
			url: function () { return app.settings.addNoteURL()}
			, dataType: "jsonp"
			, data: {
				deviceid: function () { return app.settings.deviceId}
				, inspectionId: function () { return app.currentInspectionId}
				, note: function() {return app.newNoteText}
			}
			//, timeout: 5000
        }
	}
	, schema: {
		model: { 
			id: "CreateDate"
			, fields: {
				CreateDate: {type: "String"}
				, Note: {type: "String"}
            }
		}
	}
	, sort: { field: "CreateDate", dir: "desc" }
})

app.onNotesShow = function (e) {
	app.notesDataSource.read()
	app.detailsViewModel.detailsDataSource.read()
}

app.onAddNote = function(e) {
	var l
	
	//console.log($("#newNoteText").val())
	app.newNoteText = $("#newNoteText").val()
	//app.notesDataSource.add({Note: app.newNoteText, CreateDate: "No Date"})
	app.notesDataSource.add({})
	app.notesDataSource.at(l=app.notesDataSource.data().length-1).set("Note", app.newNoteText)
	app.notesDataSource.at(l).set("CreateDate", "No Date")
	app.notesDataSource.sync()
	app.notesDataSource.read()
}