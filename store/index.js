import Vue from 'vue';
import Vuex from 'vuex';
import $mConstDataConfig from '@/config/constData.config';
import $mSettingConfig from '@/config/setting.config';
import $config from '@/config/index.config';
import $mRouter from '@/utils/router';
const modulesFiles = require.context('./modules', true, /\.js$/)
let token = { data: 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJuYmYiOjE2MzAwMzc1OTgsInRlbGVwaG9uZSI6IjE1OTIwNTMzNDE4IiwiZXhwIjoxNjYxNTczNTk4LCJ1c2VySWQiOjF9.5J7vVxNat8d9GE2qJ9grnlN9FfD99J3KljaW8oSH90ekAVEDY_Iu0K9g0_78xNO6Bk1DNYhFjReFV1aTBrqfjw'}

Vue.use(Vuex);
const ACCESSTOKEN = uni.getStorageSync('accessToken') || '';
const REFERRER = uni.getStorageSync('referrer') || '';
const USER = uni.getStorageSync('userInfo') || {};
const REFRESHTOKEN = uni.getStorageSync('refreshToken') || '';
const GLOBALCONFIG = uni.getStorageSync('globalConfig') || {};
const CARTNUM = uni.getStorageSync('cartNum') || 0;
const NOTIFYNUM = uni.getStorageSync('notifyNum') || 0;
const IMHISTORY = uni.getStorageSync('imHistory') || [];
const IMNOREAD = uni.getStorageSync('imNoRead') || 0;
const THEMECOLOR = uni.getStorageSync('themeColor');

// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  // set './app.js' => 'app'
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

const store = new Vuex.Store({
	modules,
	state: {
		//小程序应用名称
		title: '',
		// 用户token
		accessToken: ACCESSTOKEN,
		// 用户信息
		userInfo: USER,
		// 预览表单数据
		formData: {},
		//分享人
		shareId: '',
		// 小程序openid
		openId: '',
		// 网络状态，用于下载提醒
		networkState: 'unknown',
		globalConfig: GLOBALCONFIG,
		refreshToken: REFRESHTOKEN,
		themeColor: THEMECOLOR || '#3CC393',
		// 首页显示表单列表还是活动列表，用于新增后返回指定的列表页面
		tabActive: 0, 
		apiDomain: $config.baseUrl
	},
	getters: {
		// 全局配置
		themeColor: state => {
			let theme = state.themeColor;
			if (!theme) {
				theme = $mConstDataConfig.themeList.filter((item) => item.name === ($mSettingConfig.styleType || 'rf'))[0];
				console.log(theme)
			}
			return theme;
		},
		// 全局配置
		globalConfig: state => {
			return state.globalConfig;
		},
		// 获取网络状态
		networkStatus: state => {
			return state.networkState;
		},
		// 判断用户是否登录
		hasLogin: state => {
			return !!state.accessToken;
		}
	},
	mutations: {
		login(state, provider) {
			uni.setStorageSync('telephone', provider.telephone);
			state.accessToken = provider.token;
			uni.setStorageSync('accessToken', provider.token);
		},
		logout(state) {
			state.accessToken = ''
			uni.removeStorageSync('accessToken')
		},
		setUserInfo(state){
			state.userInfo = uni.getStorageSync('userInfo') || {};
		},
		setFormData(state,formData){
			state.formData = formData;
		},
		setNetworkState(state, provider) {
			state.networkState = provider;
		},
		setGlobalConfig(state, provider) {
			state.globalConfig = provider;
			uni.setStorageSync('globalConfig', provider);
		},
		navigateTo (state, path, type='page') {
			if (!path) return;
			if (type === 'tab') {

			}
			if (path === '/pages/index/notice/notice') {
				$mRouter.push({ route: path });
			} else if (!state.accessToken) {
				// uni.removeStorageSync('backToPage');
				// Vue.prototype.$app.authorize = true
				// console.log(this.authorize)
				// $mRouter.push({ route: '/pages/public/logintype' });
			} else {
				$mRouter.push({ route: path });
			}
		},
		setThemeColor(state, val) {
			state.themeColor = val;
			uni.setStorageSync('themeColor', val);
		},
		setTabActive(state, val){
			state.tabActive = val;
		}
	},
	actions: {
		globalConfigChange({ commit }, info) {
			commit('setGlobalConfig', info);
		},
		networkStateChange({ commit }, info) {
			commit('setNetworkState', info);
		},
		login({ commit }, info){
			commit('login', info);
		},
		logout({ commit }) {
			commit('logout');
		}
	}
});
// #ifdef H5
if (uni.getStorageSync('accessToken')) {
	store.commit('login', { data: uni.getStorageSync('accessToken')})
} else {
	store.commit('login', token)
}

// #endif
export default store;
