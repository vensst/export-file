import toExcel from "./toExcel.js";
import toImage from "./toImage.js";
import toPDF from "./toPDF.js";


/**
 * @typedef {Object} ExportFile
 * @property {Function} toExcel - 将数据导出为 Excel 文件
 * @property {Function} toImage - 将 HTML 元素导出为图片
 * @property {Function} toPDF - 将 HTML 元素导出为 PDF 文件
 */

/**
 * 统一导出工具对象
 * @type {ExportFile}
 */
const ExportFile = {
  /**
   * 将数据导出为 Excel 文件
   */
  toExcel,
  /**
   * 将 HTML 元素导出为图片
   */
  toImage,
  /**
   * 将 HTML 元素导出为 PDF 文件
   */
  toPDF,
};
export {
  toExcel,
  toImage,
  toPDF,
}
export default ExportFile
