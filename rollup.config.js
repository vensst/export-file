import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import {babel} from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import {dts} from 'rollup-plugin-dts';
import {readdirSync} from 'fs'

const plugins = [
  commonjs(),
  resolve({
    browser: true
  }),
  babel({
    babelHelpers: 'bundled',
    exclude: 'node_modules/**'
  }),
  terser({
    compress: {
      ecma: 2015,
      drop_console: true,
      drop_debugger: true
    },
    mangle: true
  }),
  nodePolyfills()
]

// 获取src文件下的所有文件
const srcFiles = readdirSync('src').filter(file => file.endsWith('.js')).map(file => file.replace(/\.js$/, ''));

export default [
// 为每个工具文件创建单独的构建配置
  ...srcFiles.map(file => ({
    input: `src/${file}.js`,
    plugins,
    external: [
      // 可选：添加不打包的依赖，如第三方依赖
      // 'xlsx-js-style', 'html2canvas', 'file-saver', 'jspdf',
    ],
    treeshake: true, // 是否应用除屑优化（tree-shaking）
    output: [
      {
        file: `lib/${file}.esm.js`,
        format: 'es',
        inlineDynamicImports: true,
      },
      {
        file: `lib/${file}.cjs.js`,
        format: 'cjs',
        inlineDynamicImports: true,
      },
      {
        file: `lib/${file}.umd.js`,
        format: 'umd',
        name: file === 'index' ? 'ExportFile' : file,
        inlineDynamicImports: true,
        // 对于工具文件，使用'default'导出以避免window.toPDF.toPDF这种情况
        exports: file === 'index' ? 'named' : "default",
        // globals: { // umd 和 iife 提供全局变量名，以替换掉外部引入
        //   'crypto-js': 'CryptoJS',
        // }
      }
    ],
  })),
  // 类型定义文件
  ...srcFiles.map(file => ({
    input: `./types/${file}.d.ts`,
    output: [{
      file: `lib/${file}.d.ts`,
      format: 'es'
    }],
    plugins: [
      dts({
        // 添加这个配置以打包指定的类型依赖
        compilerOptions: {
          baseUrl: "./",
          paths: {
            "xlsx-js-style": ["node_modules/xlsx-js-style"],
          },
          preserveSymlinks: false // 防止符号链接导致的重复
        },
        // 不将这些依赖视为外部依赖
        respectExternal: false,
      })
    ],
  }))

];
