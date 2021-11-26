<template>
	<view class="app-container">
		<view class="form-warpper">
			<view class="cell-line flex font-base">
				<view class="form-title flex-1">{{ formInfo.name }}</view>
			</view>
			<view class="cell-line flex tag-list font-base-secondary">
				<view class="tag-item" v-for="label in formInfo.label" :key="label">{{ label }}</view>
			</view>
			<view class="main-item font-base-secondary">
				<view class="cell-line mb10 flex">
					<view class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../../static/img/icon/icon_release.png" mode=""></image>
							</view>
							<view class="label">发布时间</view>							
						</view>
						<view class="value">{{ formInfo.createTime | formatDate("yyyy-MM-dd hh:mm") }}</view>
					</view>
					<view v-if="formInfo.isTimeLimit === 1" class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../../static/img/icon/icon_limit.png" mode=""></image>
							</view>
							<view class="label">截止时间</view>
						</view>
						<view class="value">{{ formInfo.endTime | formatDate("yyyy-MM-dd hh:mm") }}</view>
					</view>
				</view>
				<view class="cell-line mb10 flex">
					<view class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../../static/img/icon/icon_publisher.png" mode=""></image>
							</view>
							<view class="label">发布者</view>
						</view>
						<view class="value">{{ formInfo.nickname }}</view>
					</view>
					<view v-if="formInfo.telephone" class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../../static/img/icon/icon_phone.png" mode=""></image>
							</view>
							<view class="label">联系电话</view>
						</view>
						<view class="value">{{ formInfo.telephone }}</view>
					</view>
				</view>
				<view v-if="formInfo.remark" class="cell-line flex">
					<view class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../../static/img/icon/icon_desc.png" mode=""></image>
							</view>
							<view class="label">备注要求</view>
						</view>
						<view class="value">{{ formInfo.remark }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="attend-main">
			<view class="cell-flex flex">
				<view class="title font-base flex-1">填报人员(共<text class="font-1">{{ total }}</text>名)</view>
			</view>
			<view class="attend-warp">
				<view class="attend-item" v-for="item in attendList" :key="item.id" @tap.stop="toFormInfoDetail(item)">
					<view class="cell-flex flex">
						<view class="user-info flex flex-1">
							<view class="avatar">
								<image :src="item.picUrl" mode=""></image>
							</view>
							<view class="nickname">{{ item.nickname }}</view>
						</view>
						<view class="date-time flex">
							<!-- <view class="icon">
								<image src="../../../static/img/icon/icon_calendar.png" mode=""></image>
							</view> -->
							<view class="ml5">{{  item.createTime | formatDate('yyyy-MM-dd hh:mm') }}</view>
						</view>
					</view>
					<block v-for="data in JSON.parse(item.formData)" :key="data.name">
						<block v-for="fItem in formInfo.customData" :key="fItem.id">
							<template v-if="fItem.name == data.name && fItem.isShow == '1'">
								<view class="cell-line flex">
										<view class="label flex-1">{{ data.title }}</view>
										<view v-if="fItem.type != 2" class="value">{{ data.data }}</view>
										<view class="image" v-else-if="data.data.length">
											<image :src="data.data[0]" mode=""></image>
										</view>
								</view>
							</template>
						</block>
					</block>							
				</view>
				<page-empty :total="total"></page-empty>
			</view>
		</view>
		<!-- <button class="share-btn" @tap.stop="openPopup">
			<image src="../../../static/img/icon/icon_share.png" mode=""></image>
		</button> -->
		<button @tap.stop="openPopup" hover-class="none" class="share-btn">
			<text class="program-font icon-fenxiang"></text>
			<text class="share-text">分享</text>
		</button>
		<view class="footer font-base flex">
			<button open-type="contact" class="service-btn flex">
				<view class="icon">
					<image src="../../../static/img/icon/icon_service.png" mode=""></image>
				</view>
				<text>客服</text>
			</button>
			<view class="btn-group flex flex-1">
				<view v-if="hasLogin && isCreator === 1" class="btn export" @tap.stop="excelExport">Excel预览</view>
				<view v-if="isCreator === 1" class="btn" @tap.stop="toSettingForm">表单设置</view>
				<view v-if="isAttend === 1" @tap.stop="toEditForm" class="btn">修改信息</view>
				<view v-else class="btn" @tap.stop="toEditForm">立即填报</view>
			</view>			
		</view>
		<u-popup v-model="showQrCodeMask" mode="center" :mask-close-able="false" width="76%" height="560rpx" :border-radius="9" :closeable="true">
			<view class="qrcode-popup flex">
				<view class="qrcode">
					<image :src="qrCodeUrl" mode=""></image>
				</view>
				<view class="save-btn" @tap.stop="saveImgToLocal">保存至本地</view>
			</view>
		</u-popup>
		<leePopou type="bottom" ref="popup" :round="true" :animation="animation" padding="0">
			<view class="p-list-item">
				<button open-type="share" class="cell-line p-item">
					发送给朋友
				</button>
				<view class="cell-line p-item" @click="openQrCodeMask()">
					生成二维码
				</view>
				<view style="height: 10rpx;background-color: #F7F7F7;"></view>
				<view class="cell-line p-item" @tap.stop="pupouClose('popup')">
					取消
				</view>
			</view>
		</leePopou>
	</view>
</template>

<script>
import { formDetail,getQrCodeUrl } from '@/api/basic.js';
import wechatAuth from "@/utils/wechatAuth";
import leePopou from '@/components/lee-popup/lee-popup';

export default{
	mixins: [wechatAuth],
	components: {
		leePopou
	},
	data(){
		return{
			id: '',
			formInfo: {},
			attendList: [],
			total: 0,
			attendId: '',
			animation: false,
			isCreator: 0,
			isAttend: 0,
			qrCodeUrl: '',
			showQrCodeMask: false
		}
	},
	onLoad(options) {
		uni.showLoading({ title: "加载中" })
		this.id = options.id;
		this.sceneType = 1;
		this.bizId = this.id;
	},
	onShow() {
		this.appInitial();
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
			this.getFormDetail();
		},
		/**
		 * 获取表单详情
		 */
		getFormDetail(){
			let userId = uni.getStorageSync("userInfo").id;
			this.$http.post(`${formDetail}`,{ userId,id: this.id }).then(res => {
				let records = res.records;
				let formInfo = records.formInfo;
				formInfo.label = formInfo.label.split(",").filter(label=>label);
				formInfo.customData = JSON.parse(formInfo.customData);
				this.formInfo = formInfo;
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
				this.isCreator = records.isCreator;
				this.isAttend = records.isAttend;
				this.attendId = records.attendId;
				this.attendList = records.attendList;
				this.total = this.attendList.length;
				uni.hideLoading();
			});
		},
		/**
		 * 查看参与人员的表单详情
		 */
		toFormInfoDetail(item){
			let userId = uni.getStorageSync("userInfo").id;
			if(this.isCreator || userId == item.userId){	
				this.navigateTo('/pages/profile/form/edit','page',`formId=${ this.id }&id=${ item.id }&source=formDetail`,this.callback);
			}
		},
		/**
		 * 跳转到表单填报的页面
		 */
		toEditForm(){
			let params = `formId=${ this.id }`;
			if(this.attendId){
				params += `&id=${ this.attendId }`
			}
			this.navigateTo('/pages/profile/form/edit','page',params,this.callback);
		},
		excelExport(){
			this.navigateTo('/pages/profile/form/excelPreview','page',`id=${ this.id }`,this.callback);
		},
		saveImgToLocal(){
			this.$utils.saveImgToLocal(this.qrCodeUrl);
		},
		//表单设置
		toSettingForm(){
			this.navigatePageTo('/pages/form/edit','page',`id=${ this.id }`)
		},
		openQrCodeMask(){
			uni.showLoading({ title: "加载中" })
			this.$http.post(`${getQrCodeUrl}`,{ id: this.id }).then(res => {
				this.qrCodeUrl = res.records;
				this.showQrCodeMask = true;
				uni.hideLoading();
			}).catch(()=>{});
		},
		openPopup(){
			this.animation = true;
			this.$refs.popup.open();
		},
		// 关闭
		pupouClose (ref) {
			this.$refs[ref].close();
		}
	}
}
</script>
<style>
	page{
		background: #F6F7FB;
	}
