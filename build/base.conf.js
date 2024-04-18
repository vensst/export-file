/*
 * @Name: base.conf.js
 * @Description:
 * @Date: 2024/4/9 下午1:13
 * @Author: huyafei
 * @LastEditors: huyafei
 * @LastEditTime: 2024/4/9 下午1:13
 */
const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  entry: './src/index.js', // 入口文件
  output: {
    path: path.resolve(__dirname, '../lib'), // 打包后的目录
    filename: '[name].js', // 打包后的文件名称
    clean: true,
    globalObject: 'this',
    // 向外暴露的对象名称，用于通过对象调用的方式调用封装的函数,说明：https://webpack.docschina.org/configuration/output/#outputlibrary
    library: {
      name: 'exportFile',
      type: 'umd',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  resolve: {
    fallback: {
      fs: false
    }
  }
};

module.exports = config;
