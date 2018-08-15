const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    open: true,
    host: '127.0.0.1',
    port: 8080,
    compress: true,
    overlay: {
      errors: true,
      warnings: false,
    },
    stats: 'minimal',
  },
});
