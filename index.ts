const recordButton = document.getElementById("record-start")
const stopButton = document.getElementById("record-stop")
const chunks : Array<Blob> = [];

const LOCAL_IP = "..." // Get the local Ip with `ipconfig`, add the Ipv4
const wss = new WebSocket(`wss://${LOCAL_IP}:6969`)

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log("MESSAGE: getUserMedia supported.");
    navigator.mediaDevices
      .getUserMedia(
        // constraints - only audio needed for this tool
        {
          audio: true,
        },
      )  
      // Success callback
      .then((stream) => {
        let mediaRecorder = new MediaRecorder(stream);
        if (recordButton){
            recordButton.onclick = () => {
                console.log("OPERATION: started recording audio");
                mediaRecorder.start(100);
            }
            mediaRecorder.ondataavailable = (event) => {
                wss.send(event.data) // All the data would be handled on the server making it less heavy for long durations.
            }
        }
        if (stopButton){
            stopButton.onclick = () => {
                mediaRecorder.stop()
                console.log("OPERATION: stopping recording audio");
                try{
                  wss.send("close")
                }catch(error){
                  console.log("ERROR: sending close messsage",error)
                } 
                // Pause is not implemented yet, for now the default close would basically close and writes the data into a file.
            }
        }
    })
  
      // Error callback
      .catch((err) => {
        console.error(`ERROR: The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log("MESSAGE: getUserMedia not supported on your browser!");
  }
