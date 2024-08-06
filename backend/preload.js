const {contextBridge} = require ("electron");

contextBridge.exposeInMainWorld("electron",{
    circleValue: 100
});