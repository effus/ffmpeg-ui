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
        ipcRenderer.on('renderer', this.onEngineCallback);
    }

    /**
     * @returns 
     */
    async checkEngine() {
        try {
            const response = await ipcRenderer.invoke('check-engine', { ping: true });
            if (response && response.result) {
                this.flagEngineAvailable = true;
                return true;
            } else {
                this.flagEngineAvailable = false;
                return false;
            }
        } catch (e) {
            console.error('checkMessageChannel', e);
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
    async getVideoInfo(filePath) {
        const result = await ipcRenderer.invoke('video-info', filePath);
        return result.info;
    }

    /**
     * @returns 
     */
    async getEncodersList() {
        const result = await ipcRenderer.invoke('get-encoders');
        return result.list;
    }

    async getFormatList() {
        const result = await ipcRenderer.invoke('get-formats');
        return result.list;
    }

    async startConverter(params) {
        const result = await ipcRenderer.invoke('start-converter', params);
        return result.process;
    }
}

export default Сonnector;