</style>
<style lang="scss" scoped>
	.app-container{
		padding: 20upx;
		image{
			width: 100%;
			height: 100%;
		}
		.user-info{
			align-items: center;
			.avatar{
				width: 40upx;
				height: 40upx;
				image{
					border-radius: 99%;
				}
			}
			.nickname{
				color: #666666;
				margin-left: 10upx;
			}
		}
		.icon{
			width: 32upx;
			height: 32upx;
		}
		.tag-list{
			margin: 20upx 0;
			.tag-item{
				background: rgba(60, 195, 147, 0.2);
				box-sizing: content-box;
				color: $base-color;
				height: 38upx;
				line-height: 38upx;
				padding: 0 10upx;
				opacity: 0.7;
				border: 2upx solid $base-color;
				border-radius: 6upx;
				margin-right: 26upx;
			}
		}
		.form-title{
			font-size: 44upx;
			font-weight: bold;
			color: #333333;
		}
		.main-item{
			border: 2upx solid rgba(238, 238, 238, 0.4);
			border-radius: 20upx;
			padding: 26upx;
			background: #FFFFFF;
			.mb10{
				margin-bottom: 20upx;
			}
			.cell-line{
				.form-item{
					.cell-flex{
						align-items: center;
						margin-bottom: 6upx;
						.label{
							margin-left: 20upx;
						}
					}
					.value{
						color: #999999;
						margin-left: 50upx;
					}
				}
			}
		}
		.attend-main{
			margin-top: 30upx;
			margin-bottom: 130upx;
			.cell-flex{
				align-items: center;
				.title{
					font-size: 30upx;
					font-weight: bold;
					.font-1{
						font-size: 38upx;
						color: $base-color;
					}
				}
			}
			.attend-warp{
				margin-top: 20upx;
				.attend-item{
					border-radius: 14upx;
					background: #FFFFFF;
					padding: 20upx;
					margin-bottom: 20upx;
					font-size: $font-secondary;
					.cell-flex{
						padding-bottom: 10upx;
						.ml5{
							margin-left: 10upx;
						}
						.date-time{
							color: #666666;
							align-items: center;
						}
					}
					.cell-line:nth-child(2){
						border-top: 2upx solid rgba(153, 153, 153, 0.2);
					}
					.cell-line{
						padding: 10upx 20upx;
						margin-top: 10upx;
						.value{
							color: #666666;
						}
						.image{
							width: 80upx;
							height: 90upx;
						}
					}
				}
			}
		}
		.share-btn{
			position: fixed;
			bottom: calc(80px + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
			right: 20upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			text-align: center;
			background-color: $base-color;
			color: #FFFFFF;
			border-radius: 99%;
			width: 88upx;
			height: 88upx;
			margin: 0;
			padding: 0;				
			line-height: inherit;
			.share-text{
				display: block;
				font-size: $font-sm;
			}
		}
		button{
			border: none;
			background: none;
			font-size: inherit;
			&::after{
				border: none;
			}
		}
		.qrcode-popup{
			flex-direction: column;
			align-items: center;
			height: inherit;
			position: relative;
			.qrcode{
				width: 360upx;
				height: 360upx;
				margin: 50upx 0 40upx;
			}		
			.save-btn{
				background: $base-color;
				border-radius: 49upx;
				color: #FFFFFF;
				height: 60upx;
				line-height: 60upx;
				width: 50%;
				text-align: center;
			}
		}
		.footer{
			padding: 26upx 20upx;
			position: fixed;
			background: #FFFFFF;
			left: 0;
			right: 0;
			bottom: 0;
			align-items: center;
			.service-btn{
				margin-right: 20upx;
				font-size: 20upx;
				color: #999999;
				font-weight: bold;
				flex-direction: column;
				align-items: center;
			}
			.btn-group{
				font-weight: bold;
				.btn{
					flex: 1;
					border-radius: 49upx;
					height: 80upx;
					background: $base-color;
					line-height: 80upx;
					text-align: center;
					color: #FFFFFF;
					&:not(:last-child){
						margin-right: 20upx;
					}
				}
				.export{
					// background: #FE893B;
				}
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
	}
</style>
