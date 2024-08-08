const {contextBridge, ipcRenderer, app} = require ("electron");

let bridge = {
    data: (callback) => ipcRenderer.on("data", (callback)),
};