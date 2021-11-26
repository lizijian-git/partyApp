<template>
	<view class="app-container">
		<view class="content">
			<view class="form-item flex">
				<view class="label">描述:</view>
				<view class="input-box flex-1">
					<input type="text" :disabled="!editing" v-model="remark" placeholder="请输入相册描述" />
				</view>
			</view>
			<view class="form-item flex">
				<view class="label">累计数量:</view>
				<view class="cell-line">
					共<text class="primary">{{ urlList.length }}</text>张
					<text class="desc">(可拖拽图片调整顺序)</text>
				</view>
			</view>
			<view class="form-item flex">
				<view class="label"></view>
				<view class="pic-content">
					<dragImage :editing="editing" :rowNum="3" :imgRadius="10" :imgSize="160" :imgList.sync="urlList"  
					@moveEndList="moveEndList" @addImg="picUpload" @delImg="removeActivityAlbum">
						<view v-if="editing" class="upload-item" @tap.stop="picUpload()"></view>
					</dragImage>
				<!-- <view v-else class="cell-line flex">
					<view class="item-img" v-for="(url,index) in urlList" :key="index">
						<image :src="url" class="pic-url" @tap.stop="picUpload(index)"></image>
					</view> -->
				</view>
			</view>
		</view>
		<view v-if="isCreator" class="footer flex">
			<view class="submit-btn" @tap.stop="submitForm">{{ editing ?  '提 交' : '修 改'}}</view>
		</view>
	</view>
</template>

<script>
import dragImage from '@/components/xiaokeai-dragImage/xiaokeai-dragImage.vue'
import { listActivityAlbum,addActivityAlbum,getActivityAlbumDetail,updateActivityAlbum } from '@/api/basic.js';
	export default{
		components: {
			dragImage
		},
		data(){
			return{
				id: '',
				activityId: '',
				remark: '',
				urlList: [],
				isCreator: 1,
				// 是否编辑状态
				editing: false
			}
		},
		onLoad(options){
			if(options.id){
				this.id = options.id;
				this.getActivityAlbumDetail();
			}else if(options.activityId){
				this.editing = true;
				this.activityId = options.activityId;
			}
		},
		onShow(){},
		methods: {
			submitForm(){
				if(!this.editing){
					this.editing = true;
					return;
				}
				
				if(!this.remark)return this.$mHelper.toast("相册描述不能为空");
				if(!this.urlList.length)return this.$mHelper.toast("请至少上传一张图片");
				
				if(this.id){
					this.updateActivityAlbum();
				}else if(this.activityId){
					this.addActivityAlbum();
				}
			},
			getActivityAlbumDetail(){
				this.$http.post(`${getActivityAlbumDetail}`,{id: this.id}).then(res => {
					let records = res.records;
					this.isCreator = records.isCreator;
					this.urlList = records.urlList;
					this.remark = records.remark;
				});
			},
			removeActivityAlbum(index){
				this.urlList.splice(index,1);
			},
			updateActivityAlbum(){
				uni.showLoading({ title: "加载中" });
				let data = { id: this.id,remark: this.remark,urlList: this.urlList };
				this.$http.post(`${updateActivityAlbum}`,data).then(res => {
					uni.hideLoading();
					this.pageBack();
				});
			},
			addActivityAlbum(){
				uni.showLoading({ title: "加载中" });
				let data = { activityId: this.activityId,remark: this.remark,urlList: this.urlList };
				this.$http.post(`${addActivityAlbum}`,data).then(res => {
					uni.hideLoading();
					this.pageBack();
				});
			},
			/**
			 * 预览图片
			 */
			previewPic(index){
				uni.previewImage({
					urls : this.urlList,
					current: index
				})
			},
			// 图片上传
			picUpload(index=-1){
				
				if(!this.editing){
					this.previewPic(index);
					return;
				}
				let photoUpNum = this.$store.getters.globalConfig.photoUpNum;
				let count = index !== -1 ? 1 : photoUpNum - this.urlList.length;
				if(count <= 0){
					return this.$mHelper.toast(`最多上传${ photoUpNum }张图片`);
				}
				uni.showLoading({title: '加载中'});
				this.$utils.uploadFile(count).then(imgList=>{
					if(count === 1){
						this.urlList[index] = imgList;
					}else{
						imgList.forEach(v=>{
							this.urlList.push(v);
						})
					}
					this.$forceUpdate();
					uni.hideLoading();
				}).catch(()=>{
					uni.hideLoading();
				});
			},
			moveEndList(e){
				this.urlList = e;
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
		padding-top: 40upx;
		.content{
			padding-right: 20rpx;
			.form-item{
				align-items: center;
				margin-bottom: 30upx;
				.label{
					min-width: 20%;
					text-align: right;
					margin-right: 40upx;
					font-weight: bold;
				}
				.input-box{
					input{
						border: 1px solid rgba(153, 153, 153, 0.4);
						height: 60upx;
						line-height: 60upx;
						padding: 0 20upx;
						border-radius: 9upx;
					}
				}
				.pic-url,.upload-item{
					width: 160upx;
					height: 160upx;
					margin-right: 20upx;
					margin-bottom: 20upx;
				}
				.upload-item{
					background-image: url(../../static/img/icon/form_upload01.png);
					background-size: 100% 100%;
					position: relative;
					&::after{
						content: "上传图片";
						position: absolute;
						color: #a8a8a8;
						font-size: 20upx;
						left: 0;
						right: 0;
						bottom: 24upx;
						text-align: center;
					}
				}
				.cell-line{
					font-weight: bold;
					flex-wrap: wrap;
					.primary{
						color: $base-color;
						font-size: 36upx;
					}
					.desc{
						margin-left: 20upx;
						font-weight: normal;
						color: #999999;
					}
				}
			}
		}
		.footer{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			height: 120upx;
			box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
			justify-content: center;
			align-items: center;
			.submit-btn{
				background: $base-color;
				color: #FFFFFF;
				height: 80upx;
				line-height: 80upx;
				width: 60%;
				font-weight: bold;
				text-align: center;
				border-radius: 49upx;
			}
		}
	}
</style>
