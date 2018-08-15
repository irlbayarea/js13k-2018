const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const TerserPlugin = require('terser-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = merge(common, {
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
          compress: {
            arguments: true,
            hoist_funs: true,
            module: true,
            toplevel: true,
          },
          mangle: true,
        },
      }),
    ],
  },
});
