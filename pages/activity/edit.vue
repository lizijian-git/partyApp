<template>
	<view class="app-container">
		<view class="form-warpper font-base">
			<view class="form-item flex">
				<view class="label require">活动名称：</view>
				<input type="text" v-model="activityInfo.name" placeholder="请输入活动名称" />
			</view>
			<view class="form-item flex">
				<view class="label">开始时间：</view>
				<input type="number" disabled :value="activityInfo.startTime | formatDate('yyyy-MM-dd hh:mm')" placeholder="请选择开始时间" @click="showDatePicker('startTime')"></input>
			</view>
			<view class="form-item flex">
				<view class="label">结束时间：</view>
				<input type="number" disabled :value="activityInfo.endTime | formatDate('yyyy-MM-dd hh:mm')" placeholder="请选择结束时间" @click="showDatePicker('endTime')"></input>
			</view>
			<view class="form-item flex">
				<view class="label">活动地点：</view>
				<view class="input-area flex" @tap.stop="chooseLocation">
					<text v-if="!activityInfo.province" class="flex-1 palceholder">请选择定位</text>
					<text v-else class="flex-1">{{ activityInfo.province }}{{ activityInfo.city }}{{ activityInfo.region }}</text>
				</view>
				<view class="add-btn flex icon" @tap.stop="chooseLocation">
					<image src="../../static/img/icon/icon_position.png" mode=""></image>
				</view>
			</view>
			<view class="form-item flex">
				<view class="label"></view>
				<input type="text" v-model="activityInfo.address" placeholder="请输入活动地点" />
			</view>
			<view class="form-item flex al-start">
				<view class="label">要求备注：</view>
				<textarea v-model="activityInfo.remark" placeholder="请输入备注内容" />
			</view>
			<view class="form-item">
				<view class="cell-line flex">
					<view class="label">标签：</view>
					<view class="add-btn" @tap.stop="addLabelItem">+添加</view>
				</view>
				<view class="cell-box flex">
					<view class="label"></view>
					<view class="input-box">
						<view v-for="(l,lIndex) in label" :key="lIndex" class="input-item flex">
							<input type="text" v-model="label[lIndex]" :placeholder="'标签'+(lIndex + 1)" />
							<view class="reduce-btn" @tap.stop="removeLabelItem(lIndex)">
								<image src="../../static/img/icon/icon_sub.png" mode=""></image>
							</view>
						</view>
					</view>						
				</view>
			</view>
			<view class="form-item flex">
				<view class="label">联系电话：</view>
				<input type="number" v-model="activityInfo.telephone" placeholder="请输入您的联系电话" />
			</view>
			<view class="form-item flex">
				<view class="label">人数限制：</view>
				<switch :checked="activityInfo.isNumLimit" :color="themeColor" @change="handleIsNumLimit"></switch>
			</view>
			<view v-if="activityInfo.isNumLimit === 1" class="form-item flex">
				<view class="label">人数设置：</view>
				<u-number-box v-model="activityInfo.limitNum"></u-number-box>
			</view>
			<view class="form-item flex">
				<view class="label">截止时间：</view>
				<switch :checked="activityInfo.isTimeLimit" :color="themeColor" @change="handleIsTimeLimit"></switch>
			</view>
			<view v-if="activityInfo.isTimeLimit === 1" class="form-item flex">
				<view class="label">时间设置：</view>
				<input type="number" disabled :value="activityInfo.limitTime | formatDate('yyyy-MM-dd hh:mm')" placeholder="请选择截止时间" @click="showDatePicker('limitTime')"></input>
			</view>
		</view>
		<view class="btn-group flex font-base">
			<!-- <view class="btn">删除</view> -->
			<view class="btn" @tap.stop="submitForm">{{ id ? '保 存' : '创 建' }}</view>
		</view>
		<u-picker mode="time" v-model="datePickerVisiable" :default-time="activityInfo[editKey] | formatDate('yyyy-MM-dd hh:mm')" :params="params" :confirm-color="themeColor" @confirm="pickerConfirm"></u-picker>
	</view>
</template>

