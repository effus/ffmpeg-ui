const { execSync } = require('child_process');
//const FluentFFmpeg = require('fluent-ffmpeg');
//const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
//const ffprobePath = require('@ffprobe-installer/ffprobe').path;
//FluentFFmpeg.setFfmpegPath(ffmpegPath);
//FluentFFmpeg.setFfprobePath(ffprobePath);


class FFMpeg {
    constructor() {
        this.win = this.isNwAvailable() ? nw.Window.get() : null;
    }
    
    isNwAvailable() {
        return (typeof nw !== 'undefined');
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

export default FFMpeg;