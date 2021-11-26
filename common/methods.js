import $mConstDataConfig from '@/config/constData.config.js'
import $mRouter from '@/utils/router'
import config from '@/config/index.config.js'
import utils from '../utils/utils'
import { getShareInfo } from '@/api/basic.js';
export default {
  // 通用全局路由跳转
  navigatePageTo (path, type, args) {
    let pagePath = args ? $mRouter.serializeAppApiUrl(path, args) : path
    console.log(pagePath, type)
    if (type === 'tab') {
      $mRouter.switchTab({ route: pagePath })
    } else {
      $mRouter.push({ route: pagePath })
    }
  },
  stopDownRefresh () {
    uni.stopPullDownRefresh()
  },
  redirectTo(path, type){
	  $mRouter.redirectTo({ route: path })
  },
  // 深拷贝数据
  deepCopyData (obj) {
    let result
    var isObject = (obj) => {
      return Object.prototype.toString.call(obj) === '[object Object]'
    }
    var isArray = (args) => {
      return Array.isArray(args)
    }
    if (isObject(obj)) {
      result = {}
    } else if (isArray(obj)) {
      result = []
    } else {
      return obj
    }
    for (var key in obj) {
      result[key] = this.deepCopyData(obj[key])
    }
    // console.log(result)
    return result
  },
  removeArray (array, i) {
    var index = array.indexOf(i)
    if (index > -1) {
        array.splice(index, 1)
    }
    return array
  },
  queryRouteparams (str, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var result = str.match(reg);
    return result?result[2]:null;
  },
  resetDataList: utils.resetDataList,
  // 全局路由跳转判断登录验证
  navigateTo (path, type="page", args, callback) {
    // console.log($mRouter.serializeAppApiUrl('pages', args))
    let whiteList = $mConstDataConfig.whiteList
    let pagePath = args ? $mRouter.serializeAppApiUrl(path, args) : path
	console.log(path)
    if (!path) return;
    if (whiteList.includes(path)) {
      if (type === 'tab') {
        $mRouter.switchTab({ route: pagePath })
      } else {
        $mRouter.push({ route: pagePath })
      }
    } else if (!uni.getStorageSync('accessToken')) {
      console.log('未登录')
      if (typeof callback === 'function') {
        callback({isLogin: !!uni.getStorageSync('accessToken') })
      }
    } else {
      if (typeof callback === 'boolean') {
        if (type === 'tab') {
          $mRouter.switchTab({ route: pagePath })
        } else {
          $mRouter.push({ route: pagePath })
        }
      }

      if (typeof callback === 'function') {
        let result = {
          userInfo: uni.getStorageSync('user'),
          isLogin: !!uni.getStorageSync('accessToken'),
          type: type,
          path: pagePath
        }
        // console.log(callback(result))
        if (callback(result)) {
          if (type === 'tab') {
            $mRouter.switchTab({ route: pagePath })
          } else {
            console.log(pagePath)
            $mRouter.push({ route: pagePath })
          }
        }
      }
    }
  },
  // 全局返回
  pageBack () {
    $mRouter.back()
  },
  // 获取命中选择
  getSelectedCurrent (data, type) {
    let arr = []
    for (var i; i<=data.length; i++) {
      if (data[i].cur) { arr.push(data[i]) }
    }
  },
  // OSS relapace
  renderOssImage (path) {
    if (!path) return
    let regx = /(^https?:\/\/.*?)(:\d+)?\/.*$/
    return regx.test(path) ? path : `${config.ossBase}${path}`
  },
  closeLoading () {
    console.log(this)
    this.hasLoading = false
  },
  // 字段处理
  arrayField: (data, field, has) => {
    var fd = field.split(',')
    var re = new RegExp('^' + fd.join('|') + '$')
    Object.keys(data).forEach(function (k) {
      Object.keys(data[k]).forEach(function (i) {
        !has ? re.test(i) ? delete data[k][i] : ''
          : !re.test(i) ? delete data[k][i] : ''
      })
    })
    return data
  },
  // 计算两个时间间隔天数
  getDateDiff (date) {
    // console.log(date)
    if (!date) return
    date = (date / 1000)
    var timestamp = (Date.parse(new Date())) / 1000 // 计算当前时间戳 (毫秒级)
    var date1 = '' // 开始时间
    var date2 = '' // 结束时间
    // console.log(timestamp, date)
    if(date > timestamp){
        date1 = timestamp
        date2 = date
    } else {
        date1 = date // 开始时间
        date2 = date // 结束时间
    }

  // var date3 = date2.getTime() - date1.getTime(); // 时间差的毫秒数
  var date3 =  (date2- date1) * 1000 // 时间差的毫秒数
  // 计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000));
  // 计算出小时数
  var leave1 = date3 % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000));
  // 计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000));
  // 计算相差秒数
  var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);
  // console.log(days + "天 " + hours + "小时 ")
  // return   days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒"
  return   days + '天' + hours + '小时'
  },
  // 获取手机号
  getPhoneNumber (e) {
    let _this = this
    if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
		
	} else {
        uni.login({
          provider: 'weixin',
          success: (res) => {
            let data = {
                code: res.code,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
            }
              _this.saveUserPhone(data)
          }
        })
      }
  },
  getShareInfo(data){
	  return new Promise((resolve,reject)=>{
		  this.$http.post(`${getShareInfo}`,data).then(res => {
			let records = res.records;
			resolve(records);
		  }).catch(err=>{
			  reject();
		  });	  
	  });
  }
}
