/* eslint-disable */
import Vue from 'vue'
import axios from "axios";
import qs from "qs";
// import { app } from '@/main.js'
import Request from './request';
// import { refreshToken } from '@/api/login';
import indexConfig from '@/config/index.config';
import constDataConfig from '@/config/constData.config.js';
import mHelper from '@/utils/helper';
import utils from '@/utils/utils';
import store from '@/store';

const http = new Request();

 // 判断参数中是否传了baseUrl，如果有，则以传进来的为主
let _connect = store.state.app.connect
// request全局参数设置
http.setConfig(config => {
	// console.log(config)
	/* 设置全局配置 */
	config.baseUrl = indexConfig.baseUrl + _connect; /* 根域名不同 */
	const systemInfo = uni.getSystemInfoSync();
	const accessToken = uni.getStorageSync('accessToken') ? uni.getStorageSync('accessToken'): ''
	const systemInfoHeaders = {
		'device-name': systemInfo.brand, // 设备名称
		width: systemInfo.screenWidth, // 屏幕宽度
		height: systemInfo.screenHeight, // 屏幕高度
		os: systemInfo.platform, // 客户端平台
		'os-version': systemInfo.system // 操作系统版本
	};
	config.header = {
		...config.header,
		...systemInfoHeaders
	};
	// console.log(config.header)
	return config;
});

let isRefreshing = false;
let requests = [];
http.interceptor.request(
	config => {
		// console.log(config)
		// 全局处理注入用户ID
		removePending(config) // 在请求开始前，对之前的请求做检查取消操作
		addPending(config)    // 将当前请求添加到 pending 中
		
		let U = uni.getStorageSync('userInfo')
		let C = config.data
		
		const apiList = constDataConfig.needUserIdApiList;
		if(apiList.indexOf(config.url) !== -1){
			config.data = { ...C,userId: U.id }
		}
		/* 请求之前拦截器 */
		config.header['accessToken'] = uni.getStorageSync('accessToken');
		return config;
	},
	error => {
		console.log(error)
		return Promise.reject(error);
	}
);


http.interceptor.response(
	async response => {
		// console.log(response)
		/* 请求之后拦截器 */
		removePending(response)
		switch (response.data.code) {
			case '0000':
				// #ifdef H5
					window.vm = Vue
				// #endif
				// console.log(response)
				if (response.data.hasOwnProperty('data')) {
					if (response.data.data) {
						utils.resetDataList(response.data.data)
					}
					if (response.data.data && response.data.data.hasOwnProperty('list')) {
						if (response.data.data.list) {
							utils.resetDataList(response.data.data.list)
						}
					}
				}
				return response.data;
			case '0002':
				uni.hideLoading();
				mHelper.toast(response.data.message);
				return Promise.reject(response.data.message);
				break;
			case '9999':
				mHelper.toast(response.data.message);
				return Promise.reject(response.data.message);
				break;
			case 400:
				// mHelper.toast('错误的请求');
				return Promise.reject(response.data.message);
				break;
			case 401:
				isRefreshing = true;
				if (Vue.prototype.$loading) {
					Vue.prototype.$loading.done()
				}
				break;
			case 405:
				mHelper.toast('当前操作不被允许');
				return Promise.reject(response.data.message);
			case 404:
				mHelper.toast(response.data.message);
				return Promise.reject(response.data.message);
			case 429:
				mHelper.toast('请求过多，先休息一下吧');
				return Promise.reject(response.data.message);
			case 500:
				mHelper.toast(response.data.message);
				return Promise.reject(response.data.message);
			default:
				// mHelper.toast(response.data.message);
				// console.log(response.data)
				return Promise.reject(response.data.message);
		}
	},
	error => {
		try {
			return error
			// return Promise.reject(error);
		} catch(e) {

			console.log(e)
		}
	}
);

// 声明一个 Map 用于存储每个请求的标识 和 取消函数
const pending = new Map()
/**
 * 添加请求
 * @param {Object} config 
 */
const addPending = (config) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&')
  config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
    if (!pending.has(url)) { // 如果 pending 中不存在当前请求，则添加进去
      pending.set(url, cancel)
    }
  })
}
/**
 * 移除请求
 * @param {Object} config 
 */
const removePending = (config) => {
  const url = [
    config.method,
    config.url,
    qs.stringify(config.params),
    qs.stringify(config.data)
  ].join('&')
  if (pending.has(url)) { // 如果在 pending 中存在当前请求标识，需要取消当前请求，并且移除
    const cancel = pending.get(url)
    cancel(url)
    pending.delete(url)
  }
}
/**
 * 清空 pending 中的请求（在路由跳转时调用）
 */
export const clearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url)
  }
  pending.clear()
}

export { http };
