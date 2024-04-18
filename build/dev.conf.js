/*
 * @Name: dev.conf.js
 * @Description:
 * @Date: 2024/4/9 下午1:13
 * @Author: huyafei
 * @LastEditors: huyafei
 * @LastEditTime: 2024/4/9 下午1:13
 */
const {merge} = require('webpack-merge');
const baseConf = require('./base.conf.js');

module.exports = function(env, argv) {
  return merge(baseConf, {
    mode: "development",
  });
}


