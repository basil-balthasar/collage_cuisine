const {contextBridge, ipcRenderer, app} = require ("electron");

let bridge = {
    data: (callback) => ipcRenderer.on("data", (callback)),
    updateStatus: (callback) => ipcRenderer.on("updateStatus", (callback)),
    saveImage: () => ipcRenderer.invoke("saveImage"),
    fileNames: () => ipcRenderer.invoke("fileNames"),
    qrLink: () => ipcRenderer.invoke("qrLink")
};

contextBridge.exposeInMainWorld("bridge", bridge)