// Modules to control application life and create native browser window
import {app, BrowserWindow} from "electron";


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 640, height: 800, icon: '../public/tomkp.png', title: 'NFC Spy'});

    // and load the index.html of the app.
    const filePath = `${__dirname}/../public/index.html`;

    console.log(`filePath: ${filePath}`);
    mainWindow.loadFile(filePath);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
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
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
import { NFC } from 'nfc-pcsc';

const nfc = new NFC(); // optionally you can pass logger

nfc.on('reader', reader => {

    console.log(`\n${reader.reader.name}  device attached`);

    // needed for reading tags emulated with Android HCE
    // custom AID, change according to your Android for tag emulation
    // see https://developer.android.com/guide/topics/connectivity/nfc/hce.html
    reader.aid = 'F222222222';

    reader.on('card', card => {

        // card is object containing following data
        // [always] String type: TAG_ISO_14443_3 (standard nfc tags like Mifare) or TAG_ISO_14443_4 (Android HCE and others)
        // [always] String standard: same as type
        // [only TAG_ISO_14443_3] String uid: tag uid
        // [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response

        console.log(`\n${reader.reader.name}  card detected`, card);

    });

    reader.on('card.off', card => {
        console.log(`\n${reader.reader.name}  card removed`, card);
    });

    reader.on('error', err => {
        console.log(`\n${reader.reader.name}  an error occurred`, err);
    });

    reader.on('end', () => {
        console.log(`\n${reader.reader.name}  device removed`);
    });

});

nfc.on('error', err => {
    console.log('\nan error occurred', err);
});