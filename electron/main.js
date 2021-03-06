// Modules to control application life and create native browser window
import {app, BrowserWindow, ipcMain, Menu, shell, TouchBar} from "electron";

const {TouchBarButton, TouchBarLabel, TouchBarSpacer} = TouchBar;

import path from 'path';
import isDev from 'electron-is-dev';

import initialiseNfc from './nfc.js';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 640,
        height: 800,
        darkTheme: true,
        titleBarStyle: "hidden",
        //icon: '../public/assets/icon.png',
        icon: `file://${path.join(__dirname, '../public/assets/icon.png')}`,
        title: 'NFC Spy'
    });

    // and load the index.html of the app.
    const filePath = `${__dirname}/../build/index.html`;

    console.log(`filePath: ${filePath}`);
    //mainWindow.loadFile(filePath);

    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`,
    );

    // Open the DevTools.
    let webContents = mainWindow.webContents;
    webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    });

    webContents.on('did-finish-load', () => {
        initialiseNfc(webContents)
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});


