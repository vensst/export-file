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
import {getValidNumber, ImageTypeMap, Result, validatePlainObject} from "./utils";

/**
 * 将 html 导出图片
 * @param {HTMLElement} element 需要导出的 html 根节点
 * @param {Object} options 配置项
 * @param {string} options.fileName 文件名，默认："未命名"
 * @param {Object} [options.image] - 图片配置项
 * @param {Object} [options.image.type] - 图片类型， 默认：'jpeg'，可选值：'jpeg'、'png'、'webp'，
 * @param {number} [options.image.quality] - 图片质量，默认：0.95，范围：0-1
 * @param {Object} options.html2canvas html2canvas 配置
 * @returns {Promise<Result>} 响应结果
 */
export default async function toImage(element, options = {}) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError(`element must be of type HTMLElement`);
  }
  if (options) {
    validatePlainObject(options, 'options')
  }
  if (options.html2canvas) {
    validatePlainObject(options.html2canvas, 'options.html2canvas')
  }
  if (options.image) {
    validatePlainObject(options.image, 'options.image')
  }
  // 图片处理选项
  const image_Opts = {
    type: options.image ? (ImageTypeMap[options.image.type] || ImageTypeMap.jpeg) : ImageTypeMap.jpeg,
    quality: getValidNumber(options.image?.quality, 0.95),
  }
  const html2canvasConfig = {...(options.html2canvas || {})};
  const fileName = `${options.fileName || '未命名'}.${image_Opts.type}`;

  try {
    const canvas = await html2canvas(element, html2canvasConfig)
    return new Promise((resolve, reject) => {
      canvas.toBlob(function (blob) {
        if (!blob) {
          Promise.reject(Result.error('Failed to generate image blob'));
          return
        }
        try {
          FileSaver.saveAs(blob, fileName);
          resolve(Result.success())
        } catch (e) {
          reject(Result.error((e.message)))
        }
      }, image_Opts.type, image_Opts.quality);
    });

  } catch (e) {
    return Promise.reject(Result.error((e.message)));
  }
}
