# FFMPEG UI

Цель проекта: параметризирование известной утилиты ffmpeg с помощью создания desktop-приложения с использованием одного из известных Web-движков.

## Checked Frameworks for Build Desktop Apps and Vue.js

Looking at https://brainhub.eu/library/electron-alternatives-javascript-frameworks-for-desktop-apps/

1. [x] Electron + Vue.js
    1.1 Проблема с отображением стандартной системной модалки выбора файла
    1.2 Проблема с запуском: после старта отображается белое окно

2. [X] NW.js
    2.1 https://github.com/elegantweb/nwjs-vue ошибка npm install: `PostCSS plugin postcss-discard-comments requires PostCSS 8.`
    2.2 Nuxt + clean NW.js + https://github.com/zcbenz/nw-sample-apps + https://github.com/nwutils/nw-local-server-example/
    2.3 Проблема с остановкой локального сервера


Neutralino (???)

## Setup

Build nuxt app first!

``` bash
# === In "." dir is a NW App, which start localhost on port 3000 and look at nuxt/dist
npm install
npm start

# === In "nuxt" dir is main app

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## FYI: best way to add FFmpeg to project

1. `npm i fluent-ffmpeg` - gives all neccessary methods
2. `npm i @ffmpeg-installer/ffmpeg` - add binary of ffmpeg to project
3. `const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;` - get path of binary
4. `Ffmpeg.setFfmpegPath(ffmpegPath);` - set binary path value for fluent-ffmpeg
5. `npm i @ffprobe-installer/ffprobe` - add ffprobe binary to project

## API

1. All system codecs: `http://localhost:3000/api/codec/list`
2. File info: `http://localhost:3000/api/fileInfo?file=...`
