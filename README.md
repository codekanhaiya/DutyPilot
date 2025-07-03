# 🚀 DutyPilot - Desktop Duty Assignment Application

**DutyPilot** is a modern cross-platform desktop application built using **Electron + React**. It allows managing duty assignments, rooms, members, and timing data locally — **without any remote database**, making it fast, secure, and offline-capable.

---

## 🛠 Features

- 📋 CRUD operations on Members, Rooms, and Timing Data
- 💾 Local data storage (no external DB needed)
- 🔐 Secure Electron context isolation with `Preload.js`
- ⚛️ React frontend with responsive UI
- 📦 Build production-ready `.exe` installer using `electron-builder`

---

## 📁 Project Structure

```
DUTYPILOT/
│
├── client/                # React frontend (create-react-app)
│   ├── public/
│   └── src/
│
├── electron/              # Electron main process
│   ├── main.mjs           # Main process setup
│   ├── Preload.js         # Safe IPC bridging
│   ├── icon.ico           # App icon
│   └── data/              # Default data files (members.json, etc.)
│       ├── members.json
│       ├── rooms.json
│       └── timings.json
│
├── dist/                  # Build output (generated after packaging)
├── node_modules/          # Project dependencies
├── package.json           # Main project config & scripts
├── package-lock.json      # Lock file for npm
└── README.md              # Project documentation (You're here!)
```

---

## 🔧 Development Architecture

- **Frontend**: React (Create-React-App) served via `http://localhost:3000` in dev
- **Backend**: Electron main process handles file-based read/write via `ipcMain`
- **Bridge**: Preload script exposes secure methods to frontend using `contextBridge`
- **Storage**: App writes JSON data to:


---

## 🚀 Getting Started (Development)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/dutypilot.git
cd dutypilot
```

### 2. Install Dependencies
```bash
npm install
cd client && npm install
cd ..
```

### 3. Start the App in Dev Mode
```bash 
npm run dev
```
- This command runs both:
    1)  React client (http://localhost:3000)
    2) Electron process (auto-launches your window)

## 📁 Local Data Storage

- On first launch, the app copies default JSON files (members.json, etc.) from electron/data into your system folder:

``` bash
Windows: C:\Users\<You>\AppData\Roaming\DutyPilot\data\
Linux: ~/.config/DutyPilot/data/
macOS: ~/Library/Application Support/DutyPilot/data/
```

- These files are updated whenever you perform any CRUD operation inside the app UI.


## 🏗 Production Build & Installer

### 1. Build the React App
``` bash 
npm run build-client
```

### 2. Create the Final Installer (.exe)
``` bash
npm run build
```

    This command:
        1) Builds frontend (client/build)
        2) Copies required files into dist/
        3) Packages using electron-builder
        4) Generates .exe installer inside dist/
    
### 3. Run the Installer

    Double-click the .exe file in the dist/ directory. It will:  
    - Install DutyPilot on your system
    - Store app data in a writable system folder
    - Create a Start Menu/Desktop icon

## 📦 Build Scripts (package.json)

``` bash
"scripts": {
  "start-client": "cd client && npm start",
  "start-electron": "electron .",
  "dev": "concurrently \"npm run start-client\" \"npm run start-electron\"",
  "build-client": "cd client && npm install && npm run build",
  "build": "npm run build-client && electron-builder"
}
```

## 🧠 Technical Stack

| Layer         | Tech                    |
| ------------- | ----------------------- |
| UI            | React + Material UI     |
| Desktop Shell | Electron (v29.x)        |
| IPC Bridge    | contextBridge (Preload) |
| Data Storage  | Local JSON file system  |
| Packaging     | electron-builder (NSIS) |

## 🚀 Download DutyPilot

Get started with DutyPilot by downloading the official Windows installer:

[⬇️ Download DutyPilot v1.0.0](https://github.com/your-username/codekanhaiya/releases/download/v1.0.0/DutyPilot.Setup.1.0.0.exe) 

### 📦 Installer Info
- **File**: `DutyPilot.Setup.1.0.0.exe`
- **Version**: 1.0.0
- **Supported OS**: Windows 10 / 11
- **Release Date**: July 2025

> 🛠️ After downloading, double-click the `.exe` file to begin the installation process.


## 👨‍💻 Author

**Kanhaiya Gupta**  
🔗 [Portfolio](http://officialkanha.epizy.com/)  
📧 kanhaiyaguptaksg@gmail.com  
[![Website Badge](https://img.shields.io/badge/Visit-Website-blue)](http://officialkanha.epizy.com/)
