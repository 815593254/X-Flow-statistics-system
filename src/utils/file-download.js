
/**
 * 创建 a 标签并下载文件
 * @param {Byte}} data
 * @param {String}} filename
 * @returns 
 */
export function fileDownload(data, filename) {
  const url = window.URL.createObjectURL(new Blob([data]))
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click() // 执行下载
  window.URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}

/**
 * 从 URL 中下载文件
 * @param {String}} url
 * @param {String}} filename
 * @returns 
 */
export function downloadFromUrl(url, filename) {
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click() // 执行下载
  window.URL.revokeObjectURL(a.href)
  document.body.removeChild(a)
}
