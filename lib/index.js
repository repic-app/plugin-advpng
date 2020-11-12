const fs = require('fs')
const os = require('os')
const path = require('path')
const { execFile } = require('child_process')

const arch = os.arch()
const platform = os.platform()

let advpngBinPath = null

if (['win32', 'darwin'].includes(platform)) {
  advpngBinPath = `./vendor/${platform}/advpng`
} else if (['linux', 'freebsd'].includes(platform)) {
  advpngBinPath = `./vendor/${platform}/advpng`
}

if (platform === 'win32') {
  advpngBinPath = `${advpngBinPath}.exe`
}

advpngBinPath && (advpngBinPath = path.join(__dirname, advpngBinPath))

module.exports = (task, preferences) => new Promise((resolve, reject) => {

  if (!advpngBinPath || !fs.existsSync(advpngBinPath)) {
    reject('platform unsupport.')
    return false
  }

  let sourceFilePath = task.path
  const outputPath = preferences.overrideOrigin ? task.path : `${preferences.autoSavePath}/optmized_${task.id}_${task.file.name}`

  // 如果不需要覆盖原图
  if (!preferences.overrideOrigin) {
    sourceFilePath = `.${task.path}.processing.png`
    //先创建临时文件
    fs.copyFileSync(task.path, sourceFilePath)
  }

  execFile(advpngBinPath, ['-3', '-z', '-i', parseInt((1 - preferences.outputQuality) * 50), sourceFilePath], error => {
    if (error) {
      reject(error)
    } else {
      if (!preferences.overrideOrigin) {
        // 将压缩后的文件拷贝到目标目录
        fs.copyFileSync(sourceFilePath, outputPath)
        // 删除临时文件
        fs.unlinkSync(sourceFilePath)
      }
      resolve({
        path: outputPath,
        size: fs.statSync(outputPath).size
      })
    }
  })
})