const { execSync } = require('child_process');

class FFMpeg {
    constructor() {
        this.win = this.isNwAvailable() ? nw.Window.get() : null;
    }
    isNwAvailable() {
        return (typeof nw !== 'undefined');
    }
    async getVideoInfo(path) {
        if (!this.isNwAvailable()) {
            throw Error('nw not awailable');
        }
        return {}
    }
    async getEncodersList() {

    }
}

export default FFMpeg;