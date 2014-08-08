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
		    window.resolveLocalFileSystemURI("file:///" + imageURI.substr(imageURI.lastIndexOf("/") +1 )
		    , resolveOnSuccess, resOnError2)
        } else {
           window.resolveLocalFileSystemURI(imageURI, resolveOnSuccess, resOnError2); 
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
		//app.pixUpload ("file://C|/Users/Pavlos/Documents/Telerik/Icenium/Simulator/Storage/Persistent/MyInspections/" +fname)
	}

	//Callback function when the file has been moved successfully - inserting the complete path
	function successMove(entry) {
		app.imageCount = app.imageCount < 999 ? app.imageCount + 1 : 0;
		document.getElementById("snap-fname").innerHTML= entry.name;
		document.getElementById("snap-thumb").src= entry.fullPath;
		$.ajax({
			url: app.settings.saveInspxImageURL(app.currentInspectionId, entry.fullPath)
			, type: "POST"
			, data: "shit"
			, success: function (data) { }
			, error: function (x,s,e) { }
    	});
	}

	function resOnError(error) {
		console.log("getDirectory error:" + error.code);
	}

	function resOnError1(error) {
		console.log("requestFileSystem error:" + error.code);
	}

	function resOnError2(error) {
		console.log("resolveLocalFileSystemURI error:" + error.code);

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

	// Picture up-downloads
    app.pixUpload = function (e){
		var imageURI = typeof(e) === "object" ? e.button.data().image : e;
        var options = new FileUploadOptions();
        options.fileKey="file";
        options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        options.mimeType="image/jpeg";
        
        var params = {};
        params.Inspectionid = app.currentInspectionId;
        params.ImageFileName = options.fileName;
        
        options.params = params;
        
        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI(app.settings.saveInspxImageURL(app.currentInspectionId, options.fileName)), win, fail, options);
      //ft.upload(imageURI, encodeURI("http://some.server.com/upload.php"), win, fail, options);
        
        function win(r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
        }
        
        function fail(error) {
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        }
    }
