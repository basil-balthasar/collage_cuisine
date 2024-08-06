const {app, BrowserWindow} = require("electron");
const url = require("url");
const path = require("path");

const {SerialPort} = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const { error } = require("console");
const parsers = SerialPort.parsers;
const parser = new ReadlineParser({ delimeter: "\r\n" });

let teensyPort;

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

async function getSerialPort(){
    await SerialPort.list().then((ports, err) => {
    if(err) {
      console.error(err)
    }

    if (ports.length === 0) {
      console.error("No ports avaiable")
    }

    ports.forEach(port => {
        if(port.path.includes("usbmodem")){
            teensyPort = port
        }
    });
    if(teensyPort == null){
        console.error("Teensy not connected, will try again")
    }
    openPort()
  })
}

getSerialPort()

function openPort(){
    try{
        port = new SerialPort({
            path: teensyPort.path,
            baudRate: 9600,
            dataBits: 8,
            parity: "none",
            stopBits: 1,
            flowControl: false,
        });

        port.pipe(parser);
        console.log("connected to teensy on port", teensyPort.path)

        port.on('error', (err) => {
            console.error("unknown error")
        });
            port.on('close', (err) => {
            console.error("Teensy was dissconected, trying to reconnect");
            teensyPort = null
            setTimeout(() => {
                getSerialPort()
            }, 2000)
        });
    }catch(err){
        setTimeout(() => {
            getSerialPort()
        }, 2000)
    }

    
}

parser.on('data', function(data) {  
    console.log('Received data from port: ' + data);
});