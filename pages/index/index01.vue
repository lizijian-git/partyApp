<template>
	<view>
		<navigationCustom :address="address" @chooseLocation="chooseLocation"></navigationCustom>
		<scroll-view class="scroll-viewbox" scroll-y="true" :style="{top:height}" :refresher-enabled="true" :refresher-triggered="triggered" 
			:refresher-threshold="100" refresher-background="#FED101" @refresherrefresh="onRefresh" @refresherpulling="onFresherpulling" @scrolltolower="doQuery">
			<view class="app-main">
			<!-- 轮播图 -->
			 <view class="swiper-warpper">
				 <view v-if="orderRemindList.length" class="order-swiper">
					 <swiper class="order-remind" :circular="circular" :vertical="true" :autoplay="autoplay" :interval="interval" :duration="duration">
						<block v-for="(item,index) in orderRemindList" :key="index">
							 <swiper-item>
								 <image :src="item.userPicUrl" mode=""></image>
								 <view class="swiper-item">{{ $utils.formatPassTime(item.createTime) }}{{ item.userNickname }}报名了{{ item.storeName }}</view>
							 </swiper-item>
						 </block>
					 </swiper>
				 </view>
				 <view class="swiper">
					 <swiper :circular="circular" :autoplay="autoplay" :interval="interval" :duration="duration">
						<block v-for="(item,index) in swiperItem" :key="index">
							 <swiper-item>
								 <image class="swiper-item" :src="item.picUrl" mode=""></image>
								 <!-- <view class="swiper-item">{{ index }}</view> -->
							 </swiper-item>
						 </block>
					 </swiper>				 
				 </view>
			 </view>
			 <view v-if="globalConfig.mode != 1" class="font-size-base step">
				<view><view class="iconfont icon-success"></view>报名活动</view>
				<view><view class="iconfont icon-success"></view>消费下单</view>
				<view><view class="iconfont icon-success"></view>提交资料</view>
				<view><view class="iconfont icon-success"></view>领取返利</view>	
			 </view>

			 <view class="option-tab-warp">
					 <view class="option-block" @click="toMiniProgram(mtAppId)">
						 <view class="item-icon">
							<image src="../../static/img/icon/meituan.png" mode=""></image>
						 </view>
						 <view class="item-label">美团</view>
					 </view>
					 <view class="option-block" @click="toMiniProgram(elmAppId)">
						 <view class="item-icon">
							<image src="../../static/img/icon/elm.png" mode=""></image>
						 </view>
						 <view class="item-label">饿了么</view>
					 </view>
					 <view v-if="globalConfig.mode != 1" class="option-block" @click="navigateTo('/pages/acount/about/index', 'page', ``)">
						 <view class="item-icon">
							<image src="../../static/img/icon/guide.png" mode=""></image>
						 </view>
						 <view class="item-label">新手指南</view>
					 </view>
					 <view class="option-block" @click="toMallSettleForm()">
						 <view class="item-icon">
							<image src="../../static/img/icon/mallSettled.png" mode=""></image>
						 </view>
						 <view class="item-label">商家入驻</view>
					 </view>
			 </view>
			<view class="tab-list">
				<pageEmpty :total="iTotalRecords"></pageEmpty>
				 <view class="tab-item" v-for="(item,index) in activityList" :key="index" @click="toDetail(item)">
					 <view class="tab-main">
						 <view class="store-pic">
							 <image :src="item.mainUrl" mode=""></image>
							 <view v-if="item.resetNum === 0" class="sold-out">已售罄</view>
						 </view>
						 <view class="store-info">
							<view class="main-item">
								<view class="storeName">
									{{ item.storeName }}
								</view>
								<text class="distance">{{ item.distance }}km</text>
							</view>
							<view class="main-item">
								<view v-if="globalConfig.mode != 1" class="font-rebate">平台返利<text class="font-price">{{ item.rebateAmount }}</text>元</view>
								<view v-else class="font-rebate">每份<text class="font-price">{{ item.rebateAmount }}</text>元</view>
								<view class="font-time">{{ item.startTime | formatDate('hh:mm') }}-{{ item.endTime | formatDate('hh:mm') }}</view>
							</view>
						</view>
					 </view>
					 <view class="tab-footer">
						 <view class="tag-warp">
							<view :class="['tag',item.platformType === 1 ? 'meituan' : 'elm']">{{ item.platformType === 1 ? '美团' : '饿了么' }}</view>					 
						 </view>
						 <text class="desc">今日还有{{ item.resetNum }}份</text>
						 <view v-if="item.duringActivity === -1" class="status-btn default">未开始<view class="iconfont icon-right"></view></view>
						 <view v-else-if="item.resetNum === 0" class="status-btn status_0">已抢光<view class="iconfont icon-right"></view></view>
						 <view v-else-if="item.duringActivity === 0" class="status-btn default">已结束<view class="iconfont icon-right"></view></view>
						 <view v-else class="status-btn">抢名额
							<view class="iconfont icon-right"></view>
						 </view>
					 </view>
				</view>
			</view>
		</view>
		</scroll-view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex';
	import wechatAuth from "@/utils/wechatAuth";
	import { getOrderList,getAppStoreActivityList,getAdvertisementList } from  '@/api/basic'
	import navigationCustom from '@/components/navigationCustom/navigation-custom'
	export default{
		components: {
			navigationCustom
		},
		mixins: [wechatAuth],
		data(){
			return{
				mtAppId: "wx2c348cf579062e56",
				elmAppId: "wxece3a9a4c82f58c9",
				triggered: false,
			    autoplay: true,
				interval: 3000,
				circular:true,
				duration: 500,
				activityList: [],
				orderRemindList:[],
				qObj: {
					pageNum: 1,
					pageSize: 10,
					latitude: '',
					longitude: ''
				},
				swiperItem:[],
				address: "点击获取当前位置"
			}
		},
		onLoad(){
			this.getLocation();
			this.appInitial();
		},
		// onShow () {
		// 	this.getLocation();
		// 	this.appInitial();
		// },
		computed:{
			...mapGetters(['globalConfig']),
			iTotalRecords(){
				return this.activityList.length;
			},
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
		// onHide() {
		// 	this.qObj.longitude = '';
		// 	this.qObj.latitude = '';
		// },
		methods:{
			onFresherpulling(e){
				if(e.detail.dy <= 0){
					this.triggered = false;
				}else{
					this.triggered = true;
				}
			},
			// 获取定位信息
			getLocation(type){
				if( type != 'onRefresh' && this.qObj.latitude && this.qObj.longitude){
					console.log(this.qObj.latitude,this.qObj.longitude,"aaaaaaaa");
					this.getAppStoreActivityList();
					return;
				}
				// uni.showLoading({
				// 	title: "加载中"
				// });
				this.reverseGeocoder().then(res=>{
					let address = res.result.formatted_addresses.recommend;
					this.qObj.latitude = res.result.location.lat;
					this.qObj.longitude = res.result.location.lng;
					this.address = address;
					uni.hideLoading();
					this.getAppStoreActivityList();
				}).catch(err=>{
					// uni.hideLoading();
					if(err.status === 1000){
						this.getAppStoreActivityList();
					}else{
						uni.showToast({
							title: "获取位置信息失败",
							icon: 'none'
						})						
					}
				});
			},
			//获取初始化接口信息
			appInitial(){
				this.getOrderList();
				this.getAdvertisementList();
				if(this.hasLogin){
					let shareId = this.$store.state.userInfo.id;
					this.$set(this.wxshare,'path',`/pages/index/index?shareId=${ shareId }`)
				}
			},
			// 跳转到商家入驻表单填写页面
			toMallSettleForm(){
				let storeId = this.$store.state.userInfo.storeId;
				let params = storeId ? `id=${ storeId }` : '';
				this.navigateTo('/pages/mall/settleForm', 'page', params,this.callback);
			},
			// 验证登录
			callback (data) {
				if(!data.isLogin){
					this.onGotUserInfo();
					return;
				}
				this.navigatePageTo(data.path, data.type)
			},
			doQuery(){
				let { pageNum } = this.qObj;
				this.qObj.pageNum = pageNum + 1;
				this.getAppStoreActivityList();
			},
			//商家活动列表
			getAppStoreActivityList(){
				let { pageNum } = this.qObj;
				if(pageNum === 1){
					this.activityList = [];
				}
				uni.showLoading({
					title: "加载中"
				});
				this.$http.post(`${getAppStoreActivityList}`,this.qObj).then(res => {
					uni.hideLoading();
					let records = res.records;
					// if(records.length == 0){
					// 	uni.showToast({
					// 		title: "亲，暂无更多数据",
					// 		icon: 'none'
					// 	})	
					// }
					records.map((v)=>{
						v.distance = v.distance.toFixed(2)
						v.duringActivity = this.$utils.checkAuditTime(v.startTime,v.endTime)
					})
					this.activityList = [...this.activityList,...records];
					this.triggered = false;
				}).catch(err=>{
					uni.hideLoading();
				});
			},
			getOrderList(){
				let params = {
					isToday: 1,
					orderType: 1,
					isSignUp: 1
				};
				this.$http.post(`${getOrderList}`,params).then(res => {
					this.orderRemindList = res.records.aaData;
				})
			},
			toDetail(data){
				this.navigateTo('/pages/product/detail', 'page', `id=${ data.id }&distance=${ data.distance }`, this.callback)
			},
			getAdvertisementList(){
				this.$http.post(`${getAdvertisementList}`,{ position: 1 }).then(res => {
					this.swiperItem = res.records.aaData;
				});
			},
			onRefresh(){
				this.triggered = true;
				this.qObj.pageNum = 1;
				this.getLocation("onRefresh");
				this.appInitial();
			},
			toMiniProgram(appId){
				var _this = this;
				// #ifdef MP-WEIXIN
				wx.navigateToMiniProgram({
					appId,
					success: (res) => {},
					fail: (err) => {}
				})
				// #endif
			},
			// 打开地图选择定位
			chooseLocation(){
				var _this = this;
				uni.chooseLocation({
				    success: (res) => {
				        console.log('位置名称：' + res.name);
						this.qObj.latitude = res.latitude;
						this.qObj.longitude = res.longitude;
				        this.address = res.address;
						this.qObj.pageNum = 1;
						this.activityList = [];
						this.getAppStoreActivityList();
				    },
					fail: (err) => {
						if(err.errMsg === "chooseLocation:fail auth deny"){
							uni.showModal({
								content: '检测到您没打开获取地址权限，是否去设置打开？',
								confirmText: '确认',
								cancelText: '取消',
								success(res) {
									if(res.confirm){
										uni.openSetting({
											success(re) {
												if(re.authSetting['scope.userLocation']){
													_this.chooseLocation();
												}
											}
										})										
									}
								}
							})
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
.scroll-viewbox{
	position: fixed;
	bottom: 0;
	.app-main{
		padding: 0 20upx;
	}
}
.base-color{
	color: $base-color;
}
.swiper-warpper{
	position: relative;
	.swiper{
		border-radius: 19upx;
		overflow: hidden;
		.swiper-item{
			width:100%;
			height:100%;
			-webkit-transform: rotate(0deg);
		}
	}
	.order-swiper{
		position: absolute;
		top: 16upx;
		left: 16upx;
		right: 0;
		z-index: 2;
		.order-remind{
			height: 48upx;
			font-size: 24upx;
			width: 66%;
			color: #fff;
			border-radius: 24upx;
			background: rgba(96, 98, 102, 0.68);
			swiper-item{
				display: flex;
				align-items: center;
				white-space: nowrap;
				image{
					width: 36upx;
					height: 36upx;
					border-radius: 99upx;
					margin-left: 16upx;
					margin-right: 8upx;
					flex-shrink: 0;
					border: 4upx solid #FFF;
				}
				.swiper-item{
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
}
.step{
	display: flex;
	margin-top: 24upx;
	justify-content: space-around;
	font-size: 24upx;
	color: #333333;
	view{
		display: flex;
		align-items: center;
	}
}

.option-tab-warp{
	background-color: #fff;
	margin-top: 20upx;
	padding: 24upx 0;
	border-radius: 16upx;
	font-size: 28upx;
	display: flex;
	.option-block{
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		.item-icon{
			width: 88upx;
			height: 88upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.item-label{
			margin-top: 8upx;
			color: #666666;
			text-align: center;
		}	
	}
}
.tab-item{
	background-color: #fff;
	margin-top: 20upx;
	padding: 24upx;
	border-radius: 16upx;
	&:last-child{
		margin-bottom: 30upx;
	}
	.tab-main{
		display: flex;
		.store-pic{
			position: relative;
			flex-shrink: 0;
			width: 146upx;
			height: 136upx;
			image{
				width: 100%;
				height: 100%;
				border-radius: 9upx;
			}
			.sold-out{
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				background: rgba(0, 0, 0, 0.5);
				color: #FFF;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.store-info{
			flex: 1;
			display: flex;
			flex-direction: column;
			margin-left: 16upx;
			.storeName{
				color: #333333;
				font-weight: bold;
				font-size: 32upx;
				flex: 1;
			}
			.distance{
				font-weight: normal;
				color: #666666;
				font-size: 24upx;
			}
			.main-item{
				display: flex;
				align-items: center;
				margin-bottom: 10upx;
				.font-rebate{
					flex: 1;
					color: #333333;
					font-size: 30upx;
					.font-price{
						color: #FE4343;
						font-size: 40upx;
					}
				}
				.font-time{
					font-size: 28upx;
					color: #FE4343;
				}
			}
		}
	}
	.tab-footer{
		margin-top: 4upx;
		font-size: 28upx;
		display: flex;
		align-items: center;
		.tag-warp{
			width: 146upx;
		}
			.tag{
				&.meituan{
					background: rgba(255, 195, 0, 0.2);
					border: 2upx solid #FFC300;
					color: #333333;
				}
				&.elm{
					background: rgba(0, 160, 240, 0.2);
					border: 2upx solid #00A0F0;
					color: #00A0F0;
				}
				width: max-content;
				height: 40upx;
				line-height: 40upx;
				margin: 0 auto;
				padding: 0 30upx;
				border-radius: 24upx;
			}
		.desc{
			flex: 1;
			margin-left: 16upx;
		}
		.status-btn{
			background: #FFC300;
			border-radius: 4px;
			display: flex;
			justify-content: center;
			width: 140rpx;
			height: 56upx;
			line-height: 56upx;
			&.default{
				background: #CCCCCC;
			}
			&.status_0{
				background: #F56C6C;
				color: #FFF;
			}
		}
	}
}
</style>
