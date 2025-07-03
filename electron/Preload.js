const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  readData: (filename) => ipcRenderer.invoke("read-data", filename),
  writeData: (filename, data) => ipcRenderer.invoke("write-data", filename, data),
});
