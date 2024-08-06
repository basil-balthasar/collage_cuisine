const {app, BrowserWindow} = require("electron");
const url = require("url");
const path = require("path");

const {SerialPort} = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const parsers = SerialPort.parsers;
const parser = new ReadlineParser({ delimeter: "\r\n" });

function createMainWindow(){
    const mainWindow = new BrowserWindow({
        title: "Collage Cuisine",
        width: 1000,
        height: 600
    });

    const startUrl = url.format({
        pathname: path.join(__dirname, "../frontend/index.html"),
        protocol: "file"
    });

    mainWindow.loadURL(startUrl);
}

app.whenReady().then(createMainWindow);

// async function listSerialPorts() {
//   await SerialPort.list().then((ports, err) => {
//     if(err) {
//       throw new Error(err)
//       return
//     }
//     console.log('ports', ports);

//     if (ports.length === 0) {
//       throw new Error("No ports avaiable")
//     }
//   })
// }

// listSerialPorts()
let teensyPort;

async function getSerialPort(){
    await SerialPort.list().then((ports, err) => {
    if(err) {
      throw new Error(err)
    }
    console.log('ports', ports);

    if (ports.length === 0) {
      throw new Error("No ports avaiable")
    }

    ports.forEach(port => {
        if(port.path.includes("usbmodem")){
            teensyPort = port
        }
    });
    if(teensyPort == null){
        throw new Error("Teensy not connected")
    }
    openPort()
  })
}

getSerialPort()

    function openPort(){
        const port = new SerialPort({
        path: teensyPort.path,
        baudRate: 9600,
        dataBits: 8,
        parity: "none",
        stopBits: 1,
        flowControl: false,
    });

    port.pipe(parser);
    console.log("connected to teensy on port", teensyPort.path)
}

parser.on('data', function(data) {  
    console.log('Received data from port: ' + data);
});

parser.on('error', function(){
    throw new Error("Teensy not connected properly");
});

parser.on('close', function(){
    console.log("closed connection");
});