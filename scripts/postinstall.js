const { exec } = require('child_process');
const fs = require('fs');
const os = require('os');
const _7z = require('7zip-min');
const MultipartDownload = require('multipart-download');
const path = require('path');
const { dir } = require('console');
var rimraf = require("rimraf");


var downloadFFmpeg = function(url, dest) {
    return new Promise(function(resolve, reject) {
        console.log('Start download ffmpeg')
        const outputDir = path.dirname(dest)
        new MultipartDownload()
                .start(url, {
                    numOfConnections: 5,
                    saveDirectory: outputDir,
                    fileName: 'ffmpeg.7z'
                })
                .on('data', (data, offset) => {
                    // manipulate data here
                  })
                .on('end', (filePath) => {
                    console.log(`Downloaded file path: ${filePath}`);
                    resolve();
                });
        
    });
}

const extract = function(file, dest) {
    return new Promise((resolve,reject) => {
        _7z.unpack(file, dest, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const renameUnPackedDir = function(dest) {
    return new Promise((resolve, reject) => {
        const getDirectories = source =>
        fs.readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
        const dirs = getDirectories(dest);
        if (dirs.length == 1) {
            fs.renameSync(dest + '/' + dirs[0], dest + '/build');
            resolve();
        } else {
            reject('Un[acked dir not found');
        }
    });
}

const removeBuild = function(dest) {
    return new Promise((resolve, reject) => {
        rimraf(dest, function () { 
            resolve();
        });
    });
};

console.log('=== Start postinstall ===');

(async () => {
    //await removeBuild('./ffmpeg/build/');
    //await downloadFFmpeg("https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-full.7z", "./ffmpeg/ffmpeg.7z");
    //console.log('FFmpeg pack downloaded')
    //await extract('./ffmpeg/ffmpeg.7z', './ffmpeg/');
    //console.log('FFmpeg extracted');
    //await renameUnPackedDir('./ffmpeg/');
    //fs.unlinkSync('./ffmpeg/ffmpeg.7z');
    console.log('=== Postinstall complete ===');
})();