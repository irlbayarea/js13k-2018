const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

// Used instead of __dirname.
const root = require('app-root-path') + '';

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(root, './dist')
  },
  plugins: [
    new HtmlWebPackPlugin()
  ]
};
