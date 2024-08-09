const {contextBridge, ipcRenderer, app} = require ("electron");

let bridge = {
    data: (callback) => ipcRenderer.on("data", (callback)),
    updateStatus: (callback) => ipcRenderer.on("updateStatus", (callback)),
    saveImage: () => ipcRenderer.invoke("saveImage")
};

contextBridge.exposeInMainWorld("bridge", bridge)