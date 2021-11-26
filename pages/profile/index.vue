<template>
	<view class="app-container">
		<view class="title-main flex font-base">
			<template v-if="hasLogin">
				<view class="avatar">
					<image :src="userInfo.picUrl" mode=""></image>
				</view>
				<view class="user-info">
					<view class="nickname">{{ userInfo.nickname }}</view>
					<view v-if="userInfo.telephone" class="phoneNum">{{ $utils.dataDesensitization(userInfo.telephone,3,4) }}</view>
				</view>				
			</template>
			<template v-else>
				<view class="default-avatar">未登录</view>
				<view class="login-btn" @tap.stop="onGotUserInfo">立即登录</view>
			</template>
		</view>
		<view class="app-main">
			<view class="count-main flex">
				<view class="count-item flex-1" @tap.stop="toFormList(0)">
					<view class="num">{{ selfNum }}</view>
					<view class="label	">发起表单</view>
				</view>
				<view class="count-item flex-1" @tap.stap="toFormList(1)">
					<view class="num">{{ attendNum }}</view>
					<view class="label">参与表单</view>
				</view>
				<view class="count-item flex-1" @tap.stap="toActivityList(0)">
					<view class="num">{{ activitySelfNum }}</view>
					<view class="label">发起活动</view>
				</view>
				<view class="count-item flex-1" @tap.stap="toActivityList(1)">
					<view class="num">{{ activityAttendNum }}</view>
					<view class="label">参与活动</view>
				</view>
			</view>			
			<view class="menu-main font-base-lg">
				<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="menu-item flex" >
					<image class="icon" src="../../static/img/icon/icon_bindPhone.png" mode=""></image>
					<view class="line flex flex-1">
						<view class="name font-base flex-1">绑定手机</view>
						<view class="iconfont icon-right"></view>
					</view>
				</button>
				<view class="menu-item flex" @tap.stop="showContactPopou()">
					<image class="icon" src="../../static/img/icon/icon_menu_service.png" mode=""></image>
					<view class="line flex flex-1">
						<view class="name font-base flex-1">联系平台</view>
						<view class="iconfont icon-right"></view>
					</view>
				</view>
				<view class="menu-item flex" v-for="menu in menuList" :key="menu.name" @tap.stop="toPath(menu.path)">
					<image class="icon" :src="menu.iconPath" mode=""></image>
					<view class="line flex flex-1">
						<view class="name font-base flex-1">{{ menu.name }}</view>
						<view class="iconfont icon-right"></view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer font-base-sm">
			<view class="version">
				<view class="logo"></view>
				<view>v1.2.1</view>
			</view>
			<view class="support-info">品捷科技 提供技术支持</view>
		</view>
		<leePopou type="bottom" ref="share" :round="true" padding="0">
			<view class="p-list-item">
				<view class="cell-line p-item" @tap.stop="freeTell(globalConfig.businessPhone)">
					商务合作 {{ globalConfig.businessPhone }}
				</view>
				<view class="cell-line p-item" @tap.stop="freeTell(globalConfig.servicePhone)">
					技术服务 {{ globalConfig.servicePhone }}
				</view>
				<view style="height: 10rpx;background-color: #F7F7F7;"></view>
				<view class="cell-line p-item" @tap.stop="pupouClose('share')">
					取消
				</view>
			</view>
		</leePopou>
		<custom-tarbar :selected="2"></custom-tarbar>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
