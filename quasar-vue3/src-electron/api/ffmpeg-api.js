const path = require('path');
const fs = require('fs');
const Ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;
const date = require('date-and-time');
Ffmpeg.setFfmpegPath(ffmpegPath);
Ffmpeg.setFfprobePath(ffprobePath);

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

export default {
    checkEngine: (payload, callback) => {
        console.log('FfmpegAPI.checkEngine start', payload);
        callback('pong');
    },

    getEncoders: () => {

    },

    getFormats: () => {

    },

    getVideoInfo: async (filePath, callback) => {
        console.log('FfmpegAPI.getVideoInfo start', filePath);
        const data = await retreiveFunction(Ffmpeg.ffprobe, filePath);
        callback({info: data});
    },

    startConverter: () => {

    },

    cleanUp: () => {

    }
}