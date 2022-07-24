window.ipcRenderer = require('electron').ipcRenderer;

window.addEventListener('DOMContentLoaded', () => {
        console.log('Application preloader started');
        setTimeout(() => {
            if (document.querySelector('#loader') === null) {
                document.querySelector('body').innerHTML = '<style>body{background-color:#000;color:#fff;font-family:Arial;' +
                'font-size:12px;text-align:center;}</style><h1>Fail to load UI</h1><p>If you run on dev mode, start vuetify webserver</p>';
            }
        }, 2000);
    }
);