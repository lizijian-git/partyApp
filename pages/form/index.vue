<template>
	<view class="app-container">
		<view class="form-warpper">
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
							<view class="reduce-btn" @tap.stop="removeLabelItem(lIndex)"></view>
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
				<input type="number" v-model="formInfo.limitNum" placeholder="请输入活动人数" />
			</view>
			<view class="form-item flex">
				<view class="label">截止时间：</view>
				<switch :checked="formInfo.isTimeLimit" :color="themeColor" @change="handleIsTimeLimit"></switch>
			</view>
			<view v-if="formInfo.isTimeLimit === 1" class="form-item flex">
				<view class="label">时间设置：</view>
				<input type="number" v-model="formInfo.endTime" placeholder="请选择时间" />
			</view>
		</view>
		<view class="btn-group flex font-base">
			<!-- <view class="btn">删除</view> -->
			<!-- <view class="btn" @tap.stop="toPreviewForm">预览</view> -->
			<view class="btn" @tap.stop="toBuildForm">下一步</view>
		</view>
		<custom-tarbar v-if="!formInfo.id" :selected="1"></custom-tarbar>
	</view>
</template>

<script>
import { addForm,formDetail } from '@/api/basic.js';
export default{
	data(){
		return{
			label: [''],
			formInfo: {
				name: '',
				remark: '',
				telephone: '',
				isNumLimit: 0,
				limitNum: '',
				isTimeLimit: 0,
				endTime: ''
			}
		}
	},
	onLoad(){},
	methods:{
		//跳转到表单构建
		toBuildForm(){
			if(!this.formInfo.name){
				return this.$mHelper.toast("请输入表单名称");
			}
			this.addForm();
			// this.navigatePageTo('/pages/form/build','page');
		},
		// 跳转到表单预览
		toPreviewForm(){
			this.navigatePageTo('/pages/form/preview','page');
		},
		addLabelItem(){
			this.label.push('');
		},
		removeLabelItem(index){
			this.label.splice(index,1);
		},
		handleIsNumLimit(e){
			this.formInfo.isNumLimit = Number(e.detail.value);
		},
		handleIsTimeLimit(e){
			this.formInfo.isTimeLimit = Number(e.detail.value);
		},
		addForm(){
			uni.showLoading({title: "加载中"});
			this.formInfo.label = this.label.join(",");
			let data = this.formInfo;
			this.$http.post(`${addForm}`,data).then(res => {
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
			padding-bottom: calc(110px + constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
			padding-bottom: calc(110px + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
			.form-item{
				margin-bottom: 20upx;
				align-items: center;
				input,textarea{
					background: rgba(255, 255, 255, 0.5);
					border: 1px solid rgba(153, 153, 153, 0.2);
					opacity: 0.7;
					border-radius: 6upx;
					padding: 10upx 20upx;
				}
				textarea{
					width: 60%;
					height: 200upx;
				}
				switch{
					transform:scale(0.8);
				}
				.label{
					font-size: $font-lg;
					min-width: 180upx;
					text-align: right;
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
					background-image: url(../../static/img/icon/icon_sub.png);
					background-size: 100% 100%;
					width: 48upx;
					height: 48upx;
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
			padding-bottom: calc(70px + constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
			padding-bottom: calc(70px + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
			.btn{
				flex: 1;
				background: $base-color;
				color: #FFFFFF;
				border-radius: 49upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				&:not(:last-child){
					margin-right: 20upx;
				}
			}
		}
	}
</style>
