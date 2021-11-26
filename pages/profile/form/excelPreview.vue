<template>
	<view class="app-container">
		<view class="table-main">
			<comTable :tableLabel="customData" :tableData="tableData" @previewImage="previewImage"></comTable>
		</view>
		<view class="fixed-warp">
			<view class="main">
				<view class="title">下载地址</view>
				<view class="url flex">
					<u-input v-model="excelUrl" placeholder="" :disabled="true" :clearable="false" :border="true" />
					<view class="copy-btn" @tap.stop="onCopy">复制</view>
				</view>
				<view class="tips">
					复制链接后，请到电脑浏览器地址栏，粘贴打开即可下载数据Excel
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { formDetail,getExcelUrl } from '@/api/basic.js';
import  comTable from "@/components/com-table"
export default{
	components: {
		comTable
	},
	data(){
		return{
			id: '',
			tableData: [],
			customData: [],
			excelUrl: ''
		}
	},
	onLoad(options) {
		this.id = options.id;
	},
	onShow() {
		uni.showLoading({ title: "加载中" });
		this.getFormDetail();
		this.getExcelUrl();
	},
	methods:{
		/**
		 * 获取表单详情
		 */
		getFormDetail(){
			let userId = uni.getStorageSync("userInfo").id;
			this.$http.post(`${formDetail}`,{ userId,id: this.id }).then(res => {
				let records = res.records;
				let formInfo = records.formInfo;
				uni.setNavigationBarTitle({ title: formInfo.name });
				this.customData = JSON.parse(formInfo.customData);
				this.customData.unshift({ title: '序号' });
				let tableData = records.attendList.map(v=>v.formData = JSON.parse(v.formData));
				let dataList = [];
				tableData.forEach(v=>{
					let data = {};
					v.forEach(v1=>{
						data[v1.name] = v1.data;
					});
					dataList.push(data);
				});
				this.tableData = dataList;
				uni.hideLoading();
			})
		},
		/**
		 * 获取表单Excel下载链接
		 */
		getExcelUrl(){
			this.$http.post(`${getExcelUrl}`,{ id: this.id }).then(res => {
				this.excelUrl = res.records.excelUrl;
			});
		},
		//图片预览
		previewImage(picList,index){
			uni.previewImage({
				urls : picList,
				current: index
			})
		},
		onCopy(){
			uni.setClipboardData({
				data: this.excelUrl,
				success: () => {
					uni.showToast({
						title: '复制成功',
						icon: 'success'
					});
				}
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
		image{
			width: inherit;
			height: inherit;
		}
		.fixed-warp{
			position: fixed;
			bottom: calc(10px + constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
			bottom: calc(10px + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
			left: 60upx;
			right: 60upx;
			.main{
				padding: 20upx;
				box-shadow: 0 0 20upx 5upx #e8e8e8;
				border-radius: 9upx;
				.title{
					font-weight: bold;
					margin-bottom: 10upx;
				}
				.url{
					align-items: center;
					justify-content: center;
					color: $base-color;
					/deep/ input{
						width: 400upx;
					}
					.copy-btn{
						border: 2upx solid #EEEEEE;
						height: 70upx;
						line-height: 70upx;
						font-size: $font-base;
						padding: 0 20upx;
						border-radius: 9upx;
						flex: 1;
						text-align: center;
						margin-left: 20rpx;
					}
				}
				.tips{
					margin-top: 10upx;
					font-size: $font-sm;
					color: #c0c4cc;
				}
			}
		}
	}
</style>
