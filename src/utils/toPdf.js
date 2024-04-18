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

/**
 * 将 html 导出 pdf（只能导出纵向 a4 纸大小的 pdf）或者使用 PdfLoader 导出
 * @param {HTMLElement} element 需要导出的 html 根节点
 * @param {Object} options 配置项
 * @param {string} options.fileName 文件名，默认："未命名"
 * @param {Object} options.padding 边距 默认：{top: 10, right: 10, bottom: 10, left: 10}
 * @param {boolean} options.isPage 是否分页，默认：true
 * @param {Object} options.html2canvas html2canvas 配置
 * @param {Object} options.jspdf  jspdf 配置(除了orientation、unit、format其它可配)
 * @param config
 */
const toPdf = function (element, {
  fileName = "未命名",
  padding,
  isPage = true,
  ...config
}) {
  if (!(element instanceof HTMLElement)) {
    throw new TypeError("element 为 dom 节点");
  }

  const pd = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
    ...padding || {}
  }
  const h2cc = {
    logging: false,
    allowTaint: false,
    useCORS: true,
    scale: 4, //按比例增加分辨率
    ...config.html2canvas || {}
  }
  const pdfc = {
    ...config.jspdf || {},
    orientation: 'p', // p-纵向（默认），l-横向
    unit: 'pt', // mm-毫米（默认），pt-磅
    format: 'a4', // a4-A4纸（默认），a3-A3纸,a4纸的尺寸(pt[595.28,841.89],mm[210,297])
  }

  html2canvas(element, {
    ...h2cc
  }).then((canvas) => {
    // 获取 canvas 的宽高
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;

    // a4纸的尺寸(pt[595.28,841.89],mm[210,297])，html页面生成的canvas在pdf中图片的宽高
    const a4w = 595.28;
    const a4h = 841.89;

    let pdf = null
    if (isPage) {
      pdf = new jsPDF({...pdfc});
      const ctx = canvas.getContext('2d');
      // 计算图片在pdf中显示的宽高
      const a4w_c = a4w - (pd.left || 0) - (pd.right || 0);
      const a4h_c = a4h - (pd.top || 0) - (pd.bottom || 0);
      const imgHeight = Math.floor(a4h_c * contentWidth / a4w_c); // 按A4显示比例换算一页图像的像素高度
      let renderedHeight = 0;

      while (renderedHeight < contentHeight) {
        const page = document.createElement('canvas');
        page.width = contentWidth;
        page.height = Math.min(imgHeight, contentHeight - renderedHeight);// 可能内容不足一页

        // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
        page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, contentWidth, Math.min(imgHeight, contentHeight - renderedHeight)), 0, 0);
        pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', pd.left, pd.top, a4w_c, Math.min(a4h_c, a4w_c * page.height / page.width));

        renderedHeight += imgHeight;
        if (renderedHeight < contentHeight) {
          pdf.addPage();// 如果后面还有内容，添加一个空页
        }
      }
    } else {
      // 图片宽高
      let imgWidth = a4w;
      let imgHeight = imgWidth / contentWidth * contentHeight;
      pdf = new jsPDF({...pdfc, format: [a4w, imgHeight + (pd.top || 0) + (pd.bottom || 0)]});
      let pageData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(pageData, 'JPEG', pd.left || 0, pd.top || 0, imgWidth, imgHeight);
    }

    pdf.save(fileName)
  })

}

export {
  toPdf,
  jsPDF
}
