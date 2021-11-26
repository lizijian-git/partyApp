<template>
	<view class="app-container">
		<view class="success-warp">
			<icon type="success" :color="themeColor" size="94"/>
			<view class="tips">表单提交成功!</view>
		</view>
		<view class="btn-group">
			<button open-type="share" class="share-btn">分享好友</button>
			<view class="btn" @tap.stop="navigatePageTo('/pages/index/index','tab')">回到首页</view>
		</view>
	</view>
</template>

<script>
import { formDetail } from '@/api/basic.js';
import wechatAuth from "@/utils/wechatAuth";
export default {
	mixins: [wechatAuth],
	data() {
		return {
			id: ''
		}
	},
	onLoad(options){
		this.id = options.id;
		this.sceneType = 1;
		this.bizId = this.id;
		this.getFormDetail();
	},
	methods: {
		/**
		 * 获取表单详情
		 */
		getFormDetail(){
			let userId = uni.getStorageSync("userInfo").id;
			this.$http.post(`${formDetail}`,{ userId,id: this.id }).then(res => {
				let records = res.records;
				let formInfo = records.formInfo;
				if(this.hasLogin){
					let shareTitle = `${ this.userInfo.nickname }邀请您填写《${ formInfo.name }》`
					this.$set(this.wxshare,'title',shareTitle);
				}
				if(formInfo.enterType == 1){
					//用户转发进入表单详情页
					this.$set(this.wxshare,'path',`pages/profile/form/detail?id=${ formInfo.id }`);
				}else if(formInfo.enterType == 2){
					//用户转发进入表单填写页
					this.$set(this.wxshare,'path',`pages/profile/form/edit?formId=${ formInfo.id }`);
				}
				uni.hideLoading();
			});
		},
	},
}
</script>

<style>
	page{
		background: #FFFFFF;
	}
</style>
<style lang="scss" scoped>
	.app-container{
		.success-warp{
			text-align: center;
			padding: 60upx 0;
			.tips{
				margin-top: 20upx;
			}
		}
		.btn-group{
			button{
				font-size: inherit;
				padding: 0;
				margin: 0;
				background: none;
				&::after{
					border: none;
				}
			}
			width: 60%;
			margin: 0 auto;
			text-align: center;
			.share-btn{
				background: $base-color;
				color: #FFFFFF;
				height: 80upx;
				line-height: 80upx;
				margin-bottom: 20upx;
			}
			.btn{
				border: 2upx solid $base-color;
				color: $base-color;
				height: 80upx;
				line-height: 80upx;
				border-radius: 10upx;
			}
		}
	}
</style>