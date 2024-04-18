/*
 * @Name: toExcel.js
 * @Description:
 * @Date: 2024/4/9 上午10:00
 * @Author: huyafei
 * @LastEditors: huyafei
 * @LastEditTime: 2024/4/9 上午10:00
 */
import {deepClone} from "@vensst/js-toolkit"
import * as XLSX from "xlsx/xlsx.mjs";
import XLSXJsStyle from "xlsx-js-style";
import FileSaver from "file-saver";

// 样式参考 https://www.npmjs.com/package/xlsx-js-style?activeTab=readme
const BORDER_STYLE = {
  top: {
    style: "thin",
  },
  bottom: {
    style: "thin",
  },
  left: {
    style: "thin",
  },
  right: {
    style: "thin",
  },
};
const HEADER_STYLE = {
  // border: BORDER, // 边框
  font: {
    // name: "微软雅黑",
    // sz: 16, // 字体大小
    // color: { rgb: "000000" }, // 字体颜色
    bold: true, // 粗体
    // italic: false, // 斜体
    // underline: false, // 下划线
  },
  // fill: {
  //   fgColor: { rgb: "C5D9F1" }, // 填充颜色
  // },
  alignment: {
    horizontal: "left",
    vertical: "center",
    // wrapText: false, // 自动换行
  },
};
const CONTENT_STYLE = {
  font: {
    // sz: 14,
    bold: false,
  },
  alignment: {
    horizontal: "left",
    vertical: "center",
  },
}
const FOOTER_STYLE = {
  font: {
    // sz: 14,
    bold: false,
  },
  alignment: {
    horizontal: "left",
    vertical: "center",
  },
}

