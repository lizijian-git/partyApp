import { http } from '@/utils/request';
import indexConfig from '@/config/index.config';
import store from '@/store';
import { userAuthorize } from '@/api/login';
import { UPLOAD_FILE,mallConfig } from  '@/api/basic'

export const tools = {
  isArray (args) {
    return Array.isArray(args)
  },
  isObject (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  },
  isArray: args => {
    return Array.isArray(args)
  },
  // 克隆复制对象
  copyObj (obj)  {
      let result
      if (tools.isObject(obj)) {
        result = {}
      } else if (tools.isArray(obj)) {
        result = []
      } else {
        return obj
      }
      for (var key in obj) {
        result[key] = tools.copyObj(obj[key])
      }
      return result
  },
  // 字段筛选
  arrayField (data, field, has)  {
    var obj = !this.isArray(data) ? [data] : data
    var fd = field.split(',')
    var re = new RegExp('^' + fd.join('|') + '$')
    Object.keys(obj).forEach(function (k) {
      Object.keys(obj[k]).forEach(function (i) {
        !has ? re.test(i) ? delete obj[k][i] : ''
        : !re.test(i) ? delete obj[k][i] : ''
      })
    })
    return !this.isArray(data) ? obj[0] : obj
  },
  // ITEM 格式转换
  fieldtoParseArray (data, field, has = true) {
    var obj = !this.isArray(data) ? [data] : data
    var fd = field.split(',')
    var re = new RegExp('^' + fd.join('|') + '$')
    Object.keys(obj).forEach(function (k) {
      Object.keys(obj[k]).forEach(function (i) {
        if (re.test(i) && has) {
           obj[k][i] = JSON.parse(obj[k][i])
        } else {
          obj[k][i] = JSON.stringify(obj[k][i])
        }
      })
    })
    let formatJson = JSON.stringify(obj)
    let parseJson = JSON.parse(formatJson)
    return !this.isArray(data) ? parseJson[0] : parseJson
  }
}
// 授权接口交换
export const appAuthorize = (params) => {
  return new Promise((resolve, reject) => {
    // console.log(userAuthorize)
    http.post(`${userAuthorize}`, params)
    .then(r => {
      resolve(r)
    })
    .catch(() => {
      reject()
    })
  })
}
export const resetDataList = (data) => {
  var obj = !tools.isArray(data) ? [data] : data
  for (var i in obj) {
    Object.keys(obj[i]).forEach((k) => {
      if(Object.prototype.toString.call(obj[i][k]) === '[object String]' && obj[i][k].match(/{\.*|\[\.*/)){
        try {
          // console.log(obj[i][k])
           obj[i][k] =  JSON.parse(obj[i][k])
        } catch (err){
          // console.log(err)
        }
      }
    })
  }
  return !tools.isArray(data) ? obj[0] : obj
}

export const wxLogin = (id) => {
  // let sourceId = id ? id : 0
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    let _self = this
    uni.getProvider({
      service: 'oauth',
      success: function (res) {
        if (~res.provider.indexOf('weixin')) {
          uni.login({
            provider: 'weixin',
            success: (res) => {
              uni.getUserProfile({
				desc: '获取用户信息',
                provider: 'weixin',
                success: (info) => {
                  var params = {
                    code: res.code,
                    iv: info.iv,
                    encryptedData: info.encryptedData,
                    mallId: indexConfig.mallId
                  }
                  // console.log(params)
                  appAuthorize(params).then(getRes => {
                    resolve(getRes)
                  })
                },
                fail: (err) => {
					console.log(err);
                  reject(err)

                  uni.showToast({ title:"微信登录授权失败",icon:"none" });
                }
              })
            },
            fail: (err) => {
              reject(err)

              uni.showToast({ title:"微信登录授权失败",icon:"none" });
            }
          })
        } else {
          uni.showToast({
              title: '请先安装微信或升级版本',
              icon:"none"
          })
        }
      }
    })
    //#endif
  })
}
function getMallConfig(){
	return new Promise((resolve,reject)=>{
		http.post(`${mallConfig}`,{}).then(res => {
			store.dispatch('globalConfigChange',res.records);
		})
	})
}
export default {
  wxLogin,
  appAuthorize,
  resetDataList,
  tools,
  http,
  getMallConfig
}