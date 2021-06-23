// Import and run the Express Node web server framework
const express = require('express');
const app = express();
const fs = require('fs');
const Ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
Ffmpeg.setFfmpegPath(ffmpegPath);
Ffmpeg.setFfprobePath(ffprobePath);

app.use(express.static('./nuxt/dist/'));

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

// uncomment later
app.listen(3001);