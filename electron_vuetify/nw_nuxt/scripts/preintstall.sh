#!/usr/bin/sh
cd ./nuxt && (npm install || true) && (npm run build || true) && (npm run generate || true)