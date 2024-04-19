/*
 * @Name: base.conf.js
 * @Description:
 * @Date: 2024/4/9 下午1:13
 * @Author: huyafei
 * @LastEditors: huyafei
 * @LastEditTime: 2024/4/9 下午1:13
 */
const {resolve} = require('path')

const config = {
  entry: {
    main: './src/index.js',
    // 'jspdf': ['jspdf'],
    // 'html2canvas': ['html2canvas'],
    // 'xlsx-js-style': ['xlsx-js-style'],
  },
  output: {
    path: resolve(__dirname, '../lib'), // 打包后的目录
    filename: '[name].js', // 打包后的文件名称
    globalObject: 'this',
    // 向外暴露的对象名称，用于通过对象调用的方式调用封装的函数,说明：https://webpack.docschina.org/configuration/output/#outputlibrary
    library: {
      name: 'exportFile',
      type: 'umd',
    },
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/, // 使用正则表达式匹配所有 .js 文件
        exclude: /node_modules/, // 排除 node_modules 目录下的文件
        use: {
          loader: 'babel-loader', // 使用 Babel 转换 JavaScript 代码
          options: {
            presets: ['@babel/preset-env'] // 使用 Babel 的预设来转换代码
          }
        }
      }
    ]
  },

  resolve: {
    // 别名
    alias: {
      '@': resolve(__dirname, '../src'),
      '@examples': resolve(__dirname, '../examples'),
    }
  },
  plugins: [],
};

module.exports = config;
