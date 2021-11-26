<template>
	<view class="app-container">
		<view class="cell-line flex font-base">
			<view class="form-title flex-1">我是表单名称</view>
		</view>
		<view class="cell-line flex tag-list font-base-secondary">
			<view class="tag-item">标签1</view>
			<view class="tag-item">标签2</view>
			<view class="tag-item">标签3</view>
		</view>
		<view class="main-item font-base-secondary">
			<view class="cell-line flex">
				<view class="form-item flex flex-1">
					<view class="icon">
						<image src="../../static/img/icon/icon_activity.png" mode=""></image>
					</view>
					<view class="basic-info">
						<view class="label">发布时间</view>
						<view class="value">2021-10-14 15:04</view>
					</view>
				</view>
				<view class="form-item flex flex-1">
					<view class="icon">
						<image src="../../static/img/icon/icon_activity.png" mode=""></image>
					</view>
					<view class="basic-info">
						<view class="label">截止时间</view>
						<view class="value">2021-10-14 15:04</view>
					</view>
				</view>
			</view>
			<view class="cell-line flex">
				<view class="form-item flex flex-1">
					<view class="icon">
						<image src="../../static/img/icon/icon_activity.png" mode=""></image>
					</view>
					<view class="basic-info">
						<view class="label">发布者</view>
						<view class="value user-info flex">
							<view class="avatar">
								<image :src="avatar" mode=""></image>
							</view>
							<view class="nickname">这是我的昵称</view>
						</view>
					</view>
				</view>
				<view class="form-item flex flex-1">
					<view class="icon">
						<image src="../../static/img/icon/icon_activity.png" mode=""></image>
					</view>
					<view class="basic-info">
						<view class="label">联系电话</view>
						<view class="value">15245678910</view>
					</view>
				</view>
			</view>
			<view class="cell-line flex">
				<view class="form-item flex flex-1">
					<view class="icon">
						<image src="../../static/img/icon/icon_activity.png" mode=""></image>
					</view>
					<view class="basic-info">
						<view class="label">备注要求</view>
						<view class="value">我是填写人的昵称</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data(){
		return{
			avatar: 'https://yingdioss.oss-cn-shenzhen.aliyuncs.com/img/user/20201121/2020112116534736934973647LFADL3670.jpg',
		}
	},
}
</script>

<style lang="scss" scoped>
	.app-container{
		padding: 20upx;
		image{
			width: 100%;
			height: 100%;
		}
		.tag-list{
			margin: 20upx 0;
			.tag-item{
				height: 50upx;
				line-height: 50upx;
				padding: 0 10upx;
				border: 2upx solid #EEEEEE;
				border-radius: 9upx;
				margin-right: 10upx;
			}
		}
		.main-item{
			border: 2upx solid #000000;
			border-radius: 9upx;
			padding: 20upx;
			.cell-line{
				margin-bottom: 20upx;
				.form-item{
					.icon{
						width: 30upx;
						height: 30upx;
					}
					.basic-info{
						margin-left: 10upx;
						.label{
							margin-bottom: 8upx;
						}
						.user-info{
							align-items: center;
							.avatar{
								width: 50upx;
								height: 50upx;
								image{
									border-radius: 99%;
								}
							}
							.nickname{
								margin-left: 10upx;
							}
						}
					}
				}
			}
		}
	}
</style>
