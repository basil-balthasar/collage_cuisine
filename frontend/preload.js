const {contextBridge, ipcRenderer, app} = require ("electron");

let bridge = {
    data: (callback) => ipcRenderer.on("data", (callback)),
    updateStatus: (callback) => ipcRenderer.on("updateStatus", (callback)),
    saveImage: () => ipcRenderer.invoke("saveImage"),
    fileNames: () => ipcRenderer.invoke("fileNames"),
    qrLink: (callback) => ipcRenderer.on("qrLink", (callback)),
    getDiaPath: () => ipcRenderer.invoke("getDiaPath")
};

contextBridge.exposeInMainWorld("bridge", bridge)