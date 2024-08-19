const {app, BrowserWindow, ipcMain, webContents, ipcRenderer, dialog} = require("electron");
const url = require("url");
const path = require("path");
const fs = require("fs");

const {autoUpdater, AppUpdater} = require("electron-updater");

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

const {SerialPort} = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const { error, info } = require("console");
const parsers = SerialPort.parsers;
const parser = new ReadlineParser({ delimeter: "\r\n" });

let teensyPort;
let mainWindow;

function createMainWindow(){
    const mainWindow = new BrowserWindow({
        title: "Collage Cuisine",
        width: 1000,
        height: 600,
        fullscreen: false,
        webPreferences:{
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, "../frontend/preload.js")
        }
    });

    const startUrl = url.format({
        pathname: path.join(__dirname, "../frontend/index.html"),
        protocol: "file"
    });

    mainWindow.loadURL(startUrl);

    return mainWindow;
}

app.whenReady().then(()=>{
    mainWindow = createMainWindow();
    autoUpdater.checkForUpdates();
    mainWindow.webContents.send("updateStatus", "checking for update")
});

autoUpdater.on("update-available", (info) => {
    mainWindow.webContents.send("updateStatus", "Update avaiable")
    autoUpdater.downloadUpdate();
})

autoUpdater.on("update-downloaded", (info)=>{
    mainWindow.webContents.send("updateStatus", "update downloaded")
})

autoUpdater.on("error", (info)=>{
    mainWindow.webContents.send("updateStatus", info)
})


// app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
//   })
// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

getSerialPort()

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
        //dialog.showErrorBox("Teensy not connected", "check USB connection to teensy and press ok to try again")
    }
    openPort()
  })
}

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
    data = data.split(",")
    mainWindow.webContents.send("data", data)
});

ipcMain.handle("saveImage",()=>{
    console.log("saved image")
})

function saveImage(){
    mainWindow.webContents.capturePage().then((img)=>{
        fs.writeFile("./image.png", img.toPNG(), "base64", function(err){
            if(err) throw err;
            console.log("saved")
        })
    })
}