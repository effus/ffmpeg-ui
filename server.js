// Import and run the Express Node web server framework
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path')
const Ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const date = require('date-and-time');
Ffmpeg.setFfmpegPath(ffmpegPath);
Ffmpeg.setFfprobePath(ffprobePath);

app.get('/api/', function(req, res) {
    res.send({test: true});
});

app.get('/api/codec/list', function(req, res) {
    Ffmpeg.getAvailableCodecs(function(err, data) {
        res.send({
            error: err, 
            codecs: data
        });
    });    
});

app.get('/api/format/list', function(req, res) {
    Ffmpeg.getAvailableFormats(function(err, data) {
        res.send({
            error: err, 
            formats: data
        });
    });
});

app.get('/api/filters/list', function(req, res) {
    Ffmpeg.getAvailableFilters(function(err, data) {
        res.send({
            error: err, 
            filters: data
        });
    });
});

app.get('/api/encoders/list', function(req, res) {
    Ffmpeg.getAvailableEncoders(function(err, data) {
        res.send({
            error: err, 
            encoders: data
        });
    });
});

app.get('/api/fileInfo', function(req, res) {
    const filePath = req.query.file;
    try {
        if (!fs.existsSync(filePath)) {
            throw Error('File not found');
        }
        Ffmpeg.ffprobe(filePath, function(err, data) {
            if (err) {
                console.error('/info failed', err);
                throw Error('FFprobe failed');
            }
            res.send({
                error: null, 
                info: data
            });
        });
        
    } catch (e) {
        res.send({
            error: e.message
        });
    }
});



app.use(express.static('./nuxt/dist/'));

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {});

io.on("connection", socket => { 
    console.log('socket.io', 'new connection');
    socket.on("converter-start", (clientData, callback) => {
        try {
            console.log('socket.io', 'converter-start', clientData, callback);
            let converter = Ffmpeg(clientData.target)
                .on('start', function(commandLine) {
                    socket.emit('convert-details', { isFinished: false, progress: {percent: 0}, command: commandLine });
                    console.log('Processing: started with command:', commandLine);
                })
                .on('progress', function(progress) {
                    socket.emit('convert-details', { isFinished: false, progress });
                    console.log('Processing: ' + progress.percent + '% done');
                })
                .on('error', function(err, stdout, stderr) {
                    socket.emit('convert-details', { 
                        isFinished: true, 
                        error: err.message,
                        stdout: stdout,
                        stderr: stderr
                    });
                    console.log('An error occurred: ' + err.message, stdout, stderr);
                })
                .on('end', function() {
                    socket.emit('convert-details', { isFinished: true });
                    console.log('Processing finished !');
                    delete converter;
                });
            if (!clientData.config.videoCodec) {
                throw Error('No video codec specified');
            }
            converter.videoCodec(clientData.config.videoCodec);
            if (!clientData.config.audioCodec) {
                throw Error('No audio codec specified');
            }
            converter.audioCodec(clientData.config.audioCodec);
            if (clientData.config.size && clientData.config.size !== 'Leave origin') {
                converter.size(clientData.config.size);
            }
            if (clientData.config.fileFormat && clientData.config.size !== 'Leave origin') {
                converter.format(clientData.config.fileFormat);
            }
            if (clientData.config.audioBitrate && clientData.config.size !== 'Leave origin') {
                converter.audioBitrate(clientData.config.audioBitrate);
            }
            if (clientData.config.audioChannels && clientData.config.size !== 'Leave origin') {
                converter.audioChannels(clientData.config.audioChannels);
            }
            if (clientData.config.videoBitrate && clientData.config.size !== 'Leave origin') {
                converter.videoBitrate(clientData.config.videoBitrate);
            }
            if (clientData.config.fps && clientData.config.size !== 'Leave origin') {
                converter.fps(clientData.config.fps);
            }
            if (clientData.config.aspectRatio && clientData.config.size !== 'Leave origin') {
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
            callback({isStarted: true, error: null});
        } catch (e) {
            callback({isStarted: false, error: e.message});
        }
        
      });
    socket.on("disconnect", (reason) => {
        console.log('socket.io', 'disconnect reason: ', reason);
    });
 });

const bindPort = 3000; // for NW
//const bindPort = 3001; // for UI dev, webpack proxies here

httpServer.listen(bindPort);
