// vue.config.js

const webpack = require('webpack');

module.exports = {
    publicPath: '',
    configureWebpack: {
        plugins: [
          new webpack.DefinePlugin({
            'process.env.FLUENTFFMPEG_COV': false
          })
        ]
    }
  }