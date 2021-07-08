const electronInstaller = require('electron-winstaller');
// NB: Use this syntax within an async function, Node does not have support for
//     top-level await as of Node 12.
try {
    resultPromise = electronInstaller.createWindowsInstaller({
        appDirectory: './dist/platforms/FFMpegUI-win32-x64',
        outputDirectory: './dist/installers',
        authors: 'effus',
        exe: 'FFMpegUI.exe'
    });
} catch (e) {
    console.log(`No dice: ${e.message}`);
}

resultPromise.then(() => console.log("Complete"), (e) => console.log(`No dice: ${e.message}`));
