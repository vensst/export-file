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

/** Basic File Properties */
interface Properties {
	/** Summary tab "Title" */
	Title?: string;
	/** Summary tab "Subject" */
	Subject?: string;
	/** Summary tab "Author" */
	Author?: string;
	/** Summary tab "Manager" */
	Manager?: string;
	/** Summary tab "Company" */
	Company?: string;
	/** Summary tab "Category" */
	Category?: string;
	/** Summary tab "Keywords" */
	Keywords?: string;
	/** Summary tab "Comments" */
	Comments?: string;
	/** Statistics tab "Last saved by" */
	LastAuthor?: string;
	/** Statistics tab "Created" */
	CreatedDate?: Date;
}

interface CommonOptions {
	/**
	 * If true, throw errors when features are not understood
	 * @default false
	 */
	WTF?: boolean;

	/**
	 * When reading a file with VBA macros, expose CFB blob to `vbaraw` field
	 * When writing BIFF8/XLSB/XLSM, reseat `vbaraw` and export to file
	 * @default false
	 */
	bookVBA?: boolean;

	/**
	 * When reading a file, store dates as type d (default is n)
	 * When writing XLSX/XLSM file, use native date (default uses date codes)
	 * @default false
	 */
	cellDates?: boolean;

	/**
	 * Create cell objects for stub cells
	 * @default false
	 */
	sheetStubs?: boolean;

	/**
	 * When reading a file, save style/theme info to the .s field
	 * When writing a file, export style/theme info
	 * @default false
	 */
	cellStyles?: boolean;

	/**
	 * If defined and file is encrypted, use password
	 * @default ''
	 */
	password?: string;
}

interface SheetOption {
	/**
	 * Name of Worksheet (for single-sheet formats)
	 * @default ''
	 */
	sheet?: string;
}

/** Options for write and writeFile */
interface WritingOptions extends CommonOptions, SheetOption {
	/** Output data encoding */
	type?: "base64" | "binary" | "buffer" | "file" | "array" | "string";

	/**
	 * Generate Shared String Table
	 * @default false
	 */
	bookSST?: boolean;

	/**
	 * File format of generated workbook
	 * @default 'xlsx'
	 */
	bookType?: BookType;

	/**
	 * Use ZIP compression for ZIP-based formats
	 * @default false
	 */
	compression?: boolean;

	/**
	 * Suppress "number stored as text" errors in generated files
	 * @default true
	 */
	ignoreEC?: boolean;

	/** Override workbook properties on save */
	Props?: Properties;

	/** Base64 encoding of NUMBERS base for exports */
	numbers?: string;
}

/**
 * Type of generated workbook
 * @default 'xlsx'
 */
type BookType =
	| "xlsx"
	| "xlsm"
	| "xlsb"
	| "xls"
	| "xla"
	| "biff8"
	| "biff5"
	| "biff2"
	| "xlml"
	| "ods"
	| "fods"
	| "csv"
	| "txt"
	| "sylk"
	| "slk"
	| "html"
	| "dif"
	| "rtf"
	| "prn"
	| "eth"
	| "dbf";

/** Simple Cell Address */
interface CellAddress {
	/** Column number */
	c: number;
	/** Row number */
	r: number;
}

/** Range object (representing ranges like "A1:B2") */
interface Range {
	/** Starting cell */
	s: CellAddress;
	/** Ending cell */
	e: CellAddress;
}

/** Style-Color object [xlsx-js-style] */
interface CellStyleColor {
	/**
	 * RGB color value
	 * @example 'FF0000' // 100% red
	 */
	rgb?: string;
	/**
	 * Theme color index
	 * - optinally, include a `tint` value
	 * - range 0-n
	 * @example 4 // Theme color index 4 ("Blue, Accent 1")
	 */
	theme?: number;
	/**
	 * Theme color tint percent
	 * - only works when used with `theme`
	 * - range: -1.0 to 1.0
	 * @example 0.4 // tint lighter by 40% ("Blue, Accent 1, Lighter 40%")
	 * @example -0.5 // tint darker by 50% ("Blue, Accent 1, Darker 50%")
	 */
	tint?: number;
}