<script>
import { addActivityInfo,activityInfoDetail,updateActivityInfo } from '@/api/basic.js';
export default{
	data(){
		return{
			id: '',
			editKey: '',
			label: [],
			activityInfo: {
				name: '',
				remark: '',
				telephone: '',
				isNumLimit: 0,
				limitNum: 0,
				isTimeLimit: 0,
				startTime: '',
				endTime: '',
				limitTime: '',
				address: '',
				longitude: '', //经度
				latitude: '', //纬度
				province: '', //省
				city: '', //市
				region: '' //区
			},
			datePickerVisiable: false,
			params: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true
			}
		}
	},
	onLoad(options){
		if(options.id){
			this.id = options.id;
			this.getActivityInfoDetail();
		}
	},
	methods:{
		/**
		 * 获取活动详情
		 */
		getActivityInfoDetail(){
			let userId = uni.getStorageSync("userInfo").id;
			this.$http.post(`${activityInfoDetail}`,{ userId,id: this.id }).then(res => {
				let activityInfo = res.records;
				activityInfo.label = activityInfo.label.split(",").filter(label=>label);
				this.activityInfo = activityInfo;
				uni.hideLoading();
			});
		},
		async chooseLocation(){
			let locationData = await this.$utils.chooseLocation();
			this.activityInfo = Object.assign({},this.activityInfo,locationData);
		},
		addLabelItem(){
			this.label = [...this.label,''];
		},
		removeLabelItem(index){
			let tempLabel = this.label;
			tempLabel.splice(index,1);
			this.label = tempLabel;
		},
		handleIsNumLimit(e){
			this.activityInfo.isNumLimit = Number(e.detail.value);
		},
		handleIsTimeLimit(e){
			this.activityInfo.isTimeLimit = Number(e.detail.value);
		},
		showDatePicker(key){
			this.editKey = key;
			this.datePickerVisiable = true;
		},
		pickerConfirm(e){
			let { year,month,day,hour,minute } = e;
			this.activityInfo[this.editKey] = new Date(year,month - 1,day,hour,minute).getTime();
			this.editKey = '';
		},
		addActivityInfo(data){
			this.$http.post(`${addActivityInfo}`,data).then(res => {
				uni.hideLoading();
				this.$store.commit('setTabActive',1);
				this.navigatePageTo('/pages/index/index','tab');
			});
		},
		updateActivityInfo(data){
			this.$http.post(`${updateActivityInfo}`,data).then(res => {
				uni.hideLoading();
				this.$store.commit('setTabActive',1);
				this.navigatePageTo('/pages/index/index','tab');
			});
		},
		submitForm(){
			if(!this.activityInfo.name){
				return this.$mHelper.toast("请输入活动名称");
			}
			uni.showLoading({title: "加载中"});
			this.activityInfo.label = this.label.join(",");
			let data = this.activityInfo;
			if(data.id){
				this.updateActivityInfo(data);
			}else{
				this.addActivityInfo(data);
			}
		}
	}
}
</script>
<style>
	page{
		background: #FFFFFF;
	}
</style>
<style lang="scss" scoped>
	.app-container{
		padding: 16rpx 24rpx;
		.form-warpper{
			padding-bottom: calc(70px + constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
			padding-bottom: calc(70px + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
			.form-item{
				margin-bottom: 30upx;
				align-items: center;
				input,textarea,.input-area{
					background: rgba(255, 255, 255, 0.5);
					border: 2upx solid #dcdfe6;
					border-radius: 6upx;
					padding: 10upx 20upx;
					width: 100%;
					&.input-area{
						margin-right: 10upx;
					}
					.palceholder{
						color: #848484;
					}
				}
				textarea{
					height: 200upx;
				}
				switch{
					transform:scale(0.8);
				}
				.label{
					font-size: $font-lg;
					min-width: 180upx;
					text-align: right;
					font-weight: bold;
					&.require{
						position: relative;
						&::before{
							content: '';
							position: absolute;
							top: 50%;
							transform: translateY(-50%);
							left: 16upx;
							width: 10upx;
							height: 10upx;
							background-image: url(../../static/img/icon/icon_require.png);
							background-size: 100% 100%;							
						}
					}
				}
				.cell-line{
					align-items: center;
					margin-bottom: 20upx;
				}
				.reduce-btn{
					width: 56upx;
					height: 56upx;
					flex-shrink: 0;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.add-btn{
					border: 2upx solid $base-color;
					color: $base-color;
					padding: 0 20upx;
					height: 50upx;
					line-height: 50upx;
					box-sizing: content-box;
					border-radius: 49upx;
					font-size: $font-secondary;
				}
				.icon{
					align-items: center;
					white-space: nowrap;
					border-radius: 10upx;
					image{
						width: 36upx;
						height: 34upx;
						flex-shrink: 0;
					}
				}
				.input-box{
					.input-item{
						align-items: center;
						margin-bottom: 20upx;
						.reduce-btn{
							margin-left: 20upx;
						}
					}
				}
			}
			.al-start{
				align-items: flex-start;
			}
		}
		.btn-group{
			padding: 0 20upx;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #FFFFFF;
			z-index: 99;
			justify-content: center;
			padding-bottom: calc(20px + constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
			padding-bottom: calc(20px + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
			.btn{
				width: 600upx;
				background: $base-color;
				color: #FFFFFF;
				border-radius: 49upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				font-weight: bold;
				&:not(:last-child){
					margin-right: 20upx;
				}
			}
		}
	}
</style>
