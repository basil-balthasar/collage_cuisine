const {contextBridge, ipcRenderer, app} = require ("electron");

let bridge = {
    data: (callback) => ipcRenderer.on("data", (callback)),
    updateStatus: (callback) => ipcRenderer.on("updateStatus", (callback))
};

contextBridge.exposeInMainWorld("bridge", bridge)