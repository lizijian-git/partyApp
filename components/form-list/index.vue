<template>
	<view>
		<c-tabs v-model="current" :scroll="true" :fixed="true" :tabs="tabs" :activeColor="themeColor" :lineColor="themeColor" lineHeight="5rpx"
			  @change="changeTab"></c-tabs>
		<scroll-view
			  :scroll-top="scrollTop"
			  :scroll-y="true"
			  :refresher-enabled="true"
			  class="scroll-viewbox"
			  :refresher-triggered="triggered"
			  refresher-background="#FFF"
			  @refresherpulling="onFresherpulling"
			  @refresherrefresh="onRefresh"
			  @scrolltolower="orderLower">
			  <view class="list-items">
				<view v-for="(item,index) in formList" :key="item.id" class="list-item">
					<view class="cell-line flex al-center font-base">
						<view class="form-title flex-1">{{ item.name }}</view>
						<view class="nums">
							<text class="font-1">{{ ~~item.attendNum }}人</text>
							<text class="font-2">/</text>
							<text class="font-3">已填</text>
						</view>
					</view>
					<view class="cell-line flex tag-list font-base-secondary">
						<view v-for="label in item.label" :key="label" class="tag-item">{{ label }}</view>
					</view>
					<view class="cell-line user-info flex">
						<view class="avatar">
							<image :src="item.picUrl" mode=""></image>
						</view>
						<view class="nickname font-base-secondary">{{ item.nickname }}</view>
					</view>
					<view class="btn font-base-secondary" @tap.stop="toFormDetail(item)">点击进入</view>
				</view>
			  </view>
		</scroll-view>
		<pageEmpty mrTop="210rpx" :total="total"></pageEmpty>
	</view>
</template>
<script>
import cTabs from '@/components/cmap-tabs';
import { listForm } from '@/api/basic.js';
export default{
	components: {
	  cTabs
	},
	props: {
		tabs: {
			type: Array,
			default: () => []
		}
	},
	data(){
		return{
			triggered: false,
			current: 0,
			qObj: {isSelf: 1,pageNum: 1, pageSize: 10}, 
			formList: [],
			total: 0
		}
	},
	methods:{
		changeTab(item, index) {
			this.current = index;
			this.getFormList();
		},
		getFormList(){
			this.qObj.isSelf = this.current === 0 ? 1 : 0;
			this.$http.post(`${ listForm }`,this.qObj).then(res=>{
				let records = res.records;
				let formList = records.aaData;
				formList.map(v=>{
					v.label = v.label.split(",").filter(label=>label)
				});
				this.formList = formList;
				this.total = records.iTotalRecords;
			}).catch(err=>{});
		},
		toFormDetail(item){
			this.navigatePageTo('/pages/profile/form/detail','page',`id=${ item.id }`)
		}
	}
}
</script>
<style>
	page{
		height: auto;
	}
</style>
<style lang="scss" scoped>
	.scroll-viewbox{
		position: fixed;
		top: 70upx;
		bottom: 0;
		overflow-y: scroll;
		.list-items{
			padding: 20upx;
			.list-item{
				position: relative;
				margin-bottom: 28upx;
				padding: 20upx;
				border-radius: 14upx;
				background-image: url(../../static/img/icon/list-bg.png);
				background-size: 100% 100%;
				background-color: #FFFFFF;
				.form-title{
					font-weight: bold;
					font-size: $font-lg;
				}
				.al-center{
					align-items: center;
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
			}	
		}
	}
</style>