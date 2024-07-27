import { WebSocketServer } from 'ws';
import { createServer } from 'https';
import { readFileSync } from 'fs';
const fs = require("node:fs");

const certificate_path_crt = "..."// "C:\\Users\\Nerd_directory\\selfsigned.crt"
const certificate_key_path_pem = "..."// "C:\\Users\\Nerd_directory\\selfsigned.key"

const server = createServer({
  cert: readFileSync(certificate_path_crt),
  key: readFileSync(certificate_key_path_pem)
});
const wss = new WebSocketServer({server});
let incomingBlob: Array<Buffer> = [];

async function writeBlobToAudioFile(blobArray: Array<Buffer>) {
  if (blobArray.length == 0){
    console.log("MESSAGE: Data is of 0 length, nothing written.")
    return // Nothing to write to the file.
  }
  const t: Blob = new Blob(blobArray, { type: "audio/ogg; codecs=opus" });
  const date = new Date()
  const filename =   date.toDateString() + " " + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds()
  fs.writeFile(`./voice/${filename}.wav`, 
              Buffer.from(new Uint8Array(await t.arrayBuffer())), 
              {flag : "w+"},
              (error : Error) => {
                if (error) console.log("Error: in converting the blob array to audio file", error);
                else console.log("OPERATION: wrote to the file", filename);
              }
  );
}


wss.on('connection', function connection(ws) {
    console.log("MESSAGE: someone connected")
    
    ws.on('error', (err : Error) => console.log(err));
    
    ws.on('message', async function message(data : Buffer) {
      if (data.toString() === "close"){
        console.log("MESSAGE: writing data to file")
        await writeBlobToAudioFile(incomingBlob);
        incomingBlob = [];
      }      
      else{
        incomingBlob.push(data)
      }
    });

    ws.on('close', async () => {
      await writeBlobToAudioFile(incomingBlob);
      incomingBlob = []; // clean the array for new requests.
      console.log("CLOSED: connection")
    })
});

server.listen(6969, () => {
  console.log('WebSocket server running on wss://127.0.0.1:6969');
});