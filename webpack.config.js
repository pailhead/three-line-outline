const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.ts',
  mode: 'production',
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ThickLine',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(vert|frag|glsl|vs|fs)/,
        type: 'asset/source',
      },
    ],
  },
  externals: {
    // three: 'THREE',
    three: {
      root: 'THREE',
      amd: 'three',
      commonjs: 'three',
      commonjs2: 'three',
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      THREE: 'three',
    }),
    new HtmlWebpackPlugin({
      title: 'Debugger',
    }),
  ],
}
