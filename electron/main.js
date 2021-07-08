// Modules to control application life and create native browser window
const {app, BrowserWindow, screen, ipcMain} = require('electron');

const path = require('path');
const fs = require('fs');
const Ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;
//const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
//const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const date = require('date-and-time');
Ffmpeg.setFfmpegPath(ffmpegPath);
Ffmpeg.setFfprobePath(ffprobePath);

const isDevMode = (typeof process.env.ELECTRON_DEV_MODE !== 'undefined') && parseInt(process.env.ELECTRON_DEV_MODE)==1;

function createWindow () {
  let { width, height } = screen.getPrimaryDisplay().workAreaSize;
  if (width > 700) {
    width = 700;
  }
  if (height > 820) {
    height = 820;
  }
  if (isDevMode) {
    width = 1000;
  }
  const mainWindow = new BrowserWindow({
    width: width,
    height: height, 
    frame: true,
    resizable: false,
    maximizable: false,
    minimizable: true,
    closable: true,
    icon: __dirname + '/../icons/favicon.ico',
    title: 'FFMpeg UI Tools',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      nativeWindowOpen: true
    }
  })
  mainWindow.setMenu(null);

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  if (isDevMode) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile('vuetify/dist/index.html');
  }

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

process.on('uncaughtException', function (error) {
  console.error('App crashed with error', error);
  if (callbackSender !== null) {
    callbackSender.send('renderer', {isFinished: true, error: error.message});
  }
  setTimeout(() => {
    app.quit();
  }, 5000);
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

let callbackSender = null;

ipcMain.handle('check-engine', async (event, arg) => {
  console.log('check-engine', arg);
  callbackSender = event.sender;
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

let converter = null;

ipcMain.handle('start-converter', async (event, clientData) => {
  if (converter !== null) {
    callbackSender.send('renderer', {isStarted: false, error: 'Another task in progress'});
    return;
  }
  try {
    converter = Ffmpeg(clientData.target)
      .on('progress', function(progress) {
          callbackSender.send('renderer', {isFinished: false, progress});
      })
      .on('error', async function(err) {
          await callbackSender.send('renderer', {isFinished: true, error: err.message});
          console.log('An error occurred: ' + err.message);
      })
      .on('end', async function() {
        await callbackSender.send('renderer', {isFinished: true});
        console.log('Processing finished !');
      });
    if (!clientData.config.videoCodec) {
        throw Error('No video codec specified');
    }
    converter.videoCodec(clientData.config.videoCodec);
    if (!clientData.config.audioCodec) {
        throw Error('No audio codec specified');
    }
    converter.audioCodec(clientData.config.audioCodec);
    if (clientData.config.size) {
        converter.size(clientData.config.size);
    }
    if (clientData.config.fileFormat) {
        converter.format(clientData.config.fileFormat);
    }
    if (clientData.config.audioBitrate) {
        converter.audioBitrate(clientData.config.audioBitrate);
    }
    if (clientData.config.audioChannels) {
        converter.audioChannels(clientData.config.audioChannels);
    }
    if (clientData.config.videoBitrate) {
        converter.videoBitrate(clientData.config.videoBitrate);
    }
    if (clientData.config.fps) {
        converter.fps(clientData.config.fps);
    }
    if (clientData.config.aspectRatio) {
        converter.aspect(clientData.config.aspectRatio);
    }
    if (clientData.config.fileFormat === 'flv') {
        converter.flvmeta();
    }
    let outputFilePath = clientData.pattern;
    if (!fs.existsSync(clientData.target)) {
        throw new Error('target file not found');
    }
    const originPath = path.dirname(path.resolve(clientData.target));
    const originName = path.basename(clientData.target, path.extname(clientData.target)) //notes
    outputFilePath = outputFilePath
        .replace(/\[originFileDir\]/g, originPath)
        .replace(/\[originFileName\]/g, originName)
        .replace(/\[datetime\]/g, date.format(new Date(), 'YYYY-MM-DD_HHmmss'))
        .replace(/\[format\]/g, clientData.config.fileFormat);
    if (!outputFilePath) {
        throw new Error('Incorrect output path');
    }
    converter.output(outputFilePath);
    converter.run();
    callbackSender.send('renderer', {isStarted: true, error: null});
  } catch (e) {
    console.error('start-converter', e);
    callbackSender.send('renderer', {isStarted: false, error: e.message});
  }
});

ipcMain.handle('cleanup', async () => {
  console.log('cleanup');
  converter = null;
  callbackSender.send('renderer', {result: true});
});