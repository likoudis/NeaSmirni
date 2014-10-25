(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {

		$("#reportEmailTo").kendoAutoComplete({
			dataSource: app.acEmailAddress
			, filter: "contains"
			, placeholder: "Add receipient..."
			, separator: "; "
			, suggest: false
			, height: 300
		});
	})
})(window)

app.acEmailAddress = ["crap"]
	
app.onEmailShow = function (e) {
	var t = e.view.header.find(".km-navbar").data("kendoMobileNavBar")
	t.title("Email - " + app.currentInspxAddress)
	
	app.acEmailAddress.length || app.onContactKeyPress1(false)
}

app.onContactKeyPress1 = function (calledByTheButton) {
    //var txt = window.event.keyCode;
	var txt = calledByTheButton ? document.getElementById("reportEmailTo") : {value:"paul"}
	
	sTxt= txt.value.replace(/[^ ]+\; /g, "ddddd")
	
	alert(">" + sTxt + "<")

	// find all contacts with 'Bob' in any name field
	var fields = [
		  navigator.contacts.fieldType.displayName
		, navigator.contacts.fieldType.name];

	var options      = new ContactFindOptions();
	options.filter   = sTxt;
	options.multiple = true;
	//options.desiredFields = fields.concat([navigator.contacts.fieldType.emails]);

	navigator.contacts.find(fields,
		function(contact){
    		alert('So many contacts have been selected: ' + contact.length)
			//alert(JSON.stringify(contact[0]))
    		//alert('The following contacts have been selected: ' + 
			//	JSON.stringify(contact).replace(/}/g, "}\n").replace(/,\"/g, "\n ,\""));
			//txt.value = (txt.value ? txt.value + "; " : "")
				//+ contact[0].displayName
				//+ contact.map(function(e){return e.displayName;}).join("; ")
				//+ contact.map(function(e){return e.emails[0].value;}).join("; ")
				//+ contact.map(function(e){return JSON.stringify(e)}).join("; ")
				//+ contact.map(function(e){return e.emails.length?e.emails[0].value : ""}).join("; ")

				//+ contact.map(function(e){return e.emails !== null
				//	? e.emails.map(function(e){return e.value}).join("; ")
				//	: ""
				//	}).join("; ")
			//txt.value = txt.value.replace(new RegExp(sTxt) + "; ", "")

			app.acEmailAddress = [].concat.apply([], contact.map(
				function(e){return e.emails!== null ?e.emails.map(function(e){return e.value}):""}))
			alert(JSON.stringify(app.acEmailAddress).replace(/}/g, "}\n").replace(/,\"/g, "\n ,\""))
			alert(app.acEmailAddress.length)

			$("#reportEmailTo").data("kendoAutoComplete").setDataSource(app.acEmailAddress)
		},function(err){
		    alert(txt.value + 'Error: ' + err);
		}
	, options);
	//alert(key)
}

app.onContactKeyPress = function () {
	var txt = document.getElementById("reportEmailTo")
	navigator.contacts.pickContact(
			function(contact){
    			if (!contact.emails.length) {
					app.showStatus("There is no e-mail addess for this person")
					//alert('Following contact has been selected: ' + 
					//	JSON.stringify(contact).replace(/}/g, "}\n").replace(/,\"/g, "\n ,\""));
				} else {
					txt.value = (txt.value ? txt.value + "; " : "") + contact.emails[0].value
				}
			},function(err){
			    alert('Error: ' + err);
			});
	//alert(key)
}

app.onEmailSubmit = function () {

	app.ajax4datasouce(
		{ success: function (){}
		, error: function (){}
		}
		, app.settings.sendEmailURL()
		, {inspectionId: app.currentInspectionId
		  , emailto: document.getElementById("reportEmailTo").value}
	)
}
