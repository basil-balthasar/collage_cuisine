const {contextBridge, ipcRenderer} = require ("electron");

let bridge = {
    data: (callback) => ipcRenderer.on("data", (callback))
};

contextBridge.exposeInMainWorld("bridge", bridge);