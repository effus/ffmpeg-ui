'use strict';

exports.load = function(ffmpeg) {
  ffmpeg
    .format('mp4')
    .videoBitrate('1024k')
    .videoCodec('h264')
    .size('1080x?')
    .audioBitrate('128k')
    .audioChannels(2)
    .audioCodec('aac');
};