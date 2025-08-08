/**
 * 封装websocket协议函数
 */
import { getToken } from '@/utils/auth'

function getSocket(url, params, callback) {
  let socket
  if (typeof (WebSocket) === 'undefined') {
    console.log('您的浏览器不支持WebSocket')
  } else {
    console.log('您的浏览器支持WebSocket')
    // 初始化 WebSocket 对象，指定要连接的服务器地址与端口建立连接
    socket = new WebSocket(url, [`${getToken()}`])
    console.log(socket)
    // 打开事件
    socket.onopen = function() {
      console.log('WebSocket 连接成功')
      socket.send(params)
    }
    // 获得消息事件
    socket.onmessage = function(msg) {
      // 发现消息进入, 开始处理前端触发逻辑
      callback(msg, socket)
    }
    // 关闭事件
    socket.onclose = function() {
      console.log('WebSocket 已关闭')
    }
    // 发生了错误事件
    socket.onerror = function(e) {
      console.log(e)
      console.log('WebSocket 发生了错误,请刷新页面')
      // 此时可以尝试刷新页面
    }
  }
}
export {
  getSocket
}
