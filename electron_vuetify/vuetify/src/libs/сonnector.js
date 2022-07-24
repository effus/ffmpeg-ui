const ipcRenderer = window.ipcRenderer;


class Сonnector {
    
    constructor() {
        ipcRenderer.on('renderer', (event, payload) => this.onEngineCallback(payload));
    }

    /**
     * @param {*} onStart 
     * @param {*} onProgress 
     * @param {*} onFinish 
     * @param {*} onError 
     */
    setEvents(onStart, onProgress, onFinish, onError) {
        this.onStart = onStart || function() {};
        this.onProgress = onProgress || function() {};
        this.onFinish = onFinish || function() {};
        this.onError = onError || function() {};
    }

    /**
     * @returns 
     */
    async checkEngine() {
        try {
            const response = await ipcRenderer.invoke('check-engine', { ping: true });
            if (response && response.result) {
                this.flagEngineAvailable = true;
                return true;
            } else {
                this.flagEngineAvailable = false;
                return false;
            }
        } catch (e) {
            console.error('checkMessageChannel', e);
            this.flagEngineAvailable = false;
            return false;
        }
    
    }
    
    isEngineAvailable() {
        return this.flagEngineAvailable;
    }

    /**
     * @param {*} event 
     * @param {*} payload 
     */
    onEngineCallback(payload) {
        if (payload.isFinished) {
            if (payload.error) {
                this.onError(payload);
            } else {
                this.onFinish(payload);
            }
        } else if (payload.isStarted === true && !payload.progress) {
            this.onStart(payload);
        } else if (payload.isStarted === false) {
            this.onError(payload);
        } else {
            this.onProgress(payload);
        }
    }

    /**
     * @param {*} filePath 
     * @returns 
     */
    async getVideoInfo(filePath) {
        const result = await ipcRenderer.invoke('video-info', filePath);
        return result.info;
    }

    /**
     * @returns 
     */
    async getEncodersList() {
        const result = await ipcRenderer.invoke('get-encoders');
        return result.list;
    }

    async getFormatList() {
        const result = await ipcRenderer.invoke('get-formats');
        return result.list;
    }

    async startConverter(params) {
        const result = await ipcRenderer.invoke('start-converter', params);
        if (result && result.isStarted) {
            this.onStart(result);
        }
    }

    async cleanup() {
        ipcRenderer.invoke('cleanup');
    }
}

export default Сonnector;