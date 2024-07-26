import {WebSocketServer} from 'ws';

const fs = require("node:fs");
const wss = new WebSocketServer({port : 6969});
let incomingBlob: Array<Blob> = [];

async function writeBlobToAudioFile(blobArray: Array<Blob>) {
  const t: any = new Blob(blobArray, { type: "audio/ogg; codecs=opus" });
  console.log(t)
  console.log(new Uint16Array(t))
  fs.writeFileSync("test.wav", Buffer.from(new Uint8Array(await t.arrayBuffer())), (error : Error) => {
      console.log("Error: in converting the blob array to audio file", error);
  });

}

wss.on('connection', function connection(ws) {
    console.log("Someone connected")
    ws.on('error', console.error);

    ws.on('message', function message(data : Blob) {
      incomingBlob.push(data)
    });

    ws.on('close', async () => {
      if (incomingBlob.length == 0){
        return // Nothing to write to the file.
      }
      await writeBlobToAudioFile(incomingBlob);
    })
    ws.send('something');
});