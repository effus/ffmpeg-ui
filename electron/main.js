// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const Ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
Ffmpeg.setFfmpegPath(ffmpegPath);
Ffmpeg.setFfprobePath(ffprobePath);

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700, 
    frame: true,
    resizable: false,
    maximizable: true,
    minimizable: true,
    closable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true
    }
  })

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  //mainWindow.loadFile('vuetify/dist/index.html');
  mainWindow.loadURL('http://localhost:8080');

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


ipcMain.handle('check-engine', async (_, arg) => {
  console.log('check-engine', arg);
  return {result: true};
});


const retreiveFunction = function(func, arg) {
  return new Promise((resolve, reject) => {
    try {
      if (arg) {
        func(arg, function(err, data) {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      } else {
        func(function(err, data) {
          if (err) {
            return reject(err);
          }
          resolve(data);
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

ipcMain.handle('get-encoders', async () => {
  const encoders = await retreiveFunction(Ffmpeg.getAvailableEncoders);
  return {list: encoders};
});

ipcMain.handle('get-formats', async () => {
  console.log('get-formats');
  const formats = await retreiveFunction(Ffmpeg.getAvailableFormats);
  return {list: formats};
});

ipcMain.handle('video-info', async (_, filePath) => {
  console.log('video-info', filePath);
  const data = await retreiveFunction(Ffmpeg.ffprobe, filePath);
  return {info: data};
});

ipcMain.handle('start-converter', async (event, data) => {
  console.log('start-converter', data, event.sender.send('renderer'));
  
  return {process: data};
});