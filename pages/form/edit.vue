<template>
	<view class="app-container">
		<view class="form-warpper font-base">
			<view class="form-item flex">
				<view class="label require">表单名称：</view>
				<input type="text" v-model="formInfo.name" placeholder="请输入表单名称" />
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
			<view class="form-item flex al-start">
				<view class="label">要求备注：</view>
				<textarea v-model="formInfo.remark" placeholder="请输入备注内容" />
			</view>
			<view class="form-item flex">
				<view class="label">联系电话：</view>
				<input type="number" v-model="formInfo.telephone" placeholder="请输入您的联系电话" />
			</view>
			<view class="form-item flex">
				<view class="label">人数限制：</view>
				<switch :checked="formInfo.isNumLimit" :color="themeColor" @change="handleIsNumLimit"></switch>
			</view>
			<view v-if="formInfo.isNumLimit === 1" class="form-item flex">
				<view class="label">人数设置：</view>
				<u-number-box v-model="formInfo.limitNum"></u-number-box>
			</view>
			<view class="form-item flex">
				<view class="label">截止时间：</view>
				<switch :checked="formInfo.isTimeLimit" :color="themeColor" @change="handleIsTimeLimit"></switch>
			</view>
			<view v-if="formInfo.isTimeLimit === 1" class="form-item flex">
				<view class="label">时间设置：</view>
				<input type="number" disabled :value="formInfo.endTime | formatDate('yyyy-MM-dd hh:mm')" placeholder="请选择时间" @click="showDatePicker()"></input>
			</view>
			<view class="form-item flex">
				<view class="label">填写人入口：</view>
				<u-radio-group v-model="formInfo.enterType" :active-color="themeColor">
					<u-radio :name="1">详情页</u-radio>
					<u-radio :name="2">填写页</u-radio>
				</u-radio-group>
			</view>
		</view>
		<view class="btn-group flex font-base">
			<!-- <view class="btn">删除</view> -->
			<!-- <view class="btn" @tap.stop="toPreviewForm">预览</view> -->
			<view class="btn" @tap.stop="toBuildForm">下一步</view>
		</view>
		<u-picker mode="time" v-model="datePickerVisiable" :params="params" :confirm-color="themeColor" @confirm="pickerConfirm"></u-picker>
	</view>
</template>

<script>
import { addForm,updateForm,formDetail } from '@/api/basic.js';
export default{
	data(){
		return{
			label: [],
			formInfo: {
				name: '',
				remark: '',
				telephone: '',
				isNumLimit: 0,
				limitNum: 0,
				isTimeLimit: 0,
				endTime: '',
				enterType: 1
			},
			datePickerVisiable: false,
			params: {
				year: true,
				month: true,
				day: true,
				hour: true,
				minute: true
			},
		}
	},
	onLoad(options){
		if(options.id){
			uni.showLoading({ title: "加载中" });
			this.formInfo.id = options.id;
			this.getFormDetail();
		}
	},
	methods:{
		getFormDetail(){
			let userId = uni.getStorageSync("userInfo").id;
			this.$http.post(`${formDetail}`,{ userId,id: this.id,id: this.formInfo.id }).then(res => {
				let records = res.records;
				let formInfo = records.formInfo;
				this.formInfo = formInfo;
				this.label = this.formInfo.label.split(",").filter(v=>v);
				uni.hideLoading();
			});
		},
		//跳转到表单构建
		toBuildForm(){
			if(!this.formInfo.name){
				return this.$mHelper.toast("请输入表单名称");
			}else if(this.formInfo.isNumLimit && this.formInfo.limitNum <= 0){
				return this.$mHelper.toast("人数必须要大于0");
			}else if(this.formInfo.isTimeLimit && !this.formInfo.endTime){
				return this.$mHelper.toast("请设置截止时间");
			}
			uni.showLoading({title: "加载中"});
			this.formInfo.label = this.label.join(",");
			let data = this.formInfo;
			if(this.formInfo.id){
				this.editForm(data);
			}else{
				this.addForm(data);
			}
		},
		// 跳转到表单预览
		toPreviewForm(){
			this.navigatePageTo('/pages/form/preview','page');
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
			this.formInfo.isNumLimit = Number(e.detail.value);
		},
		handleIsTimeLimit(e){
			this.formInfo.isTimeLimit = Number(e.detail.value);
		},
		showDatePicker(){
			this.datePickerVisiable = true;
		},
		pickerConfirm(e){
			let { year,month,day,hour,minute } = e;
			this.formInfo.endTime = new Date(year,month - 1,day,hour,minute);
		},
		addForm(data){
			this.$http.post(`${addForm}`,data).then(res => {
				uni.hideLoading();
				this.navigatePageTo('/pages/form/build','page',`id=${ res.records.id }`);
			});
		},
		editForm(data){
			this.$http.post(`${updateForm}`,data).then(res => {
				uni.hideLoading();
				this.navigatePageTo('/pages/form/build','page',`id=${ res.records.id }`);
			});
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
		padding: 16upx;
		.form-warpper{
			padding-bottom: calc(70px + constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
			padding-bottom: calc(70px + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
			.form-item{
				margin-bottom: 30upx;
				align-items: center;
				input,textarea{
					background: rgba(255, 255, 255, 0.5);
					border: 2upx solid #dcdfe6;
					border-radius: 6upx;
					padding: 10upx 20upx;
					width: 65%;
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
