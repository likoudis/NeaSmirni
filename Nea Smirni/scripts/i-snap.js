app.onSnapShow = function (e) {
	// Take picture using device camera and retrieve image file
	navigator.camera.getPicture(
		onPhotoDataSuccess, 
		onFail, 
		{   quality: 50, 
			destinationType: Camera.DestinationType.FILE_URI
		}
	)
}

function onPhotoDataSuccess(imageURI) { 
	if (app.itsTheSimulator()) {
	//alert(imageURI.replace(/C:/, "C|"))
	    window.resolveLocalFileSystemURL("file:///" + imageURI.substr(imageURI.lastIndexOf("/") +1 )
	    , resolveOnSuccess, resOnError2)
    } else {
       window.resolveLocalFileSystemURL(imageURI, resolveOnSuccess, resOnError2); 
	}
}

function onFail(message) {
	alert('Failed because: ' + message);
}

//Callback function when the file system uri has been resolved
function resolveOnSuccess(entry){ 
	//new file name
	var fname = app.imageCount;
	fname = fname < 100 ? fname < 10 ? "00"+ fname : "0" + fname : fname ;
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
	document.getElementById("snap-fname").innerHTML = entry.toInternalURL()
	document.getElementById("snap-thumb").src = entry.toInternalURL()
	//$.ajax({
	//	url: app.settings.saveInspxImageURL(app.currentInspectionId, entry.toInternalURL())
	//	, type: "POST"
	//	, data: "shit"
	//	, success: function (data) { }
	//	, error: function (x,s,e) { }
	//});
}

function resOnError(error) {
	console.log("getDirectory error:" + error.code);
}

function resOnError1(error) {
	console.log("requestFileSystem error:" + error.code);
}

function resOnError2(error) {
	console.log("resolveLocalFileSystemURL error:" + error.code);

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

app.onAddImgNote1 = function(e) {
	var l
	
	//console.log($("#newNoteText").val())
	app.newNoteText = $("#newImgNoteText").val()
	//app.notesDataSource.add({Note: app.newNoteText, CreateDate: "No Date"})
	app.notesDataSource.add({})
	app.notesDataSource.at(l=app.notesDataSource.data().length-1).set("Note", app.newNoteText)
	app.notesDataSource.at(l).set("CreateDate", "No Date")
	app.notesDataSource.sync()
	app.notesDataSource.read()
	//app.pixUpload ("file://C|/Users/Pavlos/Documents/Telerik/Icenium/Simulator/Storage/Persistent/MyInspections/" +fname)}
}

// Picture up-downloads
app.onAddImgNote = function (e){
	//var imageURI = typeof(e) === "object" ? e.button.data().image : e;
	var imageURI = document.getElementById("snap-thumb").src
    var options = new FileUploadOptions();
    options.fileKey="file"
    options.fileName=imageURI
    options.mimeType="image/jpeg"
	options.chunkedMode = false
    options.headers = {
        Connection: "close"
    }

    var params = {};
    params.Inspectionid = app.currentInspectionId;
    params.ImageFileName = options.fileName;
	params.ImageNotes = $("#newImgNoteText").val()
    
    options.params = params;
    
    var ft = new FileTransfer();
	//ft.onprogress = function(progressEvent) {
	//    if (progressEvent.lengthComputable) {
	//      loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
	//    } else {
	//      loadingStatus.increment();
	//    }
	//};

	
 //   alert(encodeURI(app.settings.saveInspxImageURL(app.currentInspectionId, options.fileName)))
 //$("#snap-button").data("kendoMobileButton").enable(false)
   ft.upload(imageURI, encodeURI(app.settings.saveInspxImageURL(app.currentInspectionId, options.fileName)), win, fail, options, true);
    //ft.upload(imageURI, encodeURI("http://some.server.com/upload.php"), win, fail, options);
    //ft.upload(imageURI, encodeURI("http://192.168.2.50:8000/permitservice/SaveInspectionImage"), win, fail, options);
     
    function win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
//$("#snap-button").data("kendoMobileButton").enable(true)
    }
    
    function fail(error) {
//$("#snap-button").data("kendoMobileButton").enable(true)
        alert("An error has occurred:"
        + "\nupload http status:  " + error.http_status
        + "\nupload error code    " + error.code
        + "\nupload response body " + error.body
        + "\nupload error source  " + error.source
        + "\nupload error target  " + error.target);
        console.log("upload http status: " + error.http_status);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }
}
