<template>
	<view class="app-container">
		<view class="swiper-warpper">
			<view class="swiper">
				<swiper :circular="circular" :autoplay="autoplay" :interval="interval" :duration="duration">
					<block v-for="(item,index) in advertismentList" :key="item.id">
						<swiper-item>
							<image class="swiper-item" :src="item.picUrl" mode=""></image>
						</swiper-item>
					</block>
				</swiper>				 
			</view>
		</view>
		<view class="app-main">
			<view class="tabs flex">
				<view :class="['tab-pane',{ 'active' : current === 0 }]" @tap.stop="handleClick(0)">信息表单</view>
				<view :class="['tab-pane',{ 'active' : current === 1 }]" @tap.stop="handleClick(1)">聚会活动</view>
				<view :class="['tab-pane',{ 'active' : current === 2 }]" @tap.stop="handleClick(2)">年会抽奖</view>
			</view>
			<view class="tab-main">
				<view v-if="current === 0" class="tab-item">
					<view class="list-item" v-for="item in dataList" :key="item.id">
						<view class="cell-line flex al-center font-base">
							<view class="form-title flex-1">{{ item.name }}</view>
							<view class="nums">
								<text class="font-1">{{ ~~item.attendNum }}人</text>
								<text class="font-2">/</text>
								<text class="font-3">已填</text>
							</view>
						</view>
						<view class="cell-line flex tag-list">
							<view v-for="label in item.label" :key="label" class="tag-item">{{ label }}</view>
						</view>
						<view class="cell-line user-info flex">
							<view class="avatar">
								<image :src="item.picUrl" mode=""></image>
							</view>
							<view class="nickname font-base-secondary">{{ item.nickname }}</view>
						</view>
						<view class="btn" @tap.stop="toFormDetail(item)">点击进入</view>
					</view>
					<page-empty :total="total"></page-empty>
				</view>
				<view v-if="current === 1" class="tab-item">
					<view class="list-item" v-for="item in dataList" :key="item.id">
						<view class="cell-line flex al-center font-base">
							<view class="form-title flex-1">{{ item.name }}</view>
							<view class="nums">
								<text class="font-1">{{ ~~item.attendNum }}人</text>
								<text class="font-2">/</text>
								<text class="font-3">参加</text>
							</view>
						</view>
						<view class="cell-line flex tag-list">
							<view v-for="label in item.label" :key="label" class="tag-item">{{ label }}</view>
						</view>
						<view class="cell-line basic-info flex">
							<view class="position">{{ item.city }} | {{ item.region }}</view>
							<view class="date">{{ item.startTime | formatDate("yyyy-MM-dd") }}</view>
						</view>
						<view class="btn" @tap.stop="toActivityDetail(item)">点击进入</view>
					</view>
					<page-empty :total="total"></page-empty>
				</view>
				<view v-if="current === 2" class="tab-item">
					<page-empty text="敬请期待" :total="0"></page-empty>
				</view>
			</view>
		</view>
		<custom-tarbar :selected="0"></custom-tarbar>
	</view>
</template>

<script>
import { listAdvertisement,listForm,listActivityInfo } from '@/api/basic.js';
export default{
	data(){
		return{
			autoplay: true,
			interval: 3000,
			circular:true,
			duration: 500,
			advertismentList: [],
			current: 0,
			query: {
				pageNum: 1,
				pageSize: 10
			},
			dataList: [],
			total: 0
		}
	},
	onLoad(options){},
	onShow() {
		this.current = this.$store.state.tabActive;
		this.getAdvertismentList();
		if(this.current == 0){
			this.getFormList();
		}else if(this.current == 1){
			this.getActivityInfoList();
		}
	},
	methods:{
		getFormList(){
			uni.showLoading({ title: "加载中" });
			this.$http.post(`${listForm}`,this.query).then(res => {
				let records = res.records;
				let dataList = records.aaData;
				dataList.map(v=>{
					v.label = v.label.split(",").filter(label=>label);
				});
				this.dataList = dataList;
				this.total = records.iTotalRecords;
				uni.hideLoading();
			}).catch(err=>{
				uni.hideLoading();
			});
		},
		getActivityInfoList(){
			uni.showLoading({ title: "加载中" });
			this.$http.post(`${listActivityInfo}`,this.query).then(res => {
				let records = res.records;
				let dataList = records.aaData;
				dataList.map(v=>{
					v.label = v.label.split(",").filter(label=>label);
				});
				this.dataList = dataList;
				this.total = records.iTotalRecords;
				uni.hideLoading();
			}).catch(err=>{
				uni.hideLoading();
			});
		},
		getAdvertismentList(){
			this.$http.post(`${listAdvertisement}`,{}).then(res => {
				this.advertismentList = res.records.aaData;
			});
		},
		handleClick(type){
			if( this.current === type )return;
			this.current = type;
			this.$store.commit('setTabActive',this.current);
			this.dataList = [];
			this.total = 0;
			if( type === 0 ){
				this.getFormList();
			}else if( type === 1 ){
				this.getActivityInfoList();
			}
		},
		toFormDetail(item){
			//跳转到表单详情
			let userId = uni.getStorageSync("userInfo").id;
			if(item.enterType === 1 || item.userId == userId){
				this.navigatePageTo('/pages/profile/form/detail','page',`id=${ item.id }`)
			}else if(item.enterType === 2){
				//跳转到表单填写页
				this.navigatePageTo('/pages/profile/form/edit','page',`formId=${ item.id }&source=index`)
			}
		},
		toActivityDetail(item){
			this.navigatePageTo('/pages/activity/detail','page',`id=${ item.id }`)
		}
	}
}
</script>

