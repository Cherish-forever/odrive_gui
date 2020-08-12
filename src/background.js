'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

const { spawnSync } = require('child_process');
const spawn = require('child_process').spawn;
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

// function to get determine correct command for python
function getPyCmd() {
  let spawnRet = spawnSync('python',['-V']);
  let vString;
  if (spawnRet.stdout.toString().length > 1){
      vString = spawnRet.stdout.toString();
  }
  else {
      vString = spawnRet.stderr.toString();
  }

  if (vString.split(' ')[1].split('.')[0] == '2') {
      return 'python3';
  }
  else {
      return 'python';
  }
}

function createWindow() {
  // Spawn the python server
  let scriptFilename = path.join(app.getAppPath(), '../server', 'odrive_server.py');
  const args = process.argv;
  let effectiveCommand = [];
  effectiveCommand.push(scriptFilename);
  if (app.isPackaged === true) {
    for (const arg of args.slice(1)) {
      effectiveCommand.push(arg);
    }
  }
  else {
    for (const arg of args.slice(2)) {
      effectiveCommand.push(arg);
    }
  }
  var python = spawn(getPyCmd(), effectiveCommand);
  python.stdout.on('data',function(data) {
    console.log(data.toString('utf8'));
  });
  python.stderr.on('data',function(data) {
    console.log(data.toString('utf8'));
  });
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  win.maximize();
  win.setMenu(null);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
