# export-file

js导出文件（excel、图片、pdf）

## 使用

### npm

```shell
npm install @vensst/export-file --save
```

```js
import {toExcel, toImage, toPdf} from '@vensst/export-file'
// 或
import exportFile from '@vensst/export-file'

```

### unpkg

```html

<script src="https://unpkg.com/@vensst/export-file@版本号/lib/main.js"></script>
```

## 说明

[示例](https://github.com/vensst/export-file/tree/main/examples/demo1)

### toExcel(options)

- @param {Object} options 导出 excel 配置项
- @param {HTMLElement} options.element 需要导出的 html 根节点
- @param {Array} options.multiHeader 多级表头(二维数组)
- @param {Array} options.title 标题
- @param {Array} options.header 表头
- @param {Array} options.data 数据
- @param {Array} options.footer 表尾
- @param {Array} options.merges 合并单元格（单元格地址格式，例如:["A10:E10"]）
- @param {String} options.fileName 文件名
- @param {String} options.bookType 文件类型
- @param {Boolean} options.autoWidth 是否自动宽度
- @param {Object} options.headerStyle 表头样式
- @param {Object} options.contentStyle 内容样式
- @param {Array} options.customCellStyle 自定义单元格样式

根据数据导出

**备注：**

- 可以把所有数据都放 data 中包括 multiHeader、title、header和footer，然后通过配置自定义样式 customCellStyle 就行
- [xlsx-js-style 样式](https://github.com/gitbrent/xlsx-js-style/)
- [html2canvas 配置](https://html2canvas.hertzen.com/configuration)

```js
const excelOption = {
  multiHeader: [ // 多级表头
    ["日期", "配送信息", "", "", "", "价格"],
    ["", "姓名", "地址", "", "", ""],
    ["", "", "省份", "市区", "地址", ""],
  ],
  // title: [], // 标题
  // header: [], // 表头
  data: [
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
    ["2016-05-03", "王小虎", "上海", "普陀区", '上海市普陀区金沙江路 1518 弄', "30.00"],
  ], // 数据
  footer: [
    ["合计", "", "", "", "", "180.00"],
  ], // 底部(你也可以不写，放到 data 中)
  merges: ["A1:A3", "B1:E1", "F1:F3", "C2:E2", "B2:B3", "A10:E10"], // 合并单元格（使用单元格地址格式）
  fileName: "测试导出", // 文件名
  bookType: "xlsx",// 输出格式
  autoWidth: false,// 自适应宽度
  // 样式只做了替换没做合并
  headerStyle: {
    font: {
      name: "Arial", // 字体
      sz: 16, // 字体大小
      color: { // 字体颜色
        rgb: "000000"
      },
      bold: true, // 字体加粗

    },
    fill: {
      fgColor: { // 填充颜色
        rgb: "C5D9F1"
      },
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
    border: {
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
    },// 边框
  },// 表头样式
  contentStyle: {
    alignment: {
      horizontal: "left",
      vertical: "center",
      wrapText: true, // 自动换行
    },
  }, // 内容样式
  footerStyle: {
    alignment: {
      horizontal: "left",
      vertical: "center",
    },
  }, // 底部样式
  customCellStyle: [
    {
      cell: ["F10"],
      style: {
        fill: {
          fgColor: { // 填充颜色
            rgb: "FF0000"
          },
        },
      }
    },
    {
      cell: ["A10:E10"],
      style: {
        alignment: {
          horizontal: "right",
          vertical: "center",
        },
      }
    }
  ]// 自定义样式
}
exportFile.toExcel(excelOption)
```

根据dom元素导出

```js
 // https://www.npmjs.com/package/xlsx-js-style?activeTab=readme
const excelOption = {
  fileName: "测试导出", // 文件名
  bookType: "xlsx",// 输出格式
  contentStyle: {
    alignment: {
      horizontal: "left",
      vertical: "center",
      wrapText: true, // 自动换行
    },
  }, // 内容样式
  customCellStyle: [
    {
      cell: ["A1:F3"],
      style: {
        font: {
          name: "Arial", // 字体
          sz: 16, // 字体大小
          color: { // 字体颜色
            rgb: "000000"
          },
          bold: true, // 字体加粗

        },
        fill: {
          fgColor: { // 填充颜色
            rgb: "C5D9F1"
          },
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center',
        },
        border: {
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
        },// 边框
      }
    },
    {
      cell: ["F10"],
      style: {
        fill: {
          fgColor: { // 填充颜色
            rgb: "FF0000"
          },
        },
      }
    },
    {
      cell: ["A10:E10"],
      style: {
        alignment: {
          horizontal: "right",
          vertical: "center",
        },
      }
    }
  ]// 自定义样式
}
exportFile.toExcel({element: this.$refs.tableRef, ...excelOption})
```

### toImage(element,options)

- @param {HTMLElement} element 需要导出的 html 根节点
- @param {Object} options 配置项
- @param {string} options.fileName 文件名，默认："未命名"
- @param {string} options.imageType 文件后缀类型，默认："png"
- @param {string} options.isDownload 是否下载，false 返回 blob 格式数据，默认：true
- @param {Object} options.html2canvas html2canvas 配置

```js
   const b = await exportFile.toImage(this.$refs.blockRef, {
  fileName: "测试导出",
  imageType: "png",
  // isDownload: false,// 默认true-下载图片，false-返回 {canvas,blob}
  html2canvas: {
    // ... （可以添加 html2canvas配置）https://html2canvas.hertzen.com/configuration
    logging: false,
    allowTaint: false,
    useCORS: true,
    // 下面两个用来提高清晰度
    dpi: window.devicePixelRatio * 4, //将分辨率提高到特定的DPI 提高四倍
    scale: 4, //按比例增加分辨率
    // background: null,
  }

})
console.log(b)
```

### toPdf(element,options)

- @param {HTMLElement} element 需要导出的 html 根节点
- @param {Object} options 配置项
- @param {string} options.fileName 文件名，默认："未命名"
- @param {Object} options.padding 边距 默认：{top: 10, right: 10, bottom: 10, left: 10}
- @param {boolean} options.isPage 是否分页，默认：true
- @param {Object} options.html2canvas html2canvas 配置
- @param {Object} options.jspdf jspdf 配置(除了orientation、unit、format其它可配)

**备注：**

- [html2canvas 配置](https://html2canvas.hertzen.com/configuration)
- [jspdf 配置](https://raw.githack.com/MrRio/jsPDF/master/docs/index.html)

```js
    exportFile.toPdf(this.$refs.blockRef, {
  fileName: "测试导出",
  // padding: {top: 0, right: 0, bottom: 0, left: 0},// pdf 边距
  // isPage: false,
  // html2canvas: {
  //   logging: false,
  //   allowTaint: false,
  //   useCORS: true,
  //   scale: 4, //按比例增加分辨率
  // },
})
```

### PdfLoader 构造函数

**备注：**

- [PdfLoader 参考](https://gitee.com/jseven68/vue-pdf2/blob/master/src/utils/pdfLoader.js#)

```JS
  const pdfLoader = new exportFile.PdfLoader(this.$refs.blockRef, {
  fileName: "自定义名字",
});
pdfLoader.getPdf().then((res) => {
  console.log("[ 导出成功] >", res);
});
```