<style lang="scss" scoped>
	.app-container{
		padding-bottom: calc(70px + constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
		padding-bottom: calc(70px + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
		.swiper-warpper{
			position: relative;
			padding: 20upx 16upx 0;
			background: $base-color;
			.swiper{
				border-radius: 9upx;
				overflow: hidden;
				.swiper-item{
					width:100%;
					height:100%;
					-webkit-transform: rotate(0deg);
				}
			}
		}
		.app-main{
			.tabs{
				padding: 0 36upx;
				background: #FFFFFF;
				color: #161B30;
				font-size: $font-secondary;
				height: 100upx;
				line-height: 100upx;
				.tab-pane{
					margin-right: 30upx;
				}
				.active{
					font-weight: bold;
					font-size: 36upx;
					position: relative;
					&::after{
						content: '';
						position: absolute;
						background-image: url(../../static/img/icon/tab_active_line.png);
						background-size: 100% 100%;
						width: 30px;
						bottom: 4px;
						left: 50%;
						height: 10px;
						transform: translateX(-50%);
					}
				}
			}
			.tab-main{
				padding: 20upx 16upx;
				.tab-item{
					.list-item{
						position: relative;
						margin-bottom: 20upx;
						padding: 20upx;
						border-radius: 14upx;
						background-image: url(../../static/img/icon/list-bg.png);
						background-size: 100% 100%;
						background-color: #FFFFFF;
						.al-center{
							align-items: center;
						}
						.form-title{
							font-weight: bold;
							font-size: $font-lg;
						}
						.nums{
							color: #F32727;
							.font-1{
								font-size: $font-lg;
								font-weight: bold;
							}
							.font-2{
								font-size: $font-secondary;
							}
							.font-3{
								font-size: $font-sm;
							}
						}
						.btn{
							position: absolute;
							background: #E7FCF5;
							color: #04C986;
							font-weight: bold;
							font-size: $font-secondary;
							right: 0;
							bottom: 32upx;
							height: 52upx;
							line-height: 52upx;
							padding-left: 36upx;
							padding-right: 24upx;
							border-top-left-radius: 20upx;
							border-bottom-left-radius: 20upx;
							border-right: none;
						}
						.tag-list{
							margin: 16upx 0;
							font-size: 20upx;
							.tag-item{
								height: 38upx;
								line-height: 38upx;
								padding: 0 10upx;
								background: #F4F4F5;
								color: #666666;
								border-radius: 9upx;
								margin-right: 10upx;
							}
						}
						.user-info{
							align-items: center;
							margin-bottom: 14upx;
							.avatar{
								width: 40upx;
								height: 40upx;
								image{
									width: 100%;
									height: 100%;
									border-radius: 99%;
								}
							}
							.nickname{
								margin-left: 16upx;
							}
						}
						.basic-info{
							color: #333333;
							font-size: $font-secondary;
							height: 40upx;
							line-height: 40upx;
							margin-bottom: 14upx;
							.position{
								margin-right: 20upx;
							}
						}
					}
				}
			}
		}
	}
</style>
