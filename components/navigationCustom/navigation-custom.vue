<template>
	<view class="navigation-bar" :style="{height:height}">
		<view class="navigation-bg" :style="{height:config.height}">
			<image :src="config.backgroundUrl" mode=""></image>
		</view>
		<view class="navigation-bar-fixed">
			<view v-if="config.type === 1" class="navigation-bar-textbox address-main" :style="{top:marginTop,height:buttonHeight,lineHeight:buttonHeight}">
				<image class="icon" src="../../static/img/icon/icon_location.png" mode=""></image>
				<view class="address" @tap.stop="chooseLocation">
					<view class="text">{{ address }}</view>
					<text class="iconfont icon-right"></text>	
				</view>
			</view>
			<!-- custom button -->
			<view v-if="[3,4].indexOf(config.type)!= -1" :style="{top:marginTop,height:buttonHeight}"  :class="config.type == 3?'navigation-bar-custom-capsule':'navigation-bar-custom-textbox'">
				<!-- <image v-if="config.menuIcon" class="custom-icon" :src="config.menuIcon"></image> -->
				<view class="button-action program-font icon-arrow-left" @click="back_()"></view>
			</view>
			<!-- title -->
			<view v-if="config.title" class="navigation-bar-title" :style="{marginTop: marginTop,height:buttonHeight,lineHeight:buttonHeight,color: config.fontcolor}">{{config.title}}</view>
			<!-- linear background -->
			<view v-if="config.linear" class="navigation-bar-linear" :style="{height:height,background:config.bgcolor,opacity:scrollTop/scrollMaxHeight}"></view>
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		computed:{
			height() {
				const {platform, statusBarHeight} = uni.getSystemInfoSync()
				let height = statusBarHeight + 4 //ios 24px
				if (platform.toLowerCase() == "android" ){
					height +=4 //android 28px
				}
				// 胶囊高度 32px 下边框6px height 状态栏高度
				return height+ 38 + "px"
			},
			marginTop(){
				const {platform,statusBarHeight} = uni.getSystemInfoSync()
				let height = statusBarHeight +4
				console.log(height)
				if (platform.toLowerCase() == "android" ){
					height +=4
				}
				return height + "px"
			}
		},
		updated() {
			console.log(this.config)
		},
		mounted() {
			console.log(this.config)

		},
		onReady() {
		},
		activated() {
			this.buttonHeight = uni.getMenuButtonBoundingClientRect().height - 1 + "px";
		},
		props:{
			address: {
				type: String
			},
			config:{
				type:Object,
				default(){
					return {
						title:"",
						bgcolor:"",
						type:1,
						linear:false,
						transparent:false,
						height: "360rpx",
						backgroundUrl: "../../static/img/icon/title_bg.png",
						fontcolor:"#000",
						menuIcon:"",
						menuText:""
					}
				}
			},
			scrollTop:{
				type:Number,
				default:0
			},
			scrollMaxHeight:{
				type:Number,
				default:288
			}
		},
		methods:{
			back_(){
				uni.navigateBack({
					delta:1
				});
			},
			home_(){
				uni.switchTab({
					url:"/pages/index/index"
				})
			},
			conduct_(){
				this.$emit("customConduct")
			},
			chooseLocation(){
				this.$emit("chooseLocation")
			}
		}
	}
</script>

<style lang="scss">
	.navigation-bar{
		box-sizing: border-box;
		position: relative;
		.navigation-bg{
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			z-index: -1;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.navigation-bar-fixed{
			width: 100%;
			position: relative;
			top:0;
			box-sizing: border-box;
			height: inherit;
			z-index: 999;
			// background-image: url(../../static/img/icon/title_bg.png);
			// background-size: 100% 100%;
			display: flex;
			justify-content: center;
			.address-main{
				width: 70%;
				white-space: nowrap;
				z-index: 1;
				.icon{
					margin-right: 8upx;
					flex-shrink: 0;
					width: 28upx;
					height: 32upx;
				}
				.address{
					display: flex;
					overflow: hidden;
					.text{
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
					}
				// .address{
				// 	display: flex;
				// 	align-items: center;
				// 	white-space: nowrap;
				// 	z-index: 1;
				// 	width: 70%;
				// }
				}
			}
			.navigation-bar-linear{
				width: 100%;
				position: absolute;
				box-sizing: border-box;
				z-index: -1;
			}
			.navigation-bar-title{
				color: #fff;
				font-size: 32upx;
				white-space: nowrap;
				text-overflow: ellipsis;
				text-align: center;
				font-weight: bold;
			}
			.navigation-bar-custom-capsule{
				position: absolute;
				display: flex;
				align-items: center;
				justify-content: center;
				left: 2px;
				// background-color: rgba(255,255,255,.5);
				border-radius: 16px;
				padding: 0upx;
				// border:0.5px solid rgba(255,255,255,.3);
				box-sizing: border-box;
				overflow: hidden;
				z-index: 9;
				.icon-arrow-left {
						&::before {
							font-size: 14px;
							padding: 16upx 10px;
						}
					}
				.custom-icon{
					width: 45upx;
					height: 45upx;
				}
				.custom-describe{
					font-size: 28upx;
				}
			}
			.navigation-bar-custom-textbox{
				position: absolute;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 32px;
				left: 0px;
				padding: 0 23upx;
				// border:0.5px solid rgba(255,255,255,.3);
				box-sizing: border-box;
				overflow: hidden;
				z-index: 9;
				.custom-icon{
					width: 55upx;
					height: 55upx;
				}
				.custom-describe{
					font-size: 32upx;
				}
			}
			.navigation-bar-textbox{
				position: absolute;
				// height: 32px;
				display: flex;
				align-items: center;
				line-height: 32px;
				height: 32px;
				font-size: 30upx;
				left: 24upx;
				// border:0.5px solid rgba(255,255,255,.3);
				box-sizing: border-box;
				overflow: hidden;
				.button-action{
					flex: 1;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					.button_clear{
						line-height: 1;
						background-color: transparent;
						border: none;
						margin: 0;
						padding: 0;
				    }
					.button_clear::after{
						border:none;
					}
					image{
						width: 60upx;
						height: 60upx;
						padding: 6upx;
						box-sizing: border-box;
					}
				}
				.button-v-line{
					width: 0.5px;
					height: 18px;
					background-color: rgba(0,0,0,.2);
				}
			}
		}
	}

</style>
