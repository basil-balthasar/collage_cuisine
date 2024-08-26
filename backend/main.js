const {app, BrowserWindow, ipcMain, webContents, ipcRenderer, dialog} = require("electron");
const {autoUpdater, AppUpdater} = require("electron-updater");

const url = require("url");
const path = require("path");
const fs = require("fs");

require('dotenv').config();
const supabase = require("./config/supabaseClient.js");

const {SerialPort} = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const { error, info, Console } = require("console");
const { sign } = require("crypto");
const { title } = require("process");
const parsers = SerialPort.parsers;
const parser = new ReadlineParser({ delimeter: "\r\n" });

let serialAbortController = new AbortController()
const updateAbortController = new AbortController()
const teensyNotConnected = {
    signal: serialAbortController.signal,
    type: "warning",
    title: "FEHLER-006",
    message: "FEHLER-006: Module nicht mit Computer verbunden.",
    detail: "Bitte informieren Sie eine Museumsaufsicht."
}

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

let teensyCheckInterval = 2000
let showSerialError = false

let waitForSafe = false

let mainWindow;
let diaWindow;

function createWindow(title, width, height, fullscreen, index, preload){
    const newWindow = new BrowserWindow({
        title: title,
        width: width,
        height: height,
        fullscreen: fullscreen,
        webPreferences:{
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, preload)
        }
    });

    const startUrl = url.format({
        pathname: path.join(__dirname, index),
        protocol: "file"
    });

    newWindow.loadURL(startUrl);

    return newWindow;
}

app.whenReady().then(()=>{
    mainWindow = createWindow("Collage Cuisine", 1000, 600, false, "../frontend/collage/index.html", "../frontend/preload.js");
    diaWindow = createWindow("Diashow", 300, 500, false, "../frontend/diashow/dia.html", "../frontend/preload.js");
    autoUpdater.checkForUpdates();
    mainWindow.webContents.send("updateStatus", "checking for update")
    getSerialPort()
});

autoUpdater.on("update-available", (info) => {
    mainWindow.webContents.send("updateStatus", "update avaiable")
    if(process.platform == "win32"){
        autoUpdater.downloadUpdate();
    }else{
        dialog.showMessageBox(mainWindow, {title: "Update avaiable", type:"info", message:"There is a newer version of this software avaiable on the github repo. Due to your current operating system you have to download it manually."})
    }
})

autoUpdater.on("update-downloaded", (info)=>{
    mainWindow.webContents.send("updateStatus", "update downloaded")
    dialog.showMessageBox(mainWindow, {signal:updateAbortController.signal, type:"info", title:"Update installiert", message:"Software aktualisiert auf version: "+ app.getVersion()})
    setTimeout(()=>{
        updateAbortController.abort()
    },10000)
})

autoUpdater.on("error", (info)=>{
    mainWindow.webContents.send("updateStatus", info)
    dialog.showMessageBox(mainWindow, {signal:updateAbortController.signal, type:"error", title:"Update fehlgeschlagen", message:info})
    setTimeout(()=>{
        updateAbortController.abort()
    },10000)
})


// app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createMainWindow()
//   })
// app.on('window-all-closed', function () {
//   if (process.platform !== 'darwin') app.quit()
// })

async function getSerialPort(){
    let teensyPort
    await SerialPort.list().then((ports, err) => {
    if(err) {
      console.error(err)
    }

    if (ports.length === 0) {
      console.error("ERROR: No ports avaiable")
    }

    ports.forEach(port => {
        if(port.path.includes("usbmodem")||port.path.includes("COM")){
            teensyPort = port
        }
    });
    if(teensyPort == null){
        console.error("Teensy not connected, will try again")
        if(!showSerialError){
            dialog.showMessageBox(mainWindow, teensyNotConnected)
            showSerialError = true;
        }
    }
    openPort(teensyPort)
  })
}

function openPort(teensyPort){
    let port
    try{
        port = new SerialPort({
            path: teensyPort.path,
            baudRate: 9600,
            dataBits: 8,
            parity: "none",
            stopBits: 1,
            flowControl: false,
        });
    }catch(err){
        setTimeout(() => {
            getSerialPort()
        }, teensyCheckInterval)
        return;
    }
    port.pipe(parser);
    console.log("connected to teensy on port", teensyPort.path)
    if(showSerialError){
        serialAbortController.abort()
        serialAbortController = new AbortController()
        teensyNotConnected.signal = serialAbortController.signal
        showSerialError = false
    }

    port.on('error', (err) => {
        console.error("unknown error")
    });

    port.on('close', (err) => {
        console.error("Teensy was dissconected, trying to reconnect");
        //bug dieses dialog fenster wird nicht gezeigt
        dialog.showMessageBox(mainWindow, teensyNotConnected)
        showSerialError = true
        teensyPort = null
        setTimeout(() => {
            getSerialPort()
        }, teensyCheckInterval)
    });
}

parser.on('data', function(data) {
    data = data.split(",")
    mainWindow.webContents.send("data", data)
});

ipcMain.handle("saveImage",()=>{
    saveImage()
})

async function saveImage(){
    if(waitForSafe){
        return;
    }

    let date = new Date()

    let filename =
    "Collage-" +
    (date.getFullYear() + 1) +
    "-" +
    date.getMonth() +
    "-" +
    date.getDate() +
    "-"+
    date.getHours()+
    "-" +
    date.getMinutes() +
    "-" +
    date.getSeconds();

    mainWindow.webContents.capturePage().then((img)=>{
        fs.writeFile("./backend/screenshots/"+filename+".png", img.toPNG(), "base64", function(err){
            if(err) throw err;
            console.log("saved")
            uploadCollage(filename)
        })
    })

    waitForSafe = true

    setTimeout(()=>{
        waitForSafe = false
    }, 3000)
}

ipcMain.handle('fileNames', () => getFileNames()); //if upload succcessful update list for diashow
ipcMain.handle('qrLink', () => getImageURL()); //if upload succcessful get URL for QR code


//get image names
function getFileNames() {
    const directoryPath = 'backend/screenshots';
    return fs.readdirSync(directoryPath);
}

//-----Supabase-----//

//uploads file to Supabase
async function uploadCollage(filename) {
    try {
        const storageFilePath = 'collages/' + filename;
        const collageFileBuffer = fs.readFileSync('./backend/screenshots/' + filename + ".png");
        const { data, error } = await supabase
        .storage
        .from('Collages')
        .upload(storageFilePath, collageFileBuffer, {
            cacheControl: '3600',
            upsert: false
        })
        if (error) {
            console.error("Error uploading file:", error);
        } else {
            console.log("File data uploaded:", data);
        }
    } catch (error) {
        console.error("An unexpected error occurred while uploading screenshot:", error);
    }
}

// returns URL from img on Supabase
async function getImageURL(filename) {
    try {
        const storageFilePath = 'collages/' + filename;
        const { data , error } = supabase
        .storage
        .from('Collages')
        .getPublicUrl(storageFilePath)
        if (error) {
            console.error("Error fetching ImageURL:", error);
        } else {
            const imageURL = data.publicUrl;
            console.log("ImageURL:", imageURL);
            return imageURL;
        }
    } catch (error) {
        console.error("An unexpected error occurred while fetching ImageURL:", err);
    }
}