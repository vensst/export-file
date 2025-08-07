import {Html2CanvasOptions, ImageOptions, ImageType, Result} from "./common";

export type {Result}
export type {Html2CanvasOptions}
export type {ImageOptions}
export type {ImageType}

export declare interface EncryptionOptions {
  userPassword?: string;
  ownerPassword?: string;
  userPermissions?: ("print" | "modify" | "copy" | "annot-forms")[];
}

export declare interface JsPDFOptions {
  orientation?: "p" | "portrait" | "l" | "landscape";
  unit?: "pt" | "px" | "in" | "mm" | "cm" | "ex" | "em" | "pc";
  format?: string | number[];
  compress?: boolean;
  precision?: number;
  filters?: string[];
  userUnit?: number;
  encryption?: EncryptionOptions;
  putOnlyUsedFonts?: boolean;
  hotfixes?: string[];
  floatPrecision?: number | "smart";
}


export declare interface ToPdfOptions {
  /**
   * PDF文件名，默认："未命名.pdf"
   */
  fileName?: string;
  /**
   * 是否分页，默认：true
   */
  isPage?: boolean;
  /**
   * 页边距，可以是一个数字或一个数组，默认：0
   * 数组：[上右下左]，[上下,左右]，[上,左右,下]，[上,右,下,左]
   */
  margin?: number | number[];
  /**
   * 图片配置项
   */
  image?: ImageOptions;
  /**
   * html2canvas 的配置项
   */
  html2canvas?: Html2CanvasOptions;
  /**
   * jsPDF 的配置项
   */
  jsPDF?: JsPDFOptions;
}

/**
 * 将HTML元素转换为PDF文件
 * @param element 需要转换为 PDF 的 HTML 元素
 * @param options 可选配置对象，包含 html2canvas 和 jsPDF 的配置项
 * @returns 返回一个 Promise，resolve 返回结果，reject 返回错误信息
 */
declare function toPDF(element: HTMLElement, options: ToPdfOptions): Promise<Result>;

export default toPDF;
