const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')
const common = require('./webpack.config')
module.exports = {
  ...common,
  ...{
    mode: 'development',
    devtool: 'inline-source-map',
    entry: './src/debugger/index.ts',
    plugins: [
      new webpack.ProvidePlugin({
        THREE: 'three',
      }),
      new HtmlWebpackPlugin({
        title: 'Debugger',
      }),
    ],
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9123,
    },
  },
  externals: undefined,
}
