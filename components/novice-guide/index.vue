<template>
	<view class="app-container">
		<view class="main-item">
			<view class="title">任务步骤</view>
			<view v-html="taskStep"></view>
		</view>
		<view class="main-item mt10">
			<view class="title">注意事项</view>
			<view v-html="noticeItem"></view>
		</view>
		<view class="main-item mt10">
			<view class="title">订单截图模板</view>
			<template v-if="(type === 0 || type === 1) && meituanPicList.length">
				<view class="template-title meituan">美团模板</view>
				<view class="pic-list flex">
					<view class="pic-item flex"  v-for="(picUrl,index) in meituanPicList" :key="picUrl">
						<view class="li meituan">{{ index + 1 }}</view>
						<view class="pic" @tap.stop="previewImage(1)">
							<image :src="picUrl" mode=""></image>
						</view>						
					</view>
				</view>				
			</template>
			<template v-if="(type === 0 || type === 2) && meituanPicList.length">
				<view class="template-title elm">饿了么</view>
				<view class="pic-list flex">
					<view class="pic-item flex"  v-for="(picUrl,index) in elmPicList" :key="picUrl">
						<view class="li elm">{{ index + 1 }}</view>
						<view class="pic" @tap.stop="previewImage(2)">
							<image :src="picUrl" mode=""></image>
						</view>						
					</view>
				</view>	
			</template>
		</view>
	</view>
</template>
<script>
	export default{
		name: "novice-guide",
		props:{
			type: {
				type: Number,
				default: 0
			},
			taskStep: String,
			noticeItem: String,
		},
		data(){
			return{
				meituanPicList: [],
				elmPicList: []
			}
		},
		mounted() {
			let meituanPicList = ['meituan-1.png','meituan-2.png','meituan-3.png','meituan-4.png'];
			let elmPicList = ['element-1.png','element-2.png','element-3.png','element-4.png'];
			let baseUrl = this.$mConfig.baseUrl + '/benben/';
			this.meituanPicList = meituanPicList.map(v=>baseUrl+v);
			this.elmPicList = elmPicList.map(v=>baseUrl+v);
		},
		methods:{
			//图片预览
			previewImage(type){
				uni.previewImage({
					urls : type === 1 ? this.meituanPicList : this.elmPicList
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.app-container{
		.flex{
			display: flex;
		}
		.mt10{
			margin-top: 10upx;
		}
		.main-item{
			padding: 24upx;
			background-color: #FFF;
			margin-top: 24upx;
			.title{
				padding-left: 24upx;
				margin-bottom: 10upx;
				border-left: 10upx solid #FFC300;
			}
			.req-content{
				font-size: 26upx;
				height: 60upx;
				line-height: 60upx;
			}
			.template-title{
				width: 60%;
				text-align: center;
				height: 60rpx;
				line-height: 60rpx;
				border-radius: 9upx;
				margin: 40rpx auto 20upx;
			}
			.meituan{
				background-color: #FFC300;
			}
			.elm{
				background-color: #49B1FB;
			}
			.pic-list{
				flex-wrap: wrap;
				justify-content: space-evenly;
				.li{
					width: 60upx;
					height: 60upx;
					line-height: 60upx;
					text-align: center;
					margin: 24upx 0;
					border-radius: 99%;
				}
				.pic-item{
					flex-direction: column;
					align-items: center;
					.pic{
						height: 572upx;
						width: 260upx;
						image{
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
	}
</style>