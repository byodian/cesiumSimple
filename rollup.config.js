// export default {
//   input: 'src/index.js',
//   output: {
//     file: 'dist/bundle.js',
//     format: 'cjs'
//   }
// }
const formats = ['iife', 'cjs', 'es', 'umd']

export default formats.map(format => ({
  input: 'src/index.js',
  output: {
    file: `dist/bundle${format === 'iife' ? '' : ('.' + format)}.js`,
    format,
    external: ['cesium']
  },
}))
