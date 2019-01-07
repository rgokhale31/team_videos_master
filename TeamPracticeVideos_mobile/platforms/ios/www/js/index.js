var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById('cameraBtn').addEventListener('click', app.clickHandler);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        console.log('Received Event: ' + id);
    },

    win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
    },

    fail(error) {
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    },

    saveUpload(title, path) {
        console.log("title");
        $.ajax({
            type: "POST",
            url: "http://169.254.130.177:3000/api/videos/save_upload",
            data: {"title": title, "path": path},
            success: app.win,
        });
    },

    captureSuccess: function(mediaFiles) {
        var i, path, len;
        var ft = new FileTransfer();
        //alert('you just successfully recorded a video!');
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;

            var options = {
                fileKey: "file",
                fileName: path,
                chunkedMode: false,
                mimeType: "video/mp4"
            };
            
            // do something interesting with the file
            ft.upload(path, encodeURI("http://169.254.130.177:3000/api/videos/upload"), app.win, app.fail, options)
            //backgroundtask.start(ft.upload(path, encodeURI("http://169.254.113.125:3000/api/videos/upload"), app.win, app.fail, options));

            var video_title = prompt("Please enter a title for this video:", "");
            if ( !video_title ) {
                video_title = "Untitled Video";
                app.saveUpload(video_title, path);
            } else {
                app.saveUpload(video_title, path);
            }
        }
    },

    captureError: function(error) {
        console.log('Error code: ' + error.code, null, 'Capture Error');
    },

    clickHandler: function(element) {
        navigator.device.capture.captureVideo(app.captureSuccess, app.captureError, {limit:1});
    }
};

app.initialize();