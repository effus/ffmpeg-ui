const path = require('path');
const fs = require('fs');
const Ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;
const date = require('date-and-time');
Ffmpeg.setFfmpegPath(ffmpegPath);
Ffmpeg.setFfprobePath(ffprobePath);

export default {
    checkEngine: (payload, callback) => {
        console.log('FfmpegAPI.checkEngine start', payload);
        callback('pong');
    },

    getEncoders: () => {

    },

    getFormats: () => {

    },

    getVideoInfo: () => {

    },

    startConverter: () => {

    },

    cleanUp: () => {

    }
}