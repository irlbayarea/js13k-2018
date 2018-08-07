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
    filename: '[name].[hash].js',
    path: path.resolve(root, './dist')
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: 'JS13K 2018',
      template: 'src/index.html',
      minify: {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true
      },
      showErrors: false
    })
  ]
};
