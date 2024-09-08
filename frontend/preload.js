/*----------------------------------------------------
This is the preload script attached to both of the
windows. It can expose backand variables and APIs to
the frontend windows
----------------------------------------------------*/

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