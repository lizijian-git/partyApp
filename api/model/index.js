/**
 * @description api接口配置。每个不同的模块尽可能通过独立的js文件进行配置。
 * @tutorial https://javaweb.fengxingtech.com/chongfen-applets/swagger-ui.html 接口文档
 * 默认分页参数：{ pageNum: 1, pageSize: this.$config.PAGE_SIZE }
 * 使用方法：如要使用user.js中的login接口
 * 格式：this.$api.模块名.接口名(params);
 * 代码：this.$api.user.login(params);
 *
 * 如需在其他js中引入api，可通过 import api from '@/api'，然后通过`api.模块名.接口名(params)`方式调用
 */

const api = {}
const requireContent = require.context('.', true, /\.js$/)
requireContent.keys().forEach((key) => {
  const content = requireContent(key)
  const contentName = key.replace(/^\.\//, '').replace(/\.\w+$/, '')
  // console.log({ content, contentName, __esModule: content.__esModule })
  api[contentName] = content.__esModule && content.default ? content.default : content
})

export default api
