/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */

 import { contextBridge } from 'electron'
 import { BrowserWindow } from '@electron/remote'

//const filePath = path.join(app.getPath('userData'), '/some.file')

 import FFMPegApi from './api/ffmpeg-api';

 contextBridge.exposeInMainWorld('FFMpegApi', Object.assign({
    windowClose: () => {
        const win = BrowserWindow.getFocusedWindow()
        console.log('get windowCloseApi');
        win.close()
        return;
    }
 }, FFMPegApi))