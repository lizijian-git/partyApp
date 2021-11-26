<template>
	<view class="app-main">
		<navigationCustom :config="config"></navigationCustom>
		<view class="scroll-viewbox" :style="{top:height}">
			<scroll-view  :scroll-y="true" :refresher-enabled="true" :refresher-triggered="triggered" refresher-background="#FED101"
			  @refresherrefresh="onRefresh" @refresherpulling="onFresherpulling">
			<view class="header">
				<view class="avatar" v-if="hasLogin">
					<image :src="userInfo.picUrl" mode=""></image>
				</view>
				<view class="avatar no-login" v-else></view>
				<view v-if="hasLogin" class="basic-info">
					<view class="nickname">
						{{ userInfo.nickname }}
					</view>
					<view v-if="userInfo.agentCode" class="cell-line">
						<view class="agentCode">推广码：{{ userInfo.agentCode }}</view>
						<view class="qrcode" @tap.stop="navigatePageTo('/pages/acount/extend/myQrcode','page')">
							<image src="@/static/img/icon/qrcode.svg" mode=""></image>
						</view>					
					</view>
				</view>
				<view v-if="!hasLogin" class="basic-info">
					<view class="login-btn" @click="onGotUserInfo">
						立即登录
					</view>
				</view>
				<view v-if="globalConfig.mode != 1" class="balance-item" @tap.stop="navigateTo('/pages/acount/balance/index', 'page', '', callback)">
					<view class="label">累计收益(元)
						<view class="iconfont icon-right"></view>
					</view>
					<view class="balance">{{ hasLogin ? $utils.moneyFormat(userInfo.totalRebate) : '****' }}</view>
				</view>
			</view>
			<view class="order-main">
				<view class="title-main" @tap.stop="toOrderList()">
					<view class="title">我的订单</view>
					<view class="order-list">全部订单
						<view class="iconfont icon-right"></view>
					</view>
				</view>
				<view class="items-main">
					<view class="item" @tap.stop="toOrderList(1)">
						<view class="icon">
							<image src="@/static/img/icon/icon_handle.png" mode=""></image>
							<view v-if="userInfo.orderSignNum > 0" class="n-tag">{{ userInfo.orderSignNum }}</view>
						</view>
						<view class="label">待处理</view>
					</view>
					<view class="item" @tap.stop="toOrderList(2)">
						<view class="icon">
							<image src="@/static/img/icon/icon_verify.png" mode=""></image>
							<view v-if="userInfo.orderAuditNum > 0" class="n-tag">{{ userInfo.orderAuditNum }}</view>
						</view>
						<view class="label">待审核</view>
					</view>
					<view class="item" @tap.stop="toOrderList(3)">
						<view class="icon">
							<image src="@/static/img/icon/icon_balance.png" mode=""></image>
							<view v-if="userInfo.orderWaitProfitNum > 0" class="n-tag">{{ userInfo.orderWaitProfitNum }}</view>
						</view>
						<view class="label">通过</view>
					</view>
					<view class="item" @tap.stop="toOrderList(4)">
						<view class="icon">
							<image src="@/static/img/icon/icon_pass.png" mode=""></image>
							<view v-if="userInfo.orderFailNum > 0" class="n-tag">{{ userInfo.orderFailNum }}</view>
						</view>
						<view class="label">不通过</view>
					</view>
				</view>
			</view>
			<view class="menu-list">

				<view class="menu-card">
					<view v-if="hasLogin" class="menu-item">
						<button class="btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
							<view class="icon">
								<image src="@/static/img/icon/icon_telephone.png" mode=""></image>
							</view>
							<text>绑定手机</text>
							<view class="iconfont icon-right"></view>
						</button>
					</view>
					<view class="menu-item" @click="showShareDialog">
						<view class="icon">
							<image src="@/static/img/icon/icon_service.png" mode=""></image>
						</view>
					<text>电话客服</text><view class="iconfont icon-right"></view></view>
					<view class="menu-item" @tap.stop="toRecommend">
						<view class="icon">
							<image src="@/static/img/icon/icon_feedback.png" mode=""></image>
						</view>
					<text>意见反馈</text><view class="iconfont icon-right"></view></view>
				</view>
			</view>

			<view v-if="globalConfig.mode != 1" class="support-info">
				<view class="bg-logo">
					<image src="@/static/img/icon/bg-logo.png" mode=""></image>
				</view>
				<view style="font-weight: bold;">聚喜爱</view>				
			</view>
			<view class="version">v1.0.0</view>
		</scroll-view>
	</view>
	<leePopou type="bottom" ref="share" :round="true" padding="0">
		<view class="p-list-item">
		<view class="cell-line p-item" @tap.stop="pupouClose('share')">
			客服微信 {{ globalConfig.serviceWechat }}
		</view>
		<view class="cell-line slot-box-detail p-item">
			<button class="service-btn" open-type="ph"  @tap.stop="freeTell(globalConfig.servicePhone)">客服电话 {{ globalConfig.servicePhone }}</button>
		</view>
		<view style="height: 10rpx;background-color: #F7F7F7;"></view>
		<view class="cell-line p-item" @tap.stop="pupouClose('share')">
			取消
		</view>
		</view>
	</leePopou>
