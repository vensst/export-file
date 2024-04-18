/*
 * @Name: prod.conf.js
 * @Description:
 * @Date: 2024/4/9 下午1:13
 * @Author: huyafei
 * @LastEditors: huyafei
 * @LastEditTime: 2024/4/9 下午1:13
 */
const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
//js压缩 webpack5自带
const TerserWebpackPlugin = require('terser-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

const baseConf = require('./base.conf.js');

module.exports = function(env, argv) {
  return merge(baseConf, {
    mode: "production",
    plugins: [
      // 每次构建前清理dist文件夹
      new CleanWebpackPlugin(),
      new NodePolyfillPlugin()
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserWebpackPlugin({
          extractComments: false
        }),
      ],
    },
  });
}
