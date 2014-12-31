(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {

		$("#newImgNoteText").kendoAutoComplete({
			dataSource: app.acDictionary
			, filter: "startswith"
			, placeholder: "Start writing..."
			, separator: " "
			, suggest: false
			, height: 300
		});
	})
})(window)

app.onSnapShow = function (e) {
	var t = e.view.header.find(".km-navbar").data("kendoMobileNavBar")
	t.title("Snap - " + app.currentInspxAddress)
	document.getElementById("snap-thumb").src = "noImageToShow"
	document.getElementById("newImgNoteText").value = ""
}

app.onSnapClick = function () {
	// Take picture using device camera and retrieve image file

	navigator.camera.getPicture(
		onPhotoDataSuccess
		, onFail
		, { quality: 50
			, destinationType: Camera.DestinationType.FILE_URI
			//, targetWidth: 200
            //, targetHeight: 200
			//, correctOrientation: true
		}
	)
}

function onPhotoDataSuccess(imageURI) { 
	if (app.itsTheSimulator()) {
		window.resolveLocalFileSystemURL("file:///" + imageURI.substr(imageURI.lastIndexOf("/") +1 )
	    , resolveOnSuccess, resOnError2)
    } else {
		window.resolveLocalFileSystemURL(imageURI, resolveOnSuccess, resOnError2);
	}
}

//Callback function when the file system uri has been resolved
function resolveOnSuccess(entry) { 
	//new file name
	var fname = app.guid();
	fname = "Id_" + app.currentInspectionId + "_" + fname + ".jpg";
	var NSAppFolder = "MyInspections";

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
	//The folder is created if doesn't exist
		fileSys.root.getDirectory( NSAppFolder,
			{create:true, exclusive: false},
			function(directory) {
				if (app.itsTheSimulator()) {
					entry.copyTo(directory, fname,  successMove, resOnError)
				} else {
					entry.moveTo(directory, fname,  successMove, resOnError)
				}
			},
			resOnError
		);
	},
	resOnError1)		
}

//Callback function when the file has been moved successfully - inserting the complete path
function successMove(entry) {
	document.getElementById("snap-thumb").src = entry.toInternalURL();
	t = entry.toInternalURL();
}

function resOnError(error) {
	app.showStatus("getDirectory error:" + error.code);
}

function resOnError1(error) {
	app.showStatus("requestFileSystem error:" + error.code);
}

function resOnError2(error) {
	app.showStatus("resolveLocalFileSystemURL error:" + error.code);
}

function onFail(message) {
	app.showStatus('Failed because: ' + message);
}

// Picture upload
app.onAddImgNote = function (e){
	var imageURI = document.getElementById("snap-thumb").src
    var options = new FileUploadOptions();
    options.fileKey="file"
	
	if ("noImageToShow" === imageURI.substr(-13)) {
		app.showStatus("No picture to upload")
		return
    }
	options.fileName=imageURI
    options.mimeType="image/jpeg" 
	
    var params = {};
    params.ImageFileName = options.fileName
	params.ImageNotes = $("#newImgNoteText").val().replace(/\n/g,"\\r\\n")
    
    options.params = params
    var ft = new FileTransfer()
	
	var saveImageUrl = app.settings.saveInspxImageURL(app.currentInspectionId);
	//alert(document.getElementById("uploadButton"));
	//alert(document.getElementById("uploadButton").outerHTML); 
	//document.getElementById("uploadButton").innerHTML = "Uploading" 
	
	
    ft.upload(imageURI
		, encodeURI(saveImageUrl)
		, win
		, fail
		, options);
     
    function win() {
        app.showStatus("Picture uploaded")
		app.settings.set("allowSnap", false)
    }
    
    function fail(error) {
		switch (error.code) {
			case FileTransferError.FILE_NOT_FOUND_ERR:
				app.showStatus("Photo file not found. Http Status:" + error.http_status);
				break;
			case FileTransferError.INVALID_URL_ERR:
				app.showStatus("Bad Photo URL. Http Status:" + error.http_status);
				break;
			case FileTransferError.CONNECTION_ERR:
				app.showStatus("Connection error. Http Status:" + error.http_status);
				break;
			default:
				alert("Failed. Http Status:" + error.http_status);		
				break;	
		}
	}
	
}

app.onSnapAgain = function () {

	document.getElementById("snap-thumb").src = "noImageToShow"
	document.getElementById("newImgNoteText").value = ""
	app.settings.set("allowSnap", true)

}