</view>
</template>
<script>
import { mapGetters } from 'vuex'
import navigationCustom from '@/components/navigationCustom/navigation-custom'
import wechatAuth from "@/utils/wechatAuth";
import leePopou from '@/components/lee-popup/lee-popup'
	export default{
		components: {
			leePopou,
			navigationCustom
		},
		mixins: [wechatAuth],
		computed:{
			...mapGetters(['globalConfig']),
			height() {
				const {platform, statusBarHeight} = uni.getSystemInfoSync()
				let height = statusBarHeight + 4 //ios 24px
				if (platform.toLowerCase() == "android" ){
					height +=4 //android 28px
				}
				// 胶囊高度 32px 下边框6px height 状态栏高度
				return height+ 38 + "px"
			}
		},
		data(){
			return{
				config:{
					type: 2,
					fontcolor:"#000",
					height: "556rpx",
					backgroundUrl: require("@/static/img/icon/title_bg.png"),
					title: "个人中心"
				},
				triggered: false,
				menuList1:[{ name: "支付宝资料",icon: "icon-zhifubao" },{ name: "领红包",icon: "icon-zhinanzhen" }],
				menuList2:['电话客服'],
				menuList3:[{ name: "意见反馈",icon: "icon-feedback" },{ name: "关于我们",icon: "icon-aboutus" }],
				menuList4:['我的门店']
			}
		},
		onLoad() {},
		onShow() {
			if (this.hasLogin) {
				uni.showLoading({title: "加载中"});
				this.getProfileInfo().then(()=>{
					uni.hideLoading();
				})
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
			toOrderList(index=0){
				this.navigateTo('/pages/suborder/list', 'page', `currentIndex=${index}`, this.callback);
			},
			// 调起分享
			showShareDialog () {
				this.$refs.share.animation = true;
				this.$refs.share.open()
			},
			// 关闭
			pupouClose (ref) {
				this.$refs[ref].close()
			},
			onFresherpulling(e){
				if(e.detail.dy <= 0){
					this.triggered = false;
				}else{
					this.triggered = true;
				}
			},
			freeTell(phoneNumber){
				uni.makePhoneCall({
					phoneNumber
				});
			},
			toAppStore(item){
				//跳转到我的门店 1：判断是否已经入驻门店
				if(!this.hasLogin){
					this.onGotUserInfo();
					return;
				}
				if( ~~item.auditStatus === 0){
					return this.$mHelper.toast("门店信息审核中,可联系客服")
				}
				let storeStatus = ~~item.status;
				switch(storeStatus){
					case 0: this.$mHelper.toast("门店信息审核中,可联系客服");break;
					case 1: this.navigateTo('/pages/mall/index', 'page', `id=${ item.id }`, false);break;
					case 2: this.$mHelper.toast("门店信息审核失败,请联系客服处理");break;
				}
			},
			// 进入审核中心
			toMallAudit(){
				this.navigateTo('/pages/acount/audit/index', 'page', '',this.callback);
			},
			toRecommend(){
				this.navigateTo('/pages/acount/feedback/index','page','',this.callback);
			},
			// 进入推广中心
			toMallExtend(){
				this.navigateTo('/pages/acount/extend/index', 'page', '',this.callback);
			},
			// 跳转到商家入驻表单填写页面
			toMallSettleForm(){
				let storeId = this.userInfo.storeId;
				let params = storeId ? `id=${ storeId }` : '';
				this.navigateTo('/pages/mall/settleForm', 'page', params,this.callback);
			},
			onRefresh(){
				this.triggered = true;
				if(this.hasLogin){	
					uni.showLoading({title: "加载中"});
					this.getProfileInfo().then(()=>{
						uni.hideLoading();
						this.triggered = false;
					})				
				}else{
					setTimeout(()=>{
						this.triggered = false
					},500);
				}
			}
		}
	}
</script>
<style>
	page{
		overflow: hidden;
	}
</style>
<style lang="scss" scoped>
	.app-main{
		padding-bottom: 200upx;
		.scroll-viewbox{
			position: fixed;
			bottom: 0;
			width: 100%;
			scroll-view{
				height: 100%;
			}
		}
		image{
			width: 100%;
			height: 100%;
		}
		.header{
			// background-color: #FED101;
			padding: 32upx;
			display: flex;
			align-items: center;
			.avatar{
				width: 128upx;
				height: 128upx;
				image{
					border-radius: 99%;
				}
			}
			.no-login{
				background-color: #F1F1F1;
				border-radius: 199upx;
				font-size: 28upx;
				position: relative;
				&::after{
					content: "未登录";
					position: absolute;
					top: 50%;
					left: 50%;
					white-space: nowrap;
					transform: translate(-50%,-50%);
				}
			}
			.basic-info{
				margin-left: 16upx;
				flex: 1;
				.nickname{
					font-size: 32upx;
				}
				.cell-line{
					display: flex;
					align-items: center;
					margin-top: 10upx;
					.agentCode{
						font-size: 28upx;
						margin-right: 20upx;
					}
					.qrcode{
						width: 40upx;
						height: 40upx;
					}
				}
				.login-btn{
					background-color: #F1F1F1;
					font-size: 28upx;
					width: max-content;
					padding: 10upx;
					border-radius: 10upx;
				}
			}
			.balance-item{
				font-size: 28upx;
				.label{
					.iconfont{
						font-size: 40upx;	
					}
					display: flex;
					align-items: center;
				}
				.balance{
					font-size: 36upx;
					font-weight: bold;
					text-align: center;
					color: #333333;
				}
			}
		}
		.order-main{
			margin: 24upx;
			padding: 0 24upx;
			background: #FFFFFF;
			border-radius: 16upx;
			.title-main{
				display: flex;
				padding: 24upx;
				border-bottom: 2upx solid #EEEEEE;
				.title{
					color: #333333;
					font-size: 32upx;
					flex: 1;
				}
				.order-list{
					display: flex;
					align-items: center;
					color: #333333;
					font-size: 24upx;
				}
			}
			.items-main{
				display: flex;
				padding: 40upx 0;
				.item{
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					.icon{
						width: 56upx;
						height: 56upx;
						margin-bottom: 8upx;
						position: relative;
					}
					.n-tag{
						position: absolute;
						left: 32upx;
						top: -12upx;
					}
					.label{
						font-size: 24upx;
					}
				}
			}
		}
		.n-tag{
			background: #FE4343;
			font-size: 24upx;
			color: #fff;
			width: 36upx;
			height: 36upx;
			line-height: 34upx;
			text-align: center;
			border-radius: 99%;
			border: 2upx solid #FFFFFF;
		}
		button{
			margin: 0;
			padding: 0;
			font-size: inherit;
			border-radius: 0;
			background: inherit;
			text-align: left;
			&.button-hover{
				color: inherit;
				background-color: inherit;
			}
			&::after{
				border: none;
			}
		}
		.font-size-base{
			font-size: $font-base;
		}
		.no-login{
			.avatar{
				&::after{
					content: "未登录";
					white-space: nowrap;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%);
				}
			}
		}
		.weixin-info{
			height: 260upx;
			background-color: #fff;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.avatar{
				width: 150upx;
				height: 150upx;
				border-radius: 99%;
				margin-bottom: 16upx;
				background-color: #DDDDDD;
				position: relative;
				image{
					width: 100%;
					height: 100%;
					border-radius: 99%;
				}
			}
		}
		.nav-tab{
			display: flex;
			background-color: #fff;
			margin: 20upx 0;
			padding: 40upx 0;
			view{
				flex: 1;
				text-align: center;
				&:not(:last-child){
					border-right: 2upx solid #DDDDDD;
					box-sizing: border-box;
				}
			}
		}
		
		.menu-list{
			margin: 0 24upx;
			.menu-card{
				background-color: #fff;
				border-radius: 16upx;
				&:first-child{
					margin-bottom: 24upx;
				}
				.menu-item{
					padding: 24upx;
					display: flex;
					align-items: center;
					&:not(:last-child){
						border-bottom: 2upx solid #EEEEEE;
					}
					.btn{
						display: flex;
						flex: 1;
						align-items: center;
						line-height: 0;
					}
					text{
						flex: 1;
						margin-left: 16upx;
						color: #333333;
						font-size: 28upx;
					}
					.icon{
						width: 40upx;
						height: 40upx;
						image{
							border-radius: 9upx;
						}
					}
					.tag{
						font-size: 28upx;
						background-color: #909399;
						color: #EEE;
						padding: 6upx 10upx;
						border-radius: 9upx;
						&.success{
							background-color: #67C23A;
						}
						&.fail{
							background: #F56C6C;
						}
						&.break{
							background: #ff8102;;
						}
					}
					.iconfont.icon-right{
						font-size: 46upx;
						color: #c3c3c3;
					}
					.icon-bottom{
						transform: rotate(90deg);
					}
				}
			}
		}
		.version{
			margin-bottom: 10upx;
		}
		.support-info{
			margin-top: 36upx;
			font-size: 30upx;
			color: #acacac;
			display: flex;
			align-items: center;
			justify-content: center;
			.bg-logo{
				width: 50upx;
				height: 50upx;
				margin-right: 16upx;
			}
		}
		.version{
			color: #acacac;
			font-size: 26upx;
			text-align: center;
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
	}
</style>