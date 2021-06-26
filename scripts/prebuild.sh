#!/usr/bin/sh
mkdir -p make && rm -rf make/* && mkdir -p make/nuxt && \
cp -R ./nuxt/dist/ make/nuxt/dist && \
cp -r ./ffmpeg make/ffmpeg && \
cp -r ./node_modules make/node_modules && \
cp package-lock.json make/package-lock.json
cp package.json make/package.json
cp server.js make/server.js
cp .env.example make/.env