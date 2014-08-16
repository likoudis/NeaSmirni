app.onSnapShow = function () {
	document.getElementById("snap-thumb").src = "noImageToShow"
	document.getElementById("snap-fname").innerHTML = ""
	document.getElementById("newImgNoteText").value = ""
}

app.onSnapClick = function () {
	// Take picture using device camera and retrieve image file
	navigator.camera.getPicture(
		onPhotoDataSuccess, 
		onFail, 
		{   quality: 50
			, destinationType: Camera.DestinationType.FILE_URI
			, targetWidth: 500
            , targetHeight: 500
			, correctOrientation: true
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
	var fname = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
		function(c) {var r = Math.random()*16|0, v=c==='x'?r:r&0x3|0x8;return v.toString(16);});
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
	//app.imageCount = app.imageCount < 999 ? app.imageCount + 1 : 0;
	document.getElementById("snap-thumb").src = entry.toInternalURL()
	t = entry.toInternalURL()
	document.getElementById("snap-fname").innerHTML = t.substr(t.lastIndexOf("/") +1)
	//$.ajax({
	//	url: app.settings.saveInspxImageURL(app.currentInspectionId, entry.toInternalURL())
	//	, type: "POST"
	//	, data: "shit"
	//	, success: function (data) { }
	//	, error: function (x,s,e) { }
	//});
}

function resOnError(error) {
	alert("getDirectory error:" + error.code);
}

function resOnError1(error) {
	alert("requestFileSystem error:" + error.code);
}

function resOnError2(error) {
	alert("resolveLocalFileSystemURL error:" + error.code);

	//function gotFiles(entries) {
    //   var s = "";
    //   for(var i=0,len=entries.length; i<len; i++) {
    //       //entry objects include: isFile, isDirectory, name, fullPath
    //       s+= entries[i].fullPath;
    //       if (entries[i].isFile) {
    //           s += " [F]";
    //       }
    //       else {
    //            s += " [D]";
    //        }
    //        s += "<br/>";
            
    //    }
    //    s+="<p/>";
    //    console.log(s);
    //}

	////get a directory reader from our FS
    //window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
	//    function(fileSys) {
	//	   var dirReader = fileSys.root.createReader()
    //       dirReader.readEntries(gotFiles,resOnError3)
    //    }
	//,resOnError3
	//)
    //function resOnError3(error) {
	//    console.log("requestFileSystem3 error:" + error.code);
    //}
}

function onFail(message) {
	alert('Failed because: ' + message);
}

app.onAddImgNote1 = function(e) {
	var l
	
	app.newNoteText = $("#newImgNoteText").val()
	//app.notesDataSource.add({Note: app.newNoteText, CreateDate: "No Date"})
	app.notesDataSource.add({})
	app.notesDataSource.at(l=app.notesDataSource.data().length-1).set("Note", app.newNoteText)
	app.notesDataSource.at(l).set("CreateDate", "No Date")
	app.notesDataSource.sync()
	app.notesDataSource.read()
}

// Picture up-downloads
app.onAddImgNote = function (e){
	//var imageURI = typeof(e) === "object" ? e.button.data().image : e;
	var imageURI = document.getElementById("snap-thumb").src
    var options = new FileUploadOptions();
    options.fileKey="file"
    options.fileName=imageURI
    options.mimeType="image/jpeg" 
    //options.headers = {
    //    Connection: "close"
    //}

    var params = {};
    //params.Inspectionid = app.currentInspectionId;
    params.ImageFileName = options.fileName;
	params.ImageNotes = $("#newImgNoteText").val()
    
    options.params = params;
    
    var ft = new FileTransfer();
	ft.onprogress = function(progressEvent) {
		if (progressEvent.lengthComputable) {
			t= progressEvent.loaded > 0.9 * progressEvent.total ? "" : "ing..." 
			t= document.getElementById("uploadProgress").innerHTML = t
			//loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
		} else {
			//loadingStatus.increment();
		}
	};

    ft.upload(imageURI, encodeURI(app.settings.saveInspxImageURL(app.currentInspectionId, options.fileName)), win, fail, options);
     
    function win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    }
    
    function fail(error) {
		switch (error.code) {
			case FileTransferError.FILE_NOT_FOUND_ERR:
				alert("Photo file not found");
				break;
			case FileTransferError.INVALID_URL_ERR:
				alert("Bad Photo URL");
				break;
			case FileTransferError.CONNECTION_ERR:
				alert("Connection error");
				break;
			
		}
	}
}