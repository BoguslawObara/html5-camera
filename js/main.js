(function () {

    // The width and height of the canvas/video element
    var w = 320;
    var h = 160;
    var ws = 0.5;
    var hs = 0.3;
    var rw = Math.round(ws * w);
    var rh = Math.round(hs * h);
    var w1 = (w-rw)/2;
    var h1 = (h-rh)/2;
    var w2 = w - (w-rw)/2;
    var h2 = h - (h-rh)/2;

    var video = null;
    var canvas = null;
    var photo = null;
    var button = null;

    function startup() {

        // Elements
        video = document.getElementById('video');
        canvas = document.getElementById('canvas');
        photo = document.getElementById('photo');
        button = document.getElementById('button');

        // Camera settings
        var constraints = {
            audio: false,
            //video: true
            //video: { width: 1280, height: 720}
            video: { width: 1600, height: 1200}
        };

        // Connect to camera
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (mediaStream) {
                var video = document.querySelector('video');
                video.srcObject = mediaStream;

                // // Supported with some browsers only
                // const track = mediaStream.getVideoTracks();
                // const capabilities = track.getCapabilities()
                // // Check whether focus distance is supported or not.
                // if (!capabilities.focusDistance) {
                //     return;
                // }

                // // Map focus distance to a slider element
                // const input = document.querySelector('input[type="range"]');
                // input.min = capabilities.focusDistance.min;
                // input.max = capabilities.focusDistance.max;
                // input.step = capabilities.focusDistance.step;
                // input.value = track.getSettings().focusDistance;

                // input.oninput = function (event) {
                //     track.applyConstraints({
                //         advanced: [{ focusMode: "manual", focusDistance: event.target.value }]
                //     });
                // }
                // input.hidden = false;

                video.onloadedmetadata = function (e) {
                    video.play();
                };
            })
            .catch(function (err) {
                console.log(err.name + ": " + err.message);
            }); // Always check for errors at the end
        

        // Canvas size
        video.addEventListener('canplay', function () {
            // h = video.videoHeight / (video.videoWidth/w);
            // video.videoWidth = w;
            // video.videoHeight = h;
            canvas.width = w;
            canvas.height = h;
        }, false);

        // Capture video + rect
        video.addEventListener('play', function () {
            setInterval(function () {
                if (video.paused || video.ended) return;
                var context = canvas.getContext('2d');

                // Draw actual video frame
                context.drawImage(video, 0, 0, w, h);

                // Draw rectangle
                context.strokeRect(0, 0, w, h);
                context.fillStyle = 'rgba(0,0,0,0.3)';
                context.fillRect(0,0,w,h1);
                context.fillRect(0,h2,w,h);
                context.fillRect(0,h1,w1,rh);
                context.fillRect(w2,h1,w1,rh);
                context.stroke();
            }, 1000 / 60);
        });
        
        // Button click
        button.addEventListener('click', function (ev) {
            // takepicture();
            takepicture_full();
            ev.preventDefault();
        }, false);
    }

    // Take a picture - canvas size photo
    function takepicture() {
        var context = canvas.getContext('2d');
        if (w && h) {
            var canvas_tmp = document.createElement('canvas');
            canvas_tmp.width = rw;
            canvas_tmp.height = rh;
            photo.width = rw;
            photo.height = rh;

            var image = context.getImageData(w1, h1, rw, rw);
            var context_tmp = canvas_tmp.getContext('2d');
            context_tmp.putImageData(image, 0, 0);
            
            var data = canvas_tmp.toDataURL('image/png');
            photo.setAttribute('style','visibility:visible;'); photo.setAttribute('src', data);

        } else {
            clearphoto();
        }
    }
    
    // Take a picture - full camera size photo
    function takepicture_full() {
        var wf = video.videoWidth;
        var hf = video.videoHeight;
        var f = (h/hf) / (w/wf);
        var rwf = Math.round(ws * wf);
        var rhf = Math.round(hs * hf);
        var w1f = (wf-rwf)/2;
        var h1f = (hf-rhf)/2;
        var w2f = wf - (wf-rwf)/2;
        var h2f = hf - (hf-rhf)/2;

        if (wf && hf) {

            var canvas_full = document.createElement('canvas');
            canvas_full.width = wf;
            canvas_full.height = hf;
            var context_full = canvas_full.getContext('2d');
            context_full.drawImage(video, 0, 0, wf, hf);

            var canvas_tmp = document.createElement('canvas');
            canvas_tmp.width = rwf;
            canvas_tmp.height = rhf;
            var image = context_full.getImageData(w1f, h1f, rwf, rwf);
            var context_tmp = canvas_tmp.getContext('2d');
            context_tmp.putImageData(image, 0, 0);

            var data = canvas_tmp.toDataURL('image/png');
            
            photo.width = rwf;
            photo.height = rhf;
            photo.setAttribute('style','visibility:visible;'); photo.setAttribute('src', data);
        
        } else {
            clearphoto();
        }
    }

    // Clear photo and canvas
    function clearphoto() {
        var context = canvas.getContext('2d');
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        var data = canvas.toDataURL('image/png');
        photo.setAttribute('src', data);
    }

    // start on load
    window.addEventListener('load', startup, false);
})();