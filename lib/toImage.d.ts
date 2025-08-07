declare type ImageType = 'jpeg' | 'png' | 'webp'

declare interface ImageOptions {
  /**
   * 图片类型，默认：'jpeg'
   */
  type?: ImageType
  /**
   * 图片质量，默认：0.95，范围：0-1
   */
  quality?: number
}

declare interface Html2CanvasOptions {
  /** Whether to parse and render the element asynchronously */
  async?: boolean;

  /** Whether to allow cross-origin images to taint the canvas */
  allowTaint?: boolean;

  /** Canvas background color, if none is specified in DOM. Set null for transparent */
  backgroundColor?: string | null;

  /** Existing canvas element to use as a base for drawing on */
  canvas?: any;

  /** Whether to use ForeignObject rendering if the browser supports it */
  foreignObjectRendering?: boolean;

  /** Predicate function which removes the matching elements from the render. */
  ignoreElements?: (element: HTMLElement) => boolean;

  /** Timeout for loading images, in milliseconds. Setting it to 0 will result in no timeout. */
  imageTimeout?: number;

  /** Whether to render each letter seperately. Necessary if letter-spacing is used. */
  letterRendering?: boolean;

  /** Whether to log events in the console. */
  logging?: boolean;

  /** Callback function which is called when the Document has been cloned for rendering, can be used to modify the contents that will be rendered without affecting the original source document. */
  onclone?: { (doc: HTMLDocument): void };

  /** Url to the proxy which is to be used for loading cross-origin images. If left empty, cross-origin images won't be loaded. */
  proxy?: string;

  /** Whether to cleanup the cloned DOM elements html2canvas creates temporarily */
  removeContainer?: boolean;

  /** The scale to use for rendering. Defaults to the browsers device pixel ratio. */
  scale?: number;

  /** Use svg powered rendering where available (FF11+). */
  svgRendering?: boolean;

  /** Whether to test each image if it taints the canvas before drawing them */
  taintTest?: boolean;

  /** Whether to attempt to load cross-origin images as CORS served, before reverting back to proxy. */
  useCORS?: boolean;

  /** Define the width of the canvas in pixels. If null, renders with full width of the window. */
  width?: number;

  /** Define the heigt of the canvas in pixels. If null, renders with full height of the window. */
  height?: number;

  /** Crop canvas x-coordinate */
  x?: number;

  /** Crop canvas y-coordinate */
  y?: number;

  /** The x-scroll position to used when rendering element, (for example if the Element uses position: fixed ) */
  scrollX?: number;

  /** The y-scroll position to used when rendering element, (for example if the Element uses position: fixed ) */
  scrollY?: number;

  /** Window width to use when rendering Element, which may affect things like Media queries */
  windowWidth?: number;

  /** Window height to use when rendering Element, which may affect things like Media queries */
  windowHeight?: number;
}

declare interface SuccessResponse<T> {
  code: number;
  data: T;
  message: string;
}

declare interface ErrorResponse {
  code: number;
  message: string;
}

/**
 * 用于创建标准化响应对象的结果类
 */
declare class Result {
  static success<T>(data: T, message?: string): SuccessResponse<T>;

  static error(message?: string): ErrorResponse;
}

declare interface ToImageOptions {
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

export { Result, toImage as default };
export type { Html2CanvasOptions, ImageOptions, ImageType, ToImageOptions };
