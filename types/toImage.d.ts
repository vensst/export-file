import {Html2CanvasOptions, ImageOptions, ImageType, Result} from "./common";

export type {Result}
export type {Html2CanvasOptions}
export type {ImageOptions}
export type {ImageType}

export declare interface ToImageOptions {
  /**
   * 文件名，默认："未命名"
   */
  fileName?: string;
  /**
   * 图片配置项
   */
  image?: ImageOptions;
  /**
   * html2canvas 配置
   */
  html2canvas?: Html2CanvasOptions;
}

/**
 * 将 html 导出图片
 * @param element 需要导出的 html 根节点
 * @param options 配置项
 * @returns Promise对象，成功时返回成功结果，失败时返回错误信息
 */
declare function toImage(element: HTMLElement, options: ToImageOptions): Promise<Result>;

export default toImage;
