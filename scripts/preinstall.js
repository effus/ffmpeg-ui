const { exec } = require('child_process');
const { exit } = require('process');

console.log('=== Start preinstall ===')

exec('cd ./nuxt && (npm install || true) && (npm run build || true) && (npm run generate || true)', (err, stdout, stderr) => {
    
    console.log(stdout);
    console.log('=== Preinstall complete ===')
    exit(0);

});