function s2ab(s) {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

/**
 *
 * @param ws
 * @param {Object} range 单元格 例如：{r: row, c: col}
 * @param {Object} style 样式
 */
function setCellStyle(ws, range, style) {
  // 范围格式 {r:0,c:0} 转 单元格地址格式 A1
  const cell = XLSX.utils.encode_cell(range);
  try {
    ws[cell].s = deepClone(style);
  } catch (e) {
    ws[cell] = {
      t: 's',
      v: '',
      s: style
    }
  }
}

/**
 * 批量设置单元格样式
 * @param ws
 * @param {Object} range 范围格式数据 例如：{e:{c:5,r:9},s:{c:0,:0}}
 * @param {Object} style 样式
 */
function batchSetCellStyle(ws, range, style) {
  const {e, s} = range
  for (let row = s.r; row <= e.r; row++) {
    for (let col = s.c; col <= e.c; col++) {
      setCellStyle(ws, {r: row, c: col}, style)
    }
  }
}

/**
 * 设置表头样式
 */
function setHeaderStyle({ws, style}) {
  const {header} = ws._source
  batchSetCellStyle(ws, {
    s: {r: 0, c: 0},
    e: {r: header.length - 1, c: header[0].length - 1}
  }, style)
}

/**
 * 设置内容样式
 */
function setContentStyle({ws, style}) {
  const {header, footer} = ws._source
  // 单元格地址格式 A1:F10 转 范围格式 {e:{c:5,r:9},s:{c:0,:0}}
  const range = XLSX.utils.decode_range(ws['!ref']);
  batchSetCellStyle(ws, {
    s: {r: range.s.r + header.length, c: range.s.c},
    e: {r: range.e.r - footer.length, c: range.e.c}
  }, style)
}

/**
 * 设置表尾样式
 */
function setFooterStyle({ws, style}) {
  const {header, data} = ws._source
  // 单元格地址格式 A1:F10 转 范围格式 {e:{c:5,r:9},s:{c:0,:0}}
  const range = XLSX.utils.decode_range(ws['!ref']);
  batchSetCellStyle(ws, {
    s: {r: range.s.r + header.length + data.length, c: range.s.c},
    e: {r: range.e.r, c: range.e.c}
  }, style)
}

/**
 * 设置自定义单元格样式
 */
function setCustomCellStyle({ws, cell, style}) {
  if (/:/.test(cell)) {
    const range = XLSX.utils.decode_range(cell);
    batchSetCellStyle(ws, {
      s: {r: range.s.r, c: range.s.c},
      e: {r: range.e.r, c: range.e.c}
    }, style)
  } else {

    try {
      ws[cell].s = deepClone(style);
    } catch (e) {
      ws[cell] = {
        t: 's',
        v: '',
        s: style
      }
    }
  }
}

/**
 * 导出 excel
 * @param {Object} options 导出 excel 配置项
 * @param {HTMLElement} options.element 需要导出的 html 根节点
 * @param {Array} options.multiHeader 多级表头(二维数组)
 * @param {Array} options.title 标题
 * @param {Array} options.header 表头
 * @param {Array} options.data 数据
 * @param {Array} options.footer 表尾
 * @param {Array} options.merges 合并单元格（单元格地址格式，例如:["A10:E10"]）
 * @param {String} options.fileName 文件名
 * @param {String} options.bookType 文件类型
 * @param {Boolean} options.autoWidth 是否自动宽度
 * @param {Object} options.headerStyle 表头样式
 * @param {Object} options.contentStyle 内容样式
 * @param {Array} options.customCellStyle 自定义单元格样式
 */
const toExcel = function ({
                            element,
                            multiHeader = [], // 多级表头，二维数组
                            title = [], // 标题
                            header = [], // 表头
                            data = [],
                            footer = [],
                            merges = [],
                            fileName = "未命名",
                            bookType = "xlsx",
                            autoWidth = true,
                            headerStyle,
                            contentStyle,
                            footerStyle,
                            customCellStyle,
                          } = {}) {
  let wsNo = 1;
  const wsName = "Sheet";
  headerStyle = headerStyle || HEADER_STYLE
  contentStyle = contentStyle || CONTENT_STYLE;
  footerStyle = footerStyle || FOOTER_STYLE;

  // 表头
  const _header = []
  header && header.length && _header.unshift(header);
  title && title.length && _header.unshift(title);
  for (let i = multiHeader.length - 1; i > -1; i--) {
    _header.unshift(multiHeader[i]);
  }
  const _data = [..._header, ...data || [], ...footer || []] // 二维数组

  // 1.创建工作簿
  const wb = XLSX.utils.book_new();

  // 2.创建工作表
  let ws = null
  if (element) {
    if (!(element instanceof HTMLElement)) {
      throw new TypeError("element 为 dom 节点");
    }
    ws = XLSX.utils.table_to_sheet(element, {skipHeader: true})

  } else {
    ws = XLSX.utils.aoa_to_sheet(_data, {skipHeader: true});
  }

  // 分别存储一些源数据
  ws._source = {
    header: _header,
    data,
    footer,
  }

  // 表格整体头部样式
  if (_header.length && _header[0].length) {
    setHeaderStyle({ws, style: headerStyle})
  }
  // 表格内容样式
  // if (data && data.length && data[0].length) {
    setContentStyle({ws, style: contentStyle})
  // }
  // 表格尾部样式
  if (footer && footer.length && footer[0].length) {
    setFooterStyle({ws, style: footerStyle})
  }
  // 自定义单元格样式
  if (customCellStyle && customCellStyle.length) {
    for (let k=0; k < customCellStyle.length; k++ ){
      const {cell, style} = customCellStyle[k]
      // 判断cell是否是字符串
      if (typeof cell === 'string') {
        setCustomCellStyle({ws, cell, style})
      } else if (Array.isArray(cell)) {
        for (let i = 0; i < cell.length; i++) {
          setCustomCellStyle({ws, cell: cell[i], style})
        }
      }
    }
  }

  /*
   *
   * 合并单元格
   * decode_range 转换单元格的范围，例如单元格地址B5用对象{c:1, r:4}表示，参考：https://github.com/rockboom/SheetJS-docs-zh-CN
   *
   * 原来是用这种方式 ws["!merges"] = merges，merges格式 [{s:{c:1,r:4},e:{c:1,r:4}]
   * */
  if (merges && merges.length) {
    if (!ws["!merges"]) ws["!merges"] = [];
    merges.forEach(item => {
      ws["!merges"].push(XLSX.utils.decode_range(item));
    });
  }

  /*
  * 单元格宽度自适应。wch：存储字符宽度
  * */
  if (autoWidth) {
    const colWidth = _data.map(row =>
        row.map(val => {
          /*先判断是否为null/undefined*/
          if (val == null) {
            return {
              wch: 10
            };
          } else if (val.toString().charCodeAt(0) > 255) {
            /*再判断是否为中文*/
            return {
              wch: val.toString().length * 2 + 5
            };
          } else {
            return {
              wch: val.toString().length + 5
            };
          }
        })
    );
    /*以第一行为初始值*/
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j]["wch"] < colWidth[i][j]["wch"]) {
          result[j]["wch"] = colWidth[i][j]["wch"];
        }
      }
    }
    ws["!cols"] = result;
  }

  // 工作表添加到工作簿
  XLSX.utils.book_append_sheet(wb, ws, `${wsName + wsNo}`);

  // 导出Excel,将 workbook 对象转换为二进制数据流
  let wbout = XLSXJsStyle.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary',
  })
  try {
    FileSaver.saveAs(new Blob([s2ab(wbout)], {
      type: 'application/octet-stream'
    }), `${fileName}.${bookType}`);
  } catch (e) {
    console.log(e);
  }
};

export {
  toExcel,
  XLSX,
  XLSXJsStyle,
  FileSaver,
}

