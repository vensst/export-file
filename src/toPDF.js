/*
 * @Name: toPdf.js
 * @Description:
 * @Date: 2024/4/9 上午10:00
 * @Author: huyafei
 * @LastEditors: huyafei
 * @LastEditTime: 2024/4/9 上午10:00
 */
import html2canvas from "html2canvas"
import {jsPDF} from "jspdf";
import {getValidNumber, ImageTypeMap, Result, validatePlainObject} from "./utils"

/**
 * 将HTML元素转换为PDF文件
 *
 * @param {HTMLElement} element - 需要转换为 PDF 的 HTML 元素
 * @param {Object} options - 可选配置对象，包含 html2canvas 和 jspdf 的配置项
 * @param {string} [options.fileName] - PDF文件名，默认：'未命名.pdf'
 * @param {Object} [options.isPage] - 是否分页，默认：true
 * @param {Number|Array} [options.margin] - 页边距，可以是一个数字或一个数组，默认：0，数组：[上右下左]，[上下,左右]，[上,左右,下]，[上,右,下,左]
 * @param {Object} [options.image] - 图片配置项
 * @param {Object} [options.image.type] - 图片类型， 默认：'jpeg'，可选值：'jpeg'、'png'、'webp'，
 * @param {number} [options.image.quality] - 图片质量，默认：0.95，范围：0-1
 * @param {Object} [options.html2canvas] - html2canvas 的配置项
 * @param {Object} [options.jsPDF] - jsPDF 的配置项
 * @returns {Promise<Result>} 响应结果
 */
export default async function toPDF(element, options = {}) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError(`element must be of type HTMLElement`);
  }

  if (options) {
    validatePlainObject(options, 'options');
  }
  if (options.image) {
    validatePlainObject(options.image, 'options.image')
  }
  if (options.html2canvas) {
    validatePlainObject(options.html2canvas, 'options.html2canvas')
  }
  if (options.jsPDF) {
    validatePlainObject(options.jsPDF, 'options.jsPDF')
  }

  const margin = [0, 0, 0, 0]
  const setMarginValue = (index, value) => {
    margin[index] = getValidNumber(value);
  };

  if (Array.isArray(options.margin)) {
    const len = options.margin.length;
    const values = options.margin.map(val => getValidNumber(val));
    if (len === 1) {
      // 上右下左
      setMarginValue(0, values[0]);
      setMarginValue(1, values[0]);
      setMarginValue(2, values[0]);
      setMarginValue(3, values[0]);
    } else if (len === 2) {
      // 上下、左右
      setMarginValue(0, values[0]);
      setMarginValue(2, values[0]);
      setMarginValue(1, values[1]);
      setMarginValue(3, values[1]);
    } else if (len === 3) {
      // 上、左右、下
      setMarginValue(0, values[0]);
      setMarginValue(2, values[2]);
      setMarginValue(1, values[1]);
      setMarginValue(3, values[1]);
    } else if (len >= 4) {
      // 上、右、下、左
      setMarginValue(0, values[0]);
      setMarginValue(1, values[1]);
      setMarginValue(2, values[2]);
      setMarginValue(3, values[3]);
    }
  } else {
    const val = getValidNumber(options.margin);
    setMarginValue(0, val);
    setMarginValue(1, val);
    setMarginValue(2, val);
    setMarginValue(3, val);
  }

  // 图片处理选项
  const image_Opts = {
    type: options.image ? (ImageTypeMap[options.image.type] || ImageTypeMap.jpeg) : ImageTypeMap.jpeg,
    quality: getValidNumber(options.image?.quality, 0.95),
  }
  // jsPDF配置项
  const jsPDF_Opts = {
    orientation: 'p', // p-纵向（默认），l-横向
    unit: 'mm', // mm-毫米（默认），pt-磅
    format: 'a4', // a4-A4纸（默认a4），a3-A3纸,a4纸的尺寸(pt[595.28,841.89],mm[210,297])
    ...(options.jsPDF || {})
  }
  try {
    // 使用html2canvas将HTML元素转换为canvas
    const canvas = await html2canvas(element, {
      ...(options.html2canvas || {})
    })
    // 获取 canvas 的宽高
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;

    let pdf = new jsPDF({...jsPDF_Opts})
    // 获取pdf宽高,默认a4，a4纸的尺寸(pt[595.28,841.89],mm[210,297])，html页面生成的canvas在pdf中图片的宽高
    const pdf_w = pdf.internal.pageSize.getWidth();
    const pdf_h = pdf.internal.pageSize.getHeight();

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }
    // pdf实际内容宽高（去除边距）
    const pdf_c_w = pdf_w - margin[3] - margin[1];
    const pdf_c_h = pdf_h - margin[0] - margin[2];


    if (options.isPage ?? true) {
      const imgHeight = Math.floor(pdf_c_h * contentWidth / pdf_c_w); // 按A4显示比例换算一页图像的像素高度
      let renderedHeight = 0;
      // 循环将canvas内容分页添加到pdf中
      while (renderedHeight < contentHeight) {
        const page = document.createElement('canvas');
        page.width = contentWidth;
        page.height = Math.min(imgHeight, contentHeight - renderedHeight);// 可能内容不足一页

        // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
        page.getContext('2d', {willReadFrequently: true}).putImageData(ctx.getImageData(0, renderedHeight, contentWidth, Math.min(imgHeight, contentHeight - renderedHeight)), 0, 0);
        let pageData = page.toDataURL(`image/${image_Opts.type}`, image_Opts.quality);
        pdf.addImage(pageData, image_Opts.type.toUpperCase(), margin[3], margin[0], pdf_c_w, Math.min(pdf_c_h, pdf_c_w * page.height / page.width));

        renderedHeight += imgHeight;
        if (renderedHeight < contentHeight) {
          pdf.addPage();// 如果后面还有内容，添加一个空页
        }
      }
    } else {
      // 果不分页，计算到pdf中图片宽高（图片缩放后宽高）
      let imgWidth = pdf_c_w;
      let imgHeight = imgWidth / contentWidth * contentHeight;
      // 创建一个新pdf文件
      pdf = new jsPDF({...jsPDF_Opts, format: [pdf_w, imgHeight + margin[0] + margin[2]]})
      let pageData = canvas.toDataURL(`image/${image_Opts.type}`, image_Opts.quality);
      pdf.addImage(pageData, image_Opts.type.toUpperCase(), margin[3], margin[0], imgWidth, imgHeight);
    }

    pdf.save(`${options.fileName || '未命名'}.pdf`)
    return Promise.resolve(Result.success())
  } catch (error) {
    return Promise.reject(Result.error((error.message)))
  }
}