/** Style-border object [xlsx-js-style] */
type BorderType =
	| "dashDot"
	| "dashDotDot"
	| "dashed"
	| "dotted"
	| "hair"
	| "medium"
	| "mediumDashDot"
	| "mediumDashDotDot"
	| "mediumDashed"
	| "slantDashDot"
	| "thick"
	| "thin";

/** Style object [xlsx-js-style] */
interface CellStyle {
	alignment?: {
		/**
		 * Horizontal alignment
		 * @default 'left'
		 */
		horizontal?: "left" | "center" | "right";
		/**
		 * Vertical alignment
		 * @default 'bottom'
		 */
		vertical?: "top" | "center" | "bottom";
		/**
		 * Rotate text
		 * - range `0` to `180`
		 * - or `255` // `255` is a special value that aligns vertically
		 * @example 180 // rotated down 180 degrees
		 */
		textRotation?: number;
		/**
		 * Wrap text
		 * @default false
		 */
		wrapText?: boolean;
	};
	border?: {
		top?: { color: CellStyleColor; style?: BorderType };
		bottom?: { color: CellStyleColor; style?: BorderType };
		left?: { color: CellStyleColor; style?: BorderType };
		right?: { color: CellStyleColor; style?: BorderType };
		diagonal?: { color: CellStyleColor; style?: BorderType; diagonalUp?: boolean; diagonalDown?: boolean };
	};
	fill?: {
		/**
		 * background color
		 */
		bgColor?: CellStyleColor;
		/**
		 * foreground color
		 */
		fgColor?: CellStyleColor;
		/**
		 * Fill pattern
		 * - `"none"` prevents fill regardless of color selection
		 * @default 'solid'
		 */
		patternType?: "solid" | "none";
	};
	font?: {
		/**
		 * bold font?
		 * @default false
		 */
		bold?: boolean;
		/**
		 * font color
		 * @example {rgb: 'FF0000'} // red color
		 */
		color?: CellStyleColor;
		/**
		 * italic font?
		 * @default false
		 */
		italic?: boolean;
		/**
		 * font face
		 * @default 'Calibri'
		 */
		name?: string;
		/**
		 * font size (points)
		 * @default 11
		 */
		sz?: number;
		/**
		 * font > effect > strikethrough
		 * @default false
		 */
		strike?: boolean;
		/**
		 * underline font?
		 * @default false
		 */
		underline?: boolean;
		/**
		 * font > effect > subscript/subscript
		 * - values: "subscript" | "superscript"
		 * @default null
		 */
		vertAlign?: "superscript" | "subscript";
	};
	/**
	 * Number format
	 * @example "0" // integer index to built in formats, see StyleBuilder.SSF property                     |
	 * @example "0.00%" // string matching a built-in format, see StyleBuilder.SSF                          |
	 * @example "0.0%" // string specifying a custom format                                                 |
	 * @example "0.00%;\\(0.00%\\);\\-;@" // string specifying a custom format, escaping special characters |
	 * @example "m/dd/yy" // string a date format using Excel's format notation                             |
	 * @default '0'
	 */
	numFmt?: string;
}

interface AOA2SheetOptions extends AOA2SheetOpts {
}

interface Table2SheetOptions extends Table2SheetOpts {
}

/**
 * 单元格样式映射
 */
declare interface Styles {
  [key: string]: CellStyle
}

/**
 * 列宽度映射
 */
declare interface ColWidths {
  [key: string]: number
}

/**
 * 导出Excel选项接口
 */
declare interface ToExcelOptions {
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

export { Result, toExcel as default };
export type { AOA2SheetOptions, CellStyle, ColWidths, Range, Styles, Table2SheetOptions, ToExcelOptions, WritingOptions };
