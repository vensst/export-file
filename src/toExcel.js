import XLSX from "xlsx-js-style";
import {Result, validatePlainObject} from "./utils";


/**
 * 计算工作表各列的自适应宽度
 * @param {Object} ws - 工作表对象
 * @returns {Array} 每列的宽度配置数组
 */
function calculateColWidths(ws) {
  const colWidths = [];
  const range = XLSX.utils.decode_range(ws['!ref']);

  for (let C = range.s.c; C <= range.e.c; C++) {
    let maxWidth = 10; // 最小宽度

    for (let R = range.s.r; R <= range.e.r; R++) {
      const cellRef = XLSX.utils.encode_cell({r: R, c: C});
      if (ws[cellRef]) {
        const cell = ws[cellRef]; // {v: 'xxx', t: 's'}
        let cellWidth = 10;

        if (cell.v != null) {
          // 根据内容长度计算宽度
          const cellValue = cell.v.toString();
          // 中文字符通常需要更宽的空间，这里将中文字符计为2个单位宽度
          const chineseCharCount = (cellValue.match(/[\u4e00-\u9fa5]/g) || []).length;
          const otherCharCount = cellValue.length - chineseCharCount;
          cellWidth = Math.max(chineseCharCount * 2 + otherCharCount, 10);
        }
        maxWidth = Math.max(maxWidth, cellWidth);
      }
    }

    // 限制最大宽度
    maxWidth = Math.min(maxWidth, 50);
    colWidths[C] = {wch: maxWidth};
  }

  return colWidths;
}

/**
 * 导出Excel文件
 * @param {Object} options - 导出选项
 * @param {HTMLElement} [options.element] - HTML表格元素
 * @param {Array} [options.data=[]] - 二维数组数据
 * @param {string} [options.fileName='未命名.xlsx'] - 导出文件名
 * @param {string} [options.sheetName='Sheet1'] - 工作表名称
 * @param {Object} [options.styles={}] - 单元格样式配置
 * @param {Array} [options.merges=[]] - 合并单元格配置
 * @param {boolean} [options.isAutoWidth=false] - 是否自动调整列宽
 * @param {Object} [options.colWidths] - 列宽度配置
 * @param {Object} [options.tableToSheetOptions={}] - table转sheet选项
 * @param {Object} [options.aoaToSheetOptions={}] - 数组转sheet选项
 * @param {Object} [options.writeFileOptions={}] - 写入文件选项
 * @returns {Promise<Result>} 响应结果
 */
export default async function toExcel(options = {}) {
  if (options) {
    validatePlainObject(options, 'options');
  }
  if (options.styles) {
    validatePlainObject(options.styles, 'options.styles');
  }
  if (options.colWidths) {
    validatePlainObject(options.colWidths, 'options.colWidths');
  }
  if (options.tableToSheetOptions) {
    validatePlainObject(options.tableToSheetOptions, 'options.tableToSheetOptions');
  }
  if (options.aoaToSheetOptions) {
    validatePlainObject(options.aoaToSheetOptions, 'options.aoaToSheetOptions');
  }
  if (options.writeFileOptions) {
    validatePlainObject(options.writeFileOptions, 'options.writeFileOptions');
  }
  const {
    element,
    fileName = '未命名.xlsx',
    sheetName = 'Sheet1',
    data = [],
    styles = {},
    merges = [],
    isAutoWidth = false,
    colWidths,
    tableToSheetOptions = {},
    aoaToSheetOptions = {},
    writeFileOptions = {}
  } = {...options}

  // 1.创建工作簿
  const wb = XLSX.utils.book_new();

  // 2.创建工作表
  let ws;
  if (element) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError(`element must be of type HTMLElement`);
    }

    // 表格html元素转工作表（https://docs.sheetjs.com/docs/api/utilities/html#html-table-input）
    ws = XLSX.utils.table_to_sheet(element, tableToSheetOptions)

  } else if (data && data.length) {
    // 数组数据转工作表（https://docs.sheetjs.com/docs/api/utilities/array#array-of-arrays-input）
    ws = XLSX.utils.aoa_to_sheet(data, aoaToSheetOptions);
  } else {
    throw new TypeError(`element or data must be provided`);
  }
  // 设置单元格样式
  if (styles && Object.keys(styles).length > 0) {
    Object.keys(styles).forEach(cell => {
      if (/:/.test(cell)) {
        const {s, e} = XLSX.utils.decode_range(cell);
        // 添加样式
        for (let row = s.r; row <= e.r; row++) {
          for (let col = s.c; col <= e.c; col++) {
            // 范围格式 {r:0,c:0} 转 单元格地址格式 A1
            const _cell = XLSX.utils.encode_cell({r: row, c: col});
            try {
              ws[_cell].s = styles[cell];
            } catch (e) {
              ws[_cell] = {
                t: 's',
                v: '',
                s: styles[cell]
              }
            }
          }
        }
      } else {
        if (ws[cell]) {
          ws[cell].s = styles[cell];
        }
      }
    });
  }
  // 合并单元格
  if (merges && merges.length > 0) {
    const ms = []
    merges.forEach(item => {
      // 判断是否是字符串或对象类型
      if (typeof item === 'string') {
        // 单元格地址格式 A1:F10 转 范围格式 {e:{c:5,r:9},s:{c:0,:0}}
        ms.push(XLSX.utils.decode_range(item));
      }
      if (Object.prototype.toString.call(item) === '[object Object]') {
        ms.push(item);
      }

    });
    ws['!merges'] = ms;
  }
  // 设置列宽度
  if (isAutoWidth) {
    // 计算自适应宽度
    ws['!cols'] = calculateColWidths(ws);
  } else {
    if (colWidths && Object.keys(colWidths).length > 0) {
      ws['!cols'] = [];
      Object.keys(colWidths).forEach(col => {
        const colIndex = XLSX.utils.decode_col(col);
        ws['!cols'][colIndex] = {wch: colWidths[col]};
      });
    }
  }

  // 3.将工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // 4.导出文件（https://docs.sheetjs.com/docs/api/write-options）
  try {
    XLSX.writeFile(wb, fileName, writeFileOptions);
    return Promise.resolve(Result.success())
  } catch (e) {
    return Promise.reject(Result.error(e.message))
  }
}
