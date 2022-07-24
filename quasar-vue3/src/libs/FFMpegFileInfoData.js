class FFMpegFileInfoFormat {
    constructor(obj) {
        this.bitRate = obj.bit_rate;
        this.duration = obj.duration;
        this.filename = obj.filename;
        this.formatLongName = obj.format_long_name;
        this.formatName = obj.format_name;
        this.size = obj.size;
        this.tags = obj.tags;
    }
}

class FFMpegFileInfoStream {
    constructor(obj) {
        this.avgFrameRate = obj.avg_frame_rate;
        this.bitRate = obj.bit_rate;
        this.codecLongName = obj.codec_long_name;
        this.codecName = obj.codec_name;
        this.codecType = obj.codec_type;
        this.codecHeight = obj.coded_height;
        this.codecWidth = obj.coded_width;
        this.codecAspectRatio = obj.display_aspect_ratio;
        this.duration = obj.duration;
        this.height = obj.height;
        this.width = obj.width;
        this.channels = obj.channels;
        this.channelsLayout = obj.channel_layout;
        this.sampleRate = obj.sample_rate;
    }
}

class FFMpegFileInfoTableRow {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

export default class FFMpegFileInfoData {
    constructor(obj) {
        this.chapters = obj.chapters;
        this.format = new FFMpegFileInfoFormat(obj.format);
        this.streams = obj.streams.map(stream => new FFMpegFileInfoStream(stream));
    }

    /**
     * @returns FFMpegFileInfoStream[]
     */
    getVideoStreams() {
        return this.streams.filter(stream => stream.codecType === 'video');
    }

    getAudioStreams() {
        return this.streams.filter(stream => stream.codecType === 'audio');
    }

    formatOutputTable() {
        let rows = [];
        for (let stream of this.getVideoStreams()) {
            rows.push(new FFMpegFileInfoTableRow('Video Stream #1', ''));
            rows.push(new FFMpegFileInfoTableRow('Codec name', stream.codecLongName));
            rows.push(new FFMpegFileInfoTableRow('Bitrate', stream.bitRate));
            rows.push(new FFMpegFileInfoTableRow('AvgFrameRate', stream.avgFrameRate));
            rows.push(new FFMpegFileInfoTableRow('Duration', stream.duration));
            rows.push(new FFMpegFileInfoTableRow('AspectRatio', stream.codecAspectRatio));
            rows.push(new FFMpegFileInfoTableRow('Width', stream.width));
            rows.push(new FFMpegFileInfoTableRow('Height', stream.height));
        }
        for (let stream of this.getAudioStreams()) {
            rows.push(new FFMpegFileInfoTableRow('Audio Stream #1', ''));
            rows.push(new FFMpegFileInfoTableRow('Codec name', stream.codecLongName));
            rows.push(new FFMpegFileInfoTableRow('Bitrate', stream.bitRate));
            rows.push(new FFMpegFileInfoTableRow('Duration', stream.duration));
            rows.push(new FFMpegFileInfoTableRow('Channels', stream.channels));
            rows.push(new FFMpegFileInfoTableRow('Channels Layout', stream.channelsLayout));
            rows.push(new FFMpegFileInfoTableRow('Sample Rate', stream.sampleRate));
        }
        
        console.log('rows', rows);
        return rows;
    }
}