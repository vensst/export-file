/*
 * @Name: prod.conf.js
 * @Description:
 * @Date: 2024/4/9 下午1:13
 * @Author: huyafei
 * @LastEditors: huyafei
 * @LastEditTime: 2024/4/9 下午1:13
 */
const webpack = require("webpack");
const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
//js压缩 webpack5自带
const TerserWebpackPlugin = require('terser-webpack-plugin');

const baseConf = require('./base.conf.js');

module.exports = function (env, argv) {
  return merge(baseConf, {
    mode: "production",
    // 优化
    optimization: {
      providedExports: false,
      usedExports: true,
      concatenateModules: true,
      minimize: true, // 在生成环境是否开启js代码压缩和Tree Shaking，默认 true 开启
      minimizer: [ // 压缩js
        new TerserWebpackPlugin({
          extractComments: false,
          // terserOptions: {
          //   // https://github.com/terser/terser#minify-options
          //   compress: {
          //     warnings: false, // 删除无用代码时是否给出警告
          //     drop_debugger: true, // 删除所有的debugger
          //     // drop_console: true, // 删除所有的console.*
          //     pure_funcs: [''],
          //     // pure_funcs: ['console.log'], // 删除所有的console.log
          //   },
          // }
        }),
      ],
      splitChunks: false,
      // splitChunks: {
      //   chunks: 'all',
      //   minSize: 0,
      //   minChunks: 1,
      //   maxAsyncRequests: 1,
      //   maxInitialRequests: 1,
      //   automaticNameDelimiter: '~',
      //   name: true,
      //   cacheGroups: {
      //     vendors: {
      //       test: /[\\/]node_modules[\\/]/,
      //       priority: -10
      //     },
      //     default: {
      //       minChunks: 2,
      //       priority: -20,
      //       reuseExistingChunk: true
      //     }
      //   }
      // }

    },
    // 不打包的依赖
    // externals: {
    //   jspdf: 'jsPDF',
    //   html2canvas: 'html2canvas',
    // },
    plugins: [
      // 每次构建前清理dist文件夹
      new CleanWebpackPlugin(),
    ],

  });
}
