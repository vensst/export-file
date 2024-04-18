/*
 * @Name: toImage.js
 * @Description:
 * @Date: 2024/4/9 上午10:00
 * @Author: huyafei
 * @LastEditors: huyafei
 * @LastEditTime: 2024/4/9 上午10:00
 */
import html2canvas from "html2canvas"
import FileSaver from "file-saver";

/**
 * 将 html 导出图片
 * @param {HTMLElement} element 需要导出的 html 根节点
 * @param {Object} options 配置项
 * @param {string} options.fileName 文件名，默认："未命名"
 * @param {string} options.imageType 文件后缀类型，默认："png"
 * @param {string} options.isDownload 是否下载，false 返回 blob 格式数据，默认：true
 * @param {Object} options.html2canvas html2canvas 配置
 * @returns {Promise<unknown>}
 */
const toImage = function (element,{
                            fileName = "未命名",
                            imageType = "png",
                            isDownload = true,
                            ...config
                          } = {}) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError("element 为 dom 节点");
  }
  if (!["png", "jpeg", "webp"].includes(imageType)) {
    throw new Error("imageType 必须是 png, jpeg 或 webp");
  }
  return new Promise((resolve, reject) => {
    html2canvas(element, {...(config.html2canvas || {})}).then(canvas => {
      canvas.toBlob(function (blob) {
        if (isDownload) {
          try {
            FileSaver.saveAs(blob, `${fileName}.${imageType}`);
            resolve();
          } catch (e) {
            reject(e);
          }
        } else {
          resolve({canvas, blob});
        }
      });
    }).catch((error) => {
      reject(error);
    });
  });

}
export {
  toImage,
  html2canvas
}
