import toExcel from "./toExcel";
import toImage from "./toImage";
import toPDF from "./toPDF";

export * from "./toExcel"
export * from "./toImage"
export * from "./toPDF"

export type{
  ImageOptions,
  Html2CanvasOptions,
  Result,
  ImageType,
  SuccessResponse,
  ErrorResponse
} from "./common";

// 同时支持默认导入和具名导入
export {
  toExcel,
  toImage,
  toPDF
};
// 导出合并后的命名空间
declare const ExportFile: {
  toExcel: typeof toExcel;
  toImage: typeof toImage;
  toPDF: typeof toPDF;
};

export default ExportFile;


