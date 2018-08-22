const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = env =>
  merge(common, {
    mode: 'production',
    plugins: [
      new ZipPlugin({
        filename: 'release.zip',
        pathPrefix: 'dist',
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 6,
            compress: {
              arguments: true,
              hoist_funs: true,
              keep_fargs: false,
              module: true,
              passes: 10,
              pure_getters: true,
              toplevel: true,
              unsafe: true,
            },
            mangle: {
              toplevel: true,
            },
            output: {
              beautify: env && env.beautify,
              comments: false,
            },
          },
        }),
      ],
    },
  });
