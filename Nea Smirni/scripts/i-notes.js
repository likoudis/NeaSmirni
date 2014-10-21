(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {

		$("#newNoteText").kendoAutoComplete({
			dataSource: app.acDictionary
			, filter: "startswith"
			, placeholder: "Start writing..."
			, separator: " "
			, suggest: false
			, height: 300
		});
	})
})(window)

app.notesDataSource = new kendo.data.DataSource ({
	batch: true,
	transport: {
		read: function(option) {
			app.ajax4datasouce(
				option
				, app.settings.notesURL()
				, {inspectionId: app.currentInspectionId}
			)
		}
		, create: function(option) {
			app.ajax4datasouce(
				option
				, app.settings.addNoteURL()
				, {inspectionId: app.currentInspectionId
				,  createDate: ""
				,  note: app.newNoteText}
			)
		}
	}
	, schema: {
		model: { 
			id: "Id"
			, fields: {
				CreateDate: {type: "Date"}
				, Note: {type: "String"}
            }
		}
	}
	, sort: { field: "CreateDate", dir: "desc" }
})

app.onNotesShow = function (e) {
	var t = e.view.header.find(".km-navbar").data("kendoMobileNavBar")
	t.title("Notes - " + app.currentInspxAddress)
	app.notesDataSource.read()
	document.getElementById("newNoteText").value = ""
}

app.onAddNote = function(e) {
	var l = app.notesDataSource.data().length

	app.newNoteText = $("#newNoteText").val()
	app.notesDataSource.add({})
	app.notesDataSource.at(l).set("Note", app.newNoteText)
	app.notesDataSource.at(l).set("CreateDate", new Date())
	app.notesDataSource.sync()
	//app.notesDataSource.read()
	document.getElementById("newNoteText").value = ""
}