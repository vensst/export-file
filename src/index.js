/*
 * @Name: export2excel.js
 * @Description:
 * @Date: 2024/4/9 上午10:00
 * @Author: huyafei
 * @LastEditors: huyafei
 * @LastEditTime: 2024/4/9 上午10:00
 */

export * from "./utils/toExcel.js";
export * from "./utils/toImage.js";
export * from "./utils/toPdf.js";
export * from "./utils/pdfLoader.js";

const Utils = {};

// require.context(检索目录, 是否检索子目录, 检索规则) 读取当前目录下的所有js文件
const modulesFiles = require.context("./utils", false, /\.js$/);
modulesFiles.keys().forEach((modulePath) => {
  Object.assign(Utils, modulesFiles(modulePath));
});
export default Utils;

