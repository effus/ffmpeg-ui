// Import and run the Express Node web server framework
var express = require('express');
var app = express();
var Ffmpeg = require('fluent-ffmpeg');




app.use(express.static('./nuxt/dist/'));

app.get('/test/', function(req, res) {
    res.send({test: true});
});

app.get('/codec/list', function(req, res) {
    Ffmpeg.getAvailableCodecs(function(err, codecs) {
        console.log('Available codecs:');
        console.dir(codecs);
        res.send({
            error: err, 
            codecs: codecs
        });
    });
    
});

// uncomment later
app.listen(3000);