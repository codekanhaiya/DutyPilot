import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import fs from "fs";
import isDev from "electron-is-dev";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    maxWidth: 1920,
    maxHeight: 1080,
    title: "Duty Pilot",
    resizable: true,
    autoHideMenuBar: true, // Hides the default menu bar
    webPreferences: {
      preload: path.join(__dirname, "Preload.js"),
      contextIsolation: true, // required for contextBridge to work
      nodeIntegration: false, // for security
    },
  });

  // Load your app
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../client/build/index.html")}`
  );
}

const getDataPath = () => {
  const dir = path.join(app.getPath("userData"), "data");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

ipcMain.handle("read-data", async (event, filename) => {
  // const filePath = path.join(__dirname, "data", filename); // works on develpment mode
  const filePath = path.join(getDataPath(), filename); // Use system path for .exe mode
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
  } catch (err) {
    return [];
  }
});

ipcMain.handle("write-data", async (event, filename, data) => {
  // const filePath = path.join(__dirname, "data", filename); // works on develpment mode
  const filePath = path.join(getDataPath(), filename); // Use system path for .exe mode
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  return true;
});

function copyDefaultsOnce() {
  // for .exe mode
  const dataDir = getDataPath();
  const defaultDir = path.join(__dirname, "data");
  const files = ["members.json", "rooms.json", "timings.json"];

  for (const file of files) {
    const targetPath = path.join(dataDir, file);
    if (!fs.existsSync(targetPath)) {
      const sourcePath = path.join(defaultDir, file);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath);
      } else {
        fs.writeFileSync(targetPath, "[]", "utf-8"); // create empty JSON
      }
    }
  }
}

app.whenReady().then(() => {
  copyDefaultsOnce();
  createWindow();

  // macOS: re-open window when dock icon is clicked
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit app when all windows are closed (except on macOS)
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
