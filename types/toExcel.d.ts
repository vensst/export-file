import {Result} from "./common";
import {CellStyle, Range, WritingOptions} from "xlsx-js-style";
/**
 * 重新导出相关类型
 */
export type {Result};
export type {CellStyle};
export type {Range};
export type {WritingOptions};

export interface AOA2SheetOptions extends AOA2SheetOpts {
}

export interface Table2SheetOptions extends Table2SheetOpts {
}

/**
 * 单元格样式映射
 */
export declare interface Styles {
  [key: string]: CellStyle
}

/**
 * 列宽度映射
 */
export declare interface ColWidths {
  [key: string]: number
}

/**
 * 导出Excel选项接口
 */
export declare interface ToExcelOptions {
  /**
   * HTML表格元素
   */
  element?: HTMLElement;
  /**
   * 数据，二维数组
   */
  data?: any[][];
  /**
   * 导出的文件名，默认为 '未命名.xlsx'
   */
  fileName?: string;
  /**
   * 工作表名称，默认为 'Sheet1'
   */
  sheetName?: string;
  /**
   * 样式
   */
  styles?: Styles;
  /**
   * 合并单元格配置
   */
  merges?: (string | Range)[];
  /**
   * 是否自动调整列宽
   */
  isAutoWidth?: boolean;
  /**
   * 列宽度配置
   */
  colWidths?: ColWidths;
  /**
   * table_to_sheet选项
   */
  tableToSheetOptions?: Table2SheetOptions;
  /**
   * aoa_to_sheet选项
   */
  aoaToSheetOptions?: AOA2SheetOptions;
  /**
   * writeFile选项
   */
  writeFileOptions?: WritingOptions;
}

/**
 * 导出Excel文件函数
 * @param options 导出选项
 * @returns Promise对象，成功时返回成功结果，失败时返回错误信息
 */
declare function toExcel(options: ToExcelOptions): Promise<Result>;

export default toExcel;
