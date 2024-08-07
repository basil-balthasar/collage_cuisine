const {contextBridge, ipcRenderer} = require ("electron");

let bridge = {
    data: (callback) => ipcRenderer.on("data", (callback)),
    capture: screenshot
};

contextBridge.exposeInMainWorld("bridge", bridge);