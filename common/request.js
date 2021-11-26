/*
 * @Description: uni.request 封装
 * 在其他js中通过 import request from '@/common/request' 引入
 * 在 .vue 文件中通过 this.$request* 引用
 */
import {
  toast
} from '@/common/utils';
import store from '@/store';
import $config from '@/config/index.config'
import utils from './utils';

// 默认头部
const header = {
  Accept: 'application/json',
  'Content-Type': 'application/json;charset=UTF-8', // 默认，POST 方法时会对数据进行 JSON 序列化，请求参数最终为 Request Payload：序列化后的JSON字符串，如：{ id: 1}
  // 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' // 对于 POST 方法时会将数据转换为 query string。请求参数最终为 Form Data，如: id: 1
};

/**
 * @param {Object} options
 * @param {String} domain 请求域名，如果有值，不必以“/”结束，默认为配置文件中的API_DOMAIN
 * @param {String} baseUrl 请求前缀，如果有值，则必须以“/”开始，默认为配置文件中的BASE_URL
 * @param {String} url 一定以“/”开始
 * @param {String} method 需转换为大写
 * @param {Object} params 请求的参数
 * @param {Object} header 自定义请求头
 * @param {Boolean} auth 是否需要授权登录，默认false
 * @param {Boolean} loading 是否显示加载提示，默认undefined
 * @param {String} loadingMsg loading的提示语，默认undefined
 * @param {Boolean} hideError 是否隐藏错误提示，默认undefined
 */
const request = (options) => {
  /**
   * 返回 Promise
   * 注意：
   * 1. 通过 async await 调用的，需要使用 try{}catch(e){} 进行异常捕捉；
   * 2. 通过 .then 进行链式调用，需要使用 .catch(e=>{}) 进行异常捕捉。
   */
  return new Promise((resolve, reject) => {
    if (!options.url) {
      toast('发送request请求必须输入url');
      return;
    }
    // 判断参数中是否传了domain，如果有，则以传进来的为主
    const _apiDomain = options.domain || store.state.apiDomain;

    // 判断参数中是否传了baseUrl，如果有，则以传进来的为主
    const _baseUrl = store.state.app.connect

    // 可根据实际需要添加头部信息，主要用于鉴权
    const accessToken = uni.getStorageSync('accessToken'); // 本地存储登录凭证
    // 接口权限验证，使用HTTP头发送	i.e Authorization : Bearer + token值
    if (accessToken) {
      // 通过token字段传值，有时候会报跨域，主要可能是后台代码设置允许跨域的请求头字段中没有包括该字段
      header['accessToken'] = accessToken;
    } else {
			header['sessionid'] = '';
    }
    header['mallId'] = $config.mallId
	header['saleId'] = uni.getStorageSync('saleId') || '';

    // #ifdef MP
    header['X_CLIENT_PLATFORM'] = 'MP';
    // #endif

    // #ifdef APP-PLUS
    // 在请求头添加app版本号，用于进行api兼容
    plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
      header['X_APP_VERSION'] = wgtinfo.version; // 应用版本号
      header['X_APP_VERSION_CODE'] = wgtinfo.versionCode; //应用构建号
    });
    const platform = uni.getSystemInfoSync().platform;
    header['X_CLIENT_PLATFORM'] = platform; // 客户端平台，值域为：ios、android
    const systemInfo = store.getters['systemInfo']; // 系统信息
    header['X_SYSTEM_INFO'] = systemInfo;
    // #endif

    const startTime = new Date();

    // 是否显示loading提示
    if (options.loadingMsg || options.loading) {
      uni.showLoading({
        mask: true,
        title: options.loadingMsg || '请求中...'
      });
    }

    const _header = Object.assign(header, options.header);
    const _url = _apiDomain + _baseUrl + options.url;
    const _method = (options.method && options.method.toUpperCase()) || 'GET';
    if (!['GET', 'POST', 'PUT', 'DELETE', 'CONNECT', 'HEAD', 'OPTIONS', 'TRACE'].includes(_method)) {
      toast(_method + '不是有效值');
      return;
    }

    // 发起网络请求 https://uniapp.dcloud.io/api/request/request
    const requestTask = uni.request({
      url: _url, // 必填。开发者服务器接口地址
      method: _method, // 请求方式，必须大写。非必填，默认值GET。有效值请查看文档：https://uniapp.dcloud.io/api/request/request
      data: options.params || options.data || {}, // 非必填 请求的参数
      dataType: 'json', // String 默认json。如果设为 json，会尝试对返回的数据做一次 JSON.parse
      header: _header, // 非必填。设置请求的 header，header 中不能设置 Referer。
      // 收到开发者服务成功返回的回调函数
      success: (response) => {
        let errMsg = '';
        if (response.statusCode === 200) {
          switch (response.data.code){
            case '0': // 正常
            case 0: // 正常
              resolve(utils.resetResolve(response.data))
              break;
            case (response.data.code >= 600 && response.data.code < 700):
              if (!options.hideError) {
                toast(response.data.msg)
              } else {
                reject({ msg: response.data.msg || response.data.errMsg })
              }
              break;
            case 800: // 登录失效
              reject({
                errMsg: '请先登录'
              });
              // 清空登录信息，跳转到登录页面
              // store.dispatch('user/ALogout')
              break;
            default:
              console.log(options)
              errMsg = response.data.msg || '发生错误，请稍后重试';
              reject({
                code: response.data.code,
                errMsg,
              });
              break;
          }
        } else {
          errMsg = `${response.statusCode} - ${response.data.message || response.data}`;
          reject({
            code: response.statusCode,
            errMsg,
          });
        }
        if (errMsg && !options.hideError) toast(errMsg);
      },
      // 接口调用失败的回调函数
      fail: (err) => {
        let errMsg = err.errMsg || '接口调用失败，请稍后重试';
        uni.getNetworkType({
          success: (res) => {
            if (['unknown', 'none'].includes(res.networkType)) {
              errMsg = '网络异常，请检查网络后重试';
            }
            reject({
              errMsg,
            });
            if (errMsg && !options.hideError) toast(errMsg);
          },
        });
      },
      // 接口调用结束的回调函数（调用成功、失败都会执行）
      complete: (e) => {
        if (options.loadingMsg || options.loading) uni.hideLoading();
        const endTime = new Date();
        const time = new Date(endTime - startTime).getTime();
        // 打印日志，方便调试
        console.log({
          time,
          request: {
            ...options,
            _url,
            _header
          },
          response: e,
        });
      },
    });
    // 便于返回函数调用此对象，做一些特殊业务处理：如中断请求：requestTask.abort();
    request.requestTask = requestTask;
  });
};

export default request;
