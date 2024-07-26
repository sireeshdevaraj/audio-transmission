const recordButton = document.getElementById("record-start")
const stopButton = document.getElementById("record-stop")
const chunks : Array<Blob> = [];


const wss = new WebSocket("ws://localhost:6969")

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    navigator.mediaDevices
      .getUserMedia(
        // constraints - only audio needed for this app
        {
          audio: true,
        },
      )
  
      // Success callback
      .then((stream) => {
        var mediaRecorder = new MediaRecorder(stream);
        if (recordButton){
            recordButton.onclick = () => {
                console.log("STARTED recording audio")
                mediaRecorder.start(100);        
            }
            mediaRecorder.ondataavailable = (event) => {
                wss.send(event.data)
                chunks.push(event.data)
            }
        }
        if (stopButton){
            stopButton.onclick = () => {
                mediaRecorder.stop()
            }
        }
        console.log(mediaRecorder)
    })
  
      // Error callback
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
