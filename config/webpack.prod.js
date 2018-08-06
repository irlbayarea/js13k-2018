const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const ClosurePlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
      minimizer: [
        new TerserPlugin({
            terserOptions: {
                ecma: 6,
                mangle: true,
                module: true
            }
        })
      ]
  }
});
