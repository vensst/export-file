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

declare interface EncryptionOptions {
  userPassword?: string;
  ownerPassword?: string;
  userPermissions?: ("print" | "modify" | "copy" | "annot-forms")[];
}

declare interface JsPDFOptions {
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


declare interface ToPdfOptions {
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

export { Result, toPDF as default };
export type { EncryptionOptions, Html2CanvasOptions, ImageOptions, ImageType, JsPDFOptions, ToPdfOptions };
