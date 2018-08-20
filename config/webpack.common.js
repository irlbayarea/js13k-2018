const path = require('path');
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');

// Used instead of __dirname.
const root = require('app-root-path') + '';
const gitRevisionPlugin = new GitRevisionPlugin();

// Load common flags
const flags = require('./flags');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].[git-revision-hash].js',
    path: path.resolve(root, './dist'),
  },
  plugins: [
    new HtmlWebPackPlugin({
      title: 'JS13K 2018',
      template: 'src/index.html',
      minify: {
        collapseBooleanAttributes: true,
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        minifyCSS: true,
        removeAttributeQuotes: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        sortAttributes: true,
        sortClassName: true,
        useShortDoctype: true,
      },
      showErrors: false,
    }),
    gitRevisionPlugin,
    new CopyWebpackPlugin(['src/assets/**/*']),
    new webpack.DefinePlugin(flags),
  ],
};
