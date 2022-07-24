// vue.config.js

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    publicPath: '',
    configureWebpack: {
        //target: 'node',
        plugins: [
          new webpack.DefinePlugin({
            'process.env.FLUENTFFMPEG_COV': false
          })
        ]
    }
  }