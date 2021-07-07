//const ipcRenderer = require('electron');
const ipcRenderer = window.ipcRenderer;
//const FluentFFmpeg = require('fluent-ffmpeg');
//const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
//const ffprobePath = require('@ffprobe-installer/ffprobe').path;
//FluentFFmpeg.setFfmpegPath(ffmpegPath);
//FluentFFmpeg.setFfprobePath(ffprobePath);


class Сonnector {
    
    constructor() {
        //this.win = this.isNwAvailable() ? nw.Window.get() : null;
        this.engineCallback = this.onEngineCallback;
    }

    /**
     * @returns 
     */
    async checkMessageChannel() {
        const response = await ipcRenderer.invoke('check-engine', { ping: true });
        if (response && response.result) {
            this.flagEngineAvailable = true;
            return true;
        } else {
            this.flagEngineAvailable = false;
            return false;
        }
    }
    
    isEngineAvailable() {
        return this.flagEngineAvailable;
    }

    onEngineCallback(payload) {
        console.log('onEngineCallback', payload);
    }

    /**
     * @param {*} filePath 
     * @returns 
     */
    getVideoInfo(filePath) {
        return new Promise((resolve, reject) => {
            if (!this.isNwAvailable()) {
                reject('NW not available');
            }
            if (!fs.existsSync(filePath)) {
                reject('File not found');
            }
            /*FluentFFmpeg.ffprobe(filePath, function(err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });*/
        });
    }

    /**
     * @returns 
     */
    getEncodersList() {
        return new Promise((resolve, reject) => {
            /*FluentFFmpeg.getAvailableEncoders(function(err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });*/
        });
    }
}

export default Сonnector;