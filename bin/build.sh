#!/bin/bashmdi
mkdir -p ./dist && \
rm -rf ./dist && \

# build front
cd vuetify && npm run build && cd .. && \

# pack
node node_modules/electron-packager/bin/electron-packager . "FFMpeg UI" --overwrite --platform=win32 --arch=x64 --out=./dist/platforms --icon=./icons/favicon.ico && \

# cleanup
rm -rf "./dist/FFMpeg UI-win32-x64/resources/app/vuetify/node_modules" &&
rm -rf "./dist/FFMpeg UI-win32-x64/resources/app/vuetify/public" &&
rm -rf "./dist/FFMpeg UI-win32-x64/resources/app/vuetify/src" &&
rm -rf "./dist/FFMpeg UI-win32-x64/resources/app/nw" &&
rm -rf "./dist/FFMpeg UI-win32-x64/resources/app/nw_nuxt"