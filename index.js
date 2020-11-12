module.exports = {
  name: 'plugin-advpng',
  title: 'AdvPNG',
  description: '用于压缩png格式的图片，出图质量和压缩率都不错，非常适合压缩小图标，压缩大图会耗时比较久。',
  type: 'compressor',
  accepts: ['image/png'],
  extensions: ['png'],
  process: 'main',
  main: './lib'
}