import { formNum } from '@/api/userInfo.js';
import wechatAuth from "@/utils/wechatAuth";
import leePopou from '@/components/lee-popup/lee-popup';
export default{
	mixins: [wechatAuth],
	components: {
		leePopou
	},
	computed:{
		...mapGetters(['globalConfig']),
	},
	data() {
		return{
			menuList: [
				{
					path: '/pages/profile/feedback/index',
					iconPath: '../../static/img/icon/icon_menu_feedback.png',
					name: '意见反馈'
				}
			],
			attendNum: 0, //我参与的
			selfNum: 0, //我发起的
			activityAttendNum: 0,//我参与的
			activitySelfNum: 0//我发起的
		}
	},
	onShow(){
		if(this.hasLogin){
			this.appInitial();
		}
	},
	methods:{
		// 验证登录
		callback (data) {
			if(!data.isLogin){
				this.onGotUserInfo();
				return;
			}
			this.navigatePageTo(data.path, data.type)
		},
		appInitial(){
			this.getProfileInfo();
			this.getFormNum();
		},
		/**
		 * 获取表单数量
		 */
		getFormNum(){
			this.$http.post(`${formNum}`,{}).then(res => {
				let records = res.records;
				this.attendNum = records.formAttendNum;
				this.selfNum = records.formSelfNum;
				this.activityAttendNum = records.activityAttendNum;
				this.activitySelfNum = records.activitySelfNum;
			});
		},
		showContactPopou(){
			this.$refs.share.animation = true;
			this.$refs.share.open();
		},
		// 关闭
		pupouClose (ref) {
			this.$refs[ref].close()
		},
		freeTell(phoneNumber){
			uni.makePhoneCall({
				phoneNumber
			});
		},
		/**
		 * @param {Object} flag
		 * 1.我发起的
		 * 2.我参与的
		 */
		toFormList(flag){
			this.navigateTo('/pages/profile/form/list','page', `current=${ flag }`,this.callback);
		},
		/**
		 * @param {Object} flag
		 * 0.发起活动
		 * 1.参与活动
		 */
		toActivityList(flag){
			this.navigateTo('/pages/profile/activity/list','page', `current=${ flag }`,this.callback);
		},
		toPath(path){
			this.navigateTo(path,'page', '',this.callback);
		}
	}
}
</script>

<style lang="scss" scoped>
	.app-container{
		image{
			width: 100%;
			height: 100%;
		}
		button{
			background: none;
			padding: 0;
			text-align: left;
			overflow: auto;
			&::after{
				border: none;
			}
		}
		.title-main{
			align-items: center;
			padding: 30upx 30upx 100upx;
			background-image: url(../../static/img/icon/title_bg.png);
			background-size: 100% 100%;
			background-color: $base-color;
			.avatar,.default-avatar{
				width: 106upx;
				height: 106upx;
				image{
					border-radius: 99%;
				}
			}
			.default-avatar{
				background: #EEEEEE;
				border-radius: 99%;
				line-height: 106upx;
				text-align: center;
			}
			.login-btn{
				margin-left: 20upx;
				background-color: $base-color;
				color: #FFFFFF;
				padding: 10upx 20upx;
				border-radius: 9upx;
			}
			.user-info{
				margin-left: 20upx;
				color: #FFFFFF;
				.nickname{
					margin-bottom: 10upx;
					font-size: 36upx;
					font-weight: bold;
				}
				.phoneNum{
					font-size: $font-lg;
				}
			}
		}
		.app-main{
			margin: 0 20upx;
			margin-top: -50upx;
			z-index: 99;
			.count-main{
				border-radius: 19upx;
				padding: 40upx 0;
				background: #FFFFFF;
				.count-item{
					text-align: center;
					.label{
						font-size: $font-secondary;
					}
					.num{
						font-size: 52upx;
						color: $base-color;
						margin-bottom: 4upx;
					}
				}
			}
			.menu-main{
				background: #FFFFFF;
				border-radius: 8upx;
				margin: 40upx 0;
				padding: 20rpx 20rpx 30rpx;
				.menu-item{
					height: 100upx;
					line-height: 100upx;
					align-items: center;
					.icon{
						width: 30upx;
						height: 30upx;
					}
					.line{
						position: relative;
						&::before{
							content: '';
							position: absolute;
							left: 0;
							right: 0;
							bottom: 0;
							border-bottom: 2upx solid #999999;
							opacity: .1;
							margin-left: 20upx;
						}
						.name{
							margin-left: 24upx;
						}
						.icon-right{
							color: #666666;
							opacity: .9;
							font-size: 40upx;
						}
					}
				}
			}
		}
		.footer{
			text-align: center;
			color: #999999;
			font-weight: bold;
			opacity: .5;
		}
	}
	.p-list-item{
		font-size: $font-lg;
		.p-item{
			text-align: center;
			height: 90upx;
			line-height: 90upx;
			.service-btn{
				width: 100%;
			}
		}
		
		:first-child{
			line-height: 90upx;
			text-align: center;
			margin: 0;
		}
		:not(:last-child){
			    border-bottom: 2rpx solid #f7f7f7;
		}
	}
</style>
