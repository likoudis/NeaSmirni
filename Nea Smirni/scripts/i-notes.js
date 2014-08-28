(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {

		$("#newNoteText").kendoAutoComplete({
			dataSource: app.acDictionary
			, filter: "startswith"
			, placeholder: "Start writing..."
			, separator: " "
			, suggest: true
			, height: 300
		});
	})
})(window)

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
				CreateDate: {type: "Date"}
				, Note: {type: "String"}
            }
		}
	}
	, sort: { field: "CreateDate", dir: "desc" }
})

app.onNotesShow = function (e) {
	app.notesDataSource.read()
	app.detailsViewModel.detailsDataSource.read()
	document.getElementById("newNoteText").value = ""
}

app.onAddNote = function(e) {
	var l
	
	//console.log($("#newNoteText").val())
	app.newNoteText = $("#newNoteText").val()
	//app.notesDataSource.add({Note: app.newNoteText, CreateDate: "No Date"})
	app.notesDataSource.add({})
	app.notesDataSource.at(l=app.notesDataSource.data().length-1).set("Note", app.newNoteText)
	app.notesDataSource.at(l).set("CreateDate", new Date())
	app.notesDataSource.sync()
	//app.notesDataSource.read()
	document.getElementById("newNoteText").value = ""
}