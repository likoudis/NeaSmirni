(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {

		$("#newReportTextTop").kendoAutoComplete({
			dataSource: app.acDictionary
			, filter: "startswith"
			, placeholder: "Start writing..."
			, separator: " "
			, suggest: true
			, height: 300
		});
		$("#newReportTextMid").kendoAutoComplete({
			dataSource: app.acDictionary
			, filter: "startswith"
			, placeholder: "Start writing..."
			, separator: " "
			, suggest: true
			, height: 300
		});
		$("#newReportTextBot").kendoAutoComplete({
			dataSource: app.acDictionary
			, filter: "startswith"
			, placeholder: "Start writing..."
			, separator: " "
			, suggest: true
			, height: 300
		});
	})
})(window)


app.onReportShow = function (e) {
	var t = e.view.header.find(".km-navbar").data("kendoMobileNavBar")
	t.title("Report - " + app.currentInspxAddress)
	//app.notesDataSource.read()
	//document.getElementById("newNoteText").value = ""
}

app.onAddSection = function(e) {
	var l = $("#newReportTextMid").val()
	//app.notesDataSource.read()
	document.getElementById("newNoteText").value = ""
}

//app.onReportShow = function (e) {
//	var t = e.view.header.find(".km-navbar").data("kendoMobileNavBar")
//	t.title("Report - " + app.currentInspxAddress)

//	var xml = new XMLHttpRequest();
//	//xml.timeout = 10000
//	xml.open("GET", app.settings.getInspxCheckListXmlURL(app.currentInspectionId) ,false);
//	//xml.open("GET", "data/MyInspections/temp/inspection00000.xml" ,false);
//	xml.send("");
//	var xsl = new XMLHttpRequest();
//	//xsl.timeout = 10000
//	xsl.open("GET", "data/MyInspections/Reports/CheckList.xsl",false);
//	xsl.send("");
//	xsltProcessor = new XSLTProcessor();
//	xsltProcessor.importStylesheet(xsl.responseXML);
//	resultDocument = xsltProcessor.transformToFragment(xml.responseXML, document);
//	if (document.querySelector("#xlistXMLTable1")) {
//		document.getElementById("scroller-report").removeChild(
//			document.getElementById("xlistXMLTable1"))
//		document.getElementById("scroller-report").removeChild(
//			document.getElementById("xlistXMLH2"))
//		document.getElementById("scroller-report").removeChild(
//			document.getElementById("xlistXMLTable3"))
//    }
//	document.getElementById("scroller-report").appendChild(resultDocument)
//}
