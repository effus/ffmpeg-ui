# FFMPEG UI

Цель проекта: параметризирование известной утилиты ffmpeg с помощью создания desktop-приложения с использованием одного из известных Web-движков.

## Checked Frameworks for Build Desktop Apps and Vue.js

Looking at https://brainhub.eu/library/electron-alternatives-javascript-frameworks-for-desktop-apps/

1. [x] Electron + Vue.js

    1. Проблема с отображением стандартной системной модалки выбора файла
    2. Проблема с запуском: после старта отображается белое окно

2. [X] NW.js

    1. https://github.com/elegantweb/nwjs-vue ошибка npm install: `PostCSS plugin postcss-discard-comments requires PostCSS 8.`
    2. Nuxt + clean NW.js + https://github.com/zcbenz/nw-sample-apps + https://github.com/nwutils/nw-local-server-example/
    3. Проблема с остановкой локального сервера


Neutralino (???)

## Setup

``` bash
# === For NW run
npm install # build both frontend and backend
npm start # run as nw

# === For developing

# 1. comment last string in server.js

# 2. run backend
$ ./node_modules/nodemon/bin/nodemon.js server.js

# 3. run frontend
$ npm run dev

# 4. open in browser http://localhost:3000 (without access to filesystem)

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

## TODO

1. [ ] Tests on different videos and formats (input and output)
  1. [x] in: MPEG, out: AVI, codec: DIVx
  2. [x] in: MPEG, out: FLV, codec: FLV
  3. [x] in: MPEG, out: MPEG, codec: h264
  4. [x] in: any long video
  5. [ ] in: no audio
  6. [ ] in: corrupted file
2. [ ] Interface bugs
  1. [x] Unsupported format
  2. [ ] "Leave origin"
3. [ ] Long work memory leaks
4. [ ] CPU check 
  1. [ ] System requirements
5. [x] NW packing
6. [ ] Installation
7. [ ] Distribution