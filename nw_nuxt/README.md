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