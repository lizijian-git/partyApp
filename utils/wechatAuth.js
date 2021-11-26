import utils from '@/utils/utils.js'
import { http } from '@/utils/request';
import { mapMutations } from 'vuex';
import $mHelper from '@/utils/helper';
import { userAuthorize } from '@/api/login';
import { saveUserPhone, profileInfo } from '@/api/userInfo';
import store from '@/store/index'
import indexConfig from '@/config/index.config';
export default {
  data  () {
    return {
	  logining: false,	//是否登录
    }
  },
  methods: {
    ...mapMutations(['login', 'logout', 'setUserInfo']),
		// 授权登录
	onGotUserInfo () {
		var _this = this;
		//防重复登录
		if( this.logining )return;
		this.logining = true;

	    uni.getUserProfile({
		  desc: '获取用户信息',
	      provider: 'weixin',
	      success: (info) => {
			uni.login({
			  provider: 'weixin',
			  success: (res) => {
			uni.showLoading({title:"登录中"})
	        var params = {
	          code: res.code,
	          nickname: info.userInfo.nickName,
	          picUrl: info.userInfo.avatarUrl
	        }
	        utils.appAuthorize(params).then(getRes => {
				let r = getRes.records;
				_this.logining = false;
				_this.$mHelper.toast('登录成功')
				_this.$store.dispatch('login', r)
				_this.getProfileInfo().then(()=>{
					if (typeof _this.appInitial === 'function') {
						_this.appInitial()
					}					
				})
	        }).catch(err=>{});
	      },
	      fail: (err) => {
			_this.logining = false;
	        uni.showToast({ title:"微信登录授权失败",icon:"none" });
			if(courseId){
				  this.navigateTo('/pages/product/detail', 'page', `id=${courseId}`)
			}
	      }
	    })
	  },
	  fail: (err) => {
		_this.logining = false;
	    uni.showToast({ title:"微信登录授权失败",icon:"none" });
	  }
	});
    },
    // 刷新登录
	refreshTokenLogin(){},
    // 获取用户信息
    getProfileInfo() {
		return new Promise((reslove,reject)=>{
		  this.$http.post(`${profileInfo}`, { id: uni.getStorageSync("userInfo").id }).then(r => {
			  this.stopDownRefresh()
			  uni.setStorageSync('userInfo', r.records)
			  store.commit('setUserInfo');
			  reslove();
			}).catch((err) => {
			  console.log(err)
			  this.stopDownRefresh()
			  reject();
			})			
		})
    },
    // 绑定微信手机号
    saveUserPhone(data) {
		var _this = this;
		this.$http.post(`${saveUserPhone}`, data).then( r => {
		  _this.$mHelper.toast('绑定成功')
		  if (typeof this.getProfileInfo === 'function') {
			this.getProfileInfo()
		  }
		}).catch((err) => {
		  console.log(err)
		  this.loading = false
		})
    }
  }
}
