# export-file

js将html导出文件（excel、图片、pdf）

## 使用

### npm

```shell
npm install @vensst/export-file --save
```

```js
import ExportFile from '@vensst/export-file'
// 或
import {toExcel, toImage, toPDF} from '@vensst/export-file'
// 或
import toExcel from "@vensst/export-file/lib/toExcel"
import toImage from "@vensst/export-file/lib/toImage"
import toPDF from "@vensst/export-file/lib/toPDF"
```

### unpkg

```html

<script src="https://unpkg.com/@vensst/export-file@版本号/lib/main.js"></script>
```

## 说明

[示例](https://github.com/vensst/export-file/tree/main/examples)

### toExcel(options)

将 html 或二维数组数据导出 excel 文件

- @param {Object} options - 导出选项
- @param {HTMLElement} [options.element] - HTML表格元素
- @param {Array} [options.data=[]] - 二维数组数据
- @param {string} [options.fileName='未命名.xlsx'] - 导出文件名
- @param {string} [options.sheetName='Sheet1'] - 工作表名称
- @param {Object} [options.styles={}] - 单元格样式配置
- @param {Array} [options.merges=[]] - 合并单元格配置
- @param {boolean} [options.isAutoWidth=false] - 是否自动调整列宽
- @param {Object} [options.colWidths] - 列宽度配置
- @param {Object} [options.tableToSheetOptions={}] - table转sheet选项
- @param {Object} [options.aoaToSheetOptions={}] - 数组转sheet选项
- @param {Object} [options.writeFileOptions={}] - 写入文件选项
- @returns {Promise<Result>} 响应结果

#### 根据二维数组数据导出

```js
const excelOption = {
  fileName: "测试导出", // 文件名
  sheetName: "配送地址表", // sheetName
  data: [
    ['标题', '', '', '', '', '',],
    ["日期", "配送信息", "", "", "", "价格"],
    ["", "姓名", "地址", "", "", ""],
    ["", "", "省份", "市区", "地址", ""],
    ['列1', '列2', '列3', '列4', '列5', '列6',],
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
    ["合计", "", "", "", "", "180.00"],
  ], // 数据
  styles: {
    'A1:F5': {
      font: {
        name: 'Arial', // 字体
        sz: 16, // 字体大小
        color: {
          // 字体颜色
          rgb: '000000',
        },
        bold: true, // 字体加粗
      },
      fill: {
        fgColor: {
          // 填充颜色
          rgb: 'C5D9F1',
        },
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
      },
      border: {
        top: {
          color: {},
          style: 'thin',
        },
        bottom: {
          color: {},
          style: 'thin',
        },
        left: {
          color: {},
          style: 'thin',
        },
        right: {
          color: {},
          style: 'thin',
        },
      }, // 边框
    }, // 表头样式
    'A2:F5': {
      font: {
        name: 'Arial', // 字体
        sz: 16, // 字体大小
        color: {
          // 字体颜色
          rgb: '000000',
        },
        bold: true, // 字体加粗
      },
      alignment: {
        horizontal: 'center',
        vertical: 'center',
      },
    },
    F12: {
      fill: {
        fgColor: {
          // 填充颜色
          rgb: 'FF0000',
        },
      },
    },
  },
  merges: ["A1:F1", "A2:A4", "B2:E2", "B3:B4", "C3:E3", "F2:F4"], // 合并单元格（使用单元格地址格式）
  // merges: [
  //   { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
  //   { s: { r: 1, c: 1 }, e: { r: 1, c: 4 } },
  //   { s: { r: 1, c: 0 }, e: { r: 3, c: 0} },
  //   { s: { r: 2, c: 1 }, e: { r: 3, c: 1} },
  //   { s: { r: 2, c: 2 }, e: { r: 2, c: 4} },
  //   { s: { r: 1, c: 5 }, e: { r: 3, c: 5} },
  //   { s: { r: 11, c: 0 }, e: { r: 11, c: 4} },
  // ], // 合并单元格（使用单元格地址格式）
  isAutoWidth: true,// 自适应宽度
  colWidths: {A: 15, B: 25, C: 30}
}
ExportFile.toExcel(excelOption).then(res => {
  console.log(res)
})
```

**备注：**

- [xlsx-js-style 样式](https://github.com/gitbrent/xlsx-js-style/)
- [html2canvas 配置](https://html2canvas.hertzen.com/configuration)

#### 根据 html table 元素导出

```js
// https://www.npmjs.com/package/xlsx-js-style?activeTab=readme
const excelOption = {
  element: this.$refs.tableRef,
  fileName: "测试导出2", // 文件名
  sheetName: "配送地址表2", // sheetName
  styles: {
    "A1:F3": {
      font: {
        name: "Arial", // 字体
        sz: 16, // 字体大小
        color: { // 字体颜色
          rgb: "000000"
        },
        bold: true, // 字体加粗
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
    },
    'F10': {
      fill: {
        fgColor: { // 填充颜色
          rgb: "FF0000"
        },
      },
    },
  },
  // merges: ["A1:F1", "A2:A4", "B2:E2", "B3:B4", "C3:E3", "F2:F4"], // 合并单元格（使用单元格地址格式）
  // // merges: [
  // //   { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
  // //   { s: { r: 1, c: 1 }, e: { r: 1, c: 4 } },
  // //   { s: { r: 1, c: 0 }, e: { r: 3, c: 0} },
  // //   { s: { r: 2, c: 1 }, e: { r: 3, c: 1} },
  // //   { s: { r: 2, c: 2 }, e: { r: 2, c: 4} },
  // //   { s: { r: 1, c: 5 }, e: { r: 3, c: 5} },
  // //   { s: { r: 11, c: 0 }, e: { r: 11, c: 4} },
  // // ], // 合并单元格（使用单元格地址格式）
  isAutoWidth: true,// 自适应宽度
  // colWidths: {A: 15, B: 25, C: 30}
}
ExportFile.toExcel(excelOption).then(res => {
  console.log(res)
})
```

### toImage(element,options)

#### 将 html 导出图片

- @param {HTMLElement} element 需要导出的 html 根节点
- @param {Object} options 配置项
- @param {string} [options.fileName] 文件名，默认："未命名"
- @param {Object} [options.image] - 图片配置项
- @param {Object} [options.image.type] - 图片类型， 默认：'jpeg'，可选值：'jpeg'、'png'、'webp'，
- @param {number} [options.image.quality] - 图片质量，默认：0.95，范围：0-1
- @param {Object} [options.html2canvas] html2canvas 配置
- @returns {Promise<Result>} 响应结果

```js
ExportFile.toImage(this.$refs.blockRef, {
  fileName: "测试导出",
  image: {
    type: "jpeg",
    quality: 0.95
  },
  html2canvas: {
    // ... （可以添加 html2canvas配置）https://www.html2canvas.cn/html2canvas-configuration.html
    logging: false,
    useCORS: true,            //是否允许使用跨域图片
    // allowTaint: true,         //是否允许跨域的图片渲染到canvas
    scale: window.devicePixelRatio, //按比例增加分辨率
    onclone: documentClone => {
      // some code
    }
  }
}).then((res) => {
  console.log(res)
})
```

### toPdf(element,options)

- @param {HTMLElement} element - 需要转换为 PDF 的 HTML 元素
- @param {Object} options - 可选配置对象，包含 html2canvas 和 jspdf 的配置项
- @param {string} [options.fileName] - PDF文件名，默认：'未命名.pdf'
- @param {Object} [options.isPage] - 是否分页，默认：true
- @param {Number|Array} [options.margin] - 页边距，可以是一个数字或一个数组，默认：0，数组：[上右下左]，[上下,左右]，[上,左右,下]，[上,右,下,左]
- @param {Object} [options.image] - 图片配置项
- @param {Object} [options.image.type] - 图片类型， 默认：'jpeg'，可选值：'jpeg'、'png'、'webp'，
- @param {number} [options.image.quality] - 图片质量，默认：0.95，范围：0-1
- @param {Object} [options.html2canvas] - html2canvas 的配置项
- @param {Object} [options.jsPDF] - jsPDF 的配置项
- @returns {Promise<Result>} 响应结果

```js
ExportFile.toPDF(this.$refs.blockRef, {
  fileName: "测试导出",
  margin: 10,
  isPage: false,
  html2canvas: {
    useCORS: true,
    onclone: documentClone => {
      // some code
    }
  },
  jsPDF: {
    unit: 'pt',
  }
}).then(res=>{
  console.log(res)
})
```

**备注：**

- [html2canvas 配置](https://html2canvas.hertzen.com/configuration)
- [jspdf 配置](https://raw.githack.com/MrRio/jsPDF/master/docs/index.html)
