<template>
	<view class="app-container">
		<view class="left-content l">
			<view class="title">组件栏</view>
			<view class="components-warp">
				<view :class="['components-item',{'disabled' : formInfo.isServiceFee === 1 && item.type === 2}]" v-for="(item,index) in formComponents" :key="index" @click="addFormItem(item)">
					<view class="icon">
						<image :src="item.iconPath" mode=""></image>
					</view>
					<view class="label">{{ item.title }}</view>
				</view>
			</view>
		</view>
		<view class="right-content r" @tap.stop="hideToast">
			<view class="form-warpper">
				<view class="form-desc">
					(共{{ customData.length }}项)
				</view>
				<view :class="['form-item',{ 'transition': transition }]" v-for="(item,index) in customData" :key="index" @tap.stop="editFormItem(index)" @longpress="showToast(index)"
				:style="{ transform: 'translateY('+item.y+'px)', zIndex: item.zIndex}">
					<view v-if="showToastIndex === index" class="toast-warp font-base">
						<view class="toast"></view>
						<view class="up-btn flex" @tap.stop="moveFormItem(1)">
							<image src="../../static/img/icon/icon_up.png" mode=""></image>
							<text>向上</text>
						</view>
						<view class="down-btn flex" @tap.stop="moveFormItem(-1)">
							<image src="../../static/img/icon/icon_down.png" mode=""></image>
							<text>向下</text>
						</view>
					</view>
					<image v-if="item.isRequire" class="require" src="../../static/img/icon/icon_require.png" mode=""></image>
					<view class="input-item" v-if="item.type === 1">
						<view class="label">{{ item.sort + 1 }}.{{ item.title }}</view>
						<input :placeholder="item.config.placeholder" disabled />						
					</view>
					<view class="upload-warp" v-else-if="item.type === 2">
						<view class="label">{{ item.sort + 1 }}.{{ item.title }}</view>
						<view class="upload-main flex">
							<view v-for="n in item.config.limitNum" :key="n" class="upload-item"></view>
						</view>
					</view>
					<view class="radio-warp" v-else-if="item.type === 3">
						<view class="label">{{ item.sort + 1 }}.{{ item.title }}</view>
						<view class="radio-main">
							<radio-group>
								<view v-for="option in item.config.options" :key="option" class="radio-item">
									<radio :value="option">{{ option }}</radio>
								</view>
							</radio-group>
						</view>
					</view>
					<view class="checkbox-warp" v-else-if="item.type === 4">
						<view class="label">{{ item.sort + 1 }}.{{ item.title }}</view>
						<view class="checkbox-main">
							<checkbox-group>
								<view v-for="option in item.config.options" :key="option" class="checkbox-item">
									<checkbox :value="option">{{ option }}</checkbox>
								</view>
							</checkbox-group>
						</view>
					</view>
					<view class="input-item" v-if="item.type === 5">
						<view class="label">{{ item.sort + 1 }}.{{ item.title }}</view>
						<textarea :placeholder="item.config.placeholder" disabled></textarea>				
					</view>
					<view class="input-item" v-if="item.type === 6">
						<view class="label">{{ item.sort + 1 }}.{{ item.title }}</view>
						<view class="select-main">
							<u-picker v-model="show" mode="time" :params="pickerParams"></u-picker>
							<input placeholder="请选择日期时间" disabled />
						</view>
					</view>
					<view class="select-warp" v-else-if="item.type === 7">
						<view class="label">{{ item.sort + 1 }}.{{ item.title }}</view>
						<view class="select-main">
							<picker :range="item.config.options" disabled>
								<view class="uni-input">请选择</view>
							</picker>
						</view>
					</view>
					<view v-if="batchRemoveFlag" class="remove-btn" @tap.stop="removeFormItem(index)">
						<image src="../../static/img/icon/icon_sub.png" mode=""></image>
					</view>
				</view>				
			</view>
			<view class="footer">
				<view class="btn btn-1" @tap.stop="batchRemove">{{ batchRemoveFlag ? '取消' : '移除' }}</view>
				<view class="btn btn-2" @tap.stop="toPreview">预览</view>
				<view class="btn btn-3" @tap.stop="editForm">保存</view>
			</view>
			<page-empty :total="total" text="请从左边选择组件构建表单"></page-empty>
		</view>
		<formPopup ref="formPopup" v-model="editFormData" @confirm="formConfirm" @close="resetEditFormData" />
		<u-popup v-model="rechargeDialogVisiable" width="80%" height="44%" :border-radius="9" mode="center">
			<view class="popup-content">
				<view class="title">提示</view>
				<view class="content">
					<view>
						亲，解锁图片上传需要<text class="money">{{ formInfo.serviceAmount }}元</text>服务费,您的权益如下：
					</view>
					<view class="li">1） 可快速预览用户上传的图片</view>
					<view class="li">2） 可随Excel批量导出图片</view>
					<view class="li">3） 可联系平台客服协助打包导出原图</view>
				</view>
				<view class="popup-footer">
					<view class="cancel-btn" @tap.stop="rechargeDialogVisiable = false;">再考虑下</view>
					<view class="confirm-btn" @tap.stop="doUnlockForm">立即支付</view>
				</view>				
			</view>
		</u-popup>
	</view>
</template>

<script>
import formPopup from '@/components/form-popup';
import { updateForm,formDetail,doUnlockForm } from '@/api/basic.js';
	export default{
		components:{
			formPopup
		},
		data(){
			return{
				formInfo: {},
				formComponents: [
					{
						type: 1,
						title: '单行文本',
						iconPath: '../../static/img/icon/form_text.png',
						config: {
							placeholder: "请输入"
						},
						isRequire: 0,
						isShow: 0
					},
					{
						type: 3,
						title: '单项选择',
						iconPath: '../../static/img/icon/form_radio.png',
						config:{
							options: ['选项1','选项2']
						},
						isRequire: 0,
						isShow: 0
					},
					{
						type: 4,
						title: '多项选择',
						iconPath: '../../static/img/icon/form_checkbox.png',
						config:{
							options: ['选项1','选项2']
						},
						isRequire: 0,
						isShow: 0
					},
					{
						type: 5,
						title: '多行文本',
						iconPath: '../../static/img/icon/form_textarea.png',
						config:{
							placeholder: "请输入"
						},
						isRequire: 0,
						isShow: 0
					},
					{
						type: 6,
						title: '日期时间',
						iconPath: '../../static/img/icon/form_date.png',
						config:{
							timeType: 3
						},
						isRequire: 0,
						isShow: 0
					},
					{
						type: 7,
						title: '下拉选择',
						iconPath: '../../static/img/icon/form_select.png',
						config:{
							options: ['选项1','选项2']
						},
						isRequire: 0,
						isShow: 0
					},
					{
						type: 2,
						title: '图片上传',
						iconPath: '../../static/img/icon/form_upload.png',
						config: {
							limitNum: 1
						},
						isRequire: 0,
						isShow: 0
					}
				],
				customData: [],
				editFormData: {},
				transition: true,
				pickerParams: {
					year: true,
					month: true,
					day: true
				},
				batchRemoveFlag: false,
				rechargeDialogVisiable: false,
				editIndex: '', // 当前编辑的表单元素下标
				showToastIndex: -1
			}
		},
		onLoad(options){
			uni.showLoading({ title: "加载中" });
			this.formInfo.id = options.id;
			this.init();
		},
		computed: {
			total() {
				return this.customData.length;
			}
		},
		methods:{
			async init(){
				let res = await this.getFormDetail();
				let formInfo = res.records.formInfo;
				this.customData = JSON.parse(formInfo.customData) || [];
				this.customData.map((v,i)=>{
					v.sort = i;
					v.y = 0;
					return v;
				});
				this.formInfo = formInfo;
				uni.hideLoading();					
			},
			getFormDetail(){
				return new Promise((resolve,reject)=>{
					let userId = uni.getStorageSync("userInfo").id;
					this.$http.post(`${formDetail}`,{ userId,id: this.formInfo.id }).then(res => {
						resolve(res);
					}).catch(()=>{
						reject();
					});					
				})
			},
			formConfirm(data){
				this.customData.splice(this.editIndex,1,data);
				this.editIndex = '';
			},
			editFormItem(index){
				if(this.showToastIndex > -1){
					this.showToastIndex = -1;
					return;	
				}
				this.editFormData = this.customData[index];
				this.editIndex = index;
				this.$refs.formPopup.open();
			},
			resetEditFormData(){
				this.editFormData = {};
			},
			/**
			 * 支付解锁表单功能
			 */
			doUnlockForm(){
				uni.showLoading({ title: "加载中" });
				this.$http.post(`${doUnlockForm}`,{ id: this.formInfo.id }).then(res=>{
					//唤起微信支付
					let data = { payData: res.records };
					this.$mPayment.$mpPayment(data).then(()=>{
						this.successPayInter();
					}).catch(()=>{
						uni.hideLoading();
						this.$mHelper.toast("取消支付");
					});
				}).catch();
			},
			/**
			 * 支付成功轮询
			 */
			successPayInter(){
				var queryCount = 0;
				var interval = setInterval(async ()=>{
					//轮询三次清除定时器
					if( ++queryCount >= 3 ){
						clearInterval(interval);
						uni.hideLoading();
					}
					let res = await this.getFormDetail();
					let formInfo = res.records.formInfo;
					if( formInfo.isServiceFee === 0){
						clearInterval(interval);
						uni.hideLoading();
						this.$mHelper.toast("支付成功");
						this.rechargeDialogVisiable = false;
						this.formInfo = formInfo;
					}
				}, 1000);
			},
			addFormItem(item){
				
				if(item.type === 2 && this.formInfo.isServiceFee === 1){
					this.rechargeDialogVisiable = true;
					return;
				}
				
				item = this.deepCopyData(item);
				delete item['iconPath'];
				let name = this.getFieldName(); 
				item.name = name;
				item.sort = this.customData.length;
				this.customData = [...this.customData,item];
				this.$mHelper.toast(`添加${ item.title }`);
			},
			removeFormItem(index){
				let currentItem = this.customData[index];
				let customData = this.customData;
				customData.splice(index,1);
				customData.forEach(v=>{
					if(v.sort > currentItem.sort){
						v.sort -= 1;
					}
				})
				this.transition = false;
				var tempCustomData = [];
				while (tempCustomData.length !== customData.length){
					let item = customData.find(v=>v.sort === tempCustomData.length);
					delete item['y'];
					tempCustomData.push(item);					
				}
				this.customData = tempCustomData;
				this.showToastIndex = -1;
				setTimeout(()=>{
					this.transition = true;
				}, 500);
			},
			getFieldName(){
				let indexList = this.customData.map(v=>v.name.match(/\d+/g)[0]);
				let key = indexList.length ? Math.max(...indexList) : 0;
				return 'field-' + (key + 1);
			},
			showToast(index){
				this.showToastIndex = index;
			},
			hideToast(){
				if(this.showToastIndex > -1){
					this.showToastIndex = -1;
					return;	
				}
			},
			async editForm(){
				if(this.customData <= 0)return this.$mHelper.toast("请选择表单组件");
				let res = await this.saveFormInfo();
				this.$mHelper.toast("保存成功",3000,false,'success')
				setTimeout(()=>{
					this.redirectTo(`/pages/profile/form/detail?id=${ res.records.id }`);
				}, 1000);
			},
			async toPreview(){
				if(this.customData <= 0)return this.$mHelper.toast("请选择表单组件");
				let customData = await this.saveFormInfo("preview");
				let remark = this.formInfo.remark;
				this.$store.commit('setFormData',{customData,remark});
				this.navigatePageTo('/pages/profile/form/edit','page',`source=formBuild`);
			},
			batchRemove(){
				this.batchRemoveFlag = !this.batchRemoveFlag;
			},
			saveFormInfo(flag){
				return new Promise((resolve,reject)=>{
					uni.showLoading({ title: "加载中" });
					let customData = this.deepCopyData(this.customData);
					
					var tempCustomData = [];
					while (tempCustomData.length !== customData.length){
						let item = customData.find(v=>v.sort === tempCustomData.length);
						delete item['sort'];
						delete item['y'];
						delete item['zIndex'];
						tempCustomData.push(item);					
					}
					tempCustomData = JSON.stringify(tempCustomData);
					// 预览不调用保存接口
					if(flag == 'preview'){
						resolve(tempCustomData);
					}else{
						this.$http.post(`${updateForm}`,{id: this.formInfo.id,customData: tempCustomData}).then(res => {
							uni.hideLoading();
							resolve(res);
						});						
					}
				});
			},
			moveFormItem(flag){
				let customData = this.deepCopyData(this.customData);
				let index = customData[this.showToastIndex].sort;
				let query = uni.createSelectorQuery().in(this);
				query.selectAll(`.form-item`).boundingClientRect((data) => {
					//当前排序前一个元素的下标
					let prevIdx = customData.findIndex(v=>v.sort === index - 1);
					//当前排序元素下标
					let currentIdx = customData.findIndex(v=>v.sort === index);
					customData[currentIdx].zIndex = 99;
					//当前排序下一个元素下标
					let nextIdx = customData.findIndex(v=>v.sort === index + 1);
					if(flag === 1){
						if(index === 0) return this.$mHelper.toast("无法继续向上移动");
						let topY = data[prevIdx].height;
						let bottomY = data[currentIdx].height;
						
						//前一个盒子向下移动,移动距离
						let moveBottomY = ~~customData[prevIdx].y + bottomY + 10;
						//后面盒子像上移动
						let moveTopY = ~~customData[currentIdx].y - topY - 10;
						customData[prevIdx].zIndex = 1;
						
						customData[prevIdx].y = moveBottomY;
						customData[currentIdx].y = moveTopY;
						
						//控制排序序号
						customData[currentIdx].sort -= 1;
						customData[prevIdx].sort += 1;
					}else if(flag === -1){
						if (index === (customData.length-1)) return this.$mHelper.toast("无法继续向下移动");
						let topY = data[currentIdx].height;
						let bottomY = data[nextIdx].height;
						
						//前一个盒子向下移动,移动距离
						let moveBottomY = ~~customData[currentIdx].y + bottomY + 10;
						//后面盒子像上移动
						let moveTopY = ~~customData[nextIdx].y - topY - 10;
						customData[nextIdx].zIndex = 1;
						
						customData[currentIdx].y = moveBottomY;
						customData[nextIdx].y = moveTopY;
						
						//控制排序序号
						customData[nextIdx].sort -= 1;
						customData[currentIdx].sort += 1;			
					}
					this.customData = customData;
				}).exec();
			}
		}
	}
</script>
<style lang="scss" scoped>
	.app-container{
		height: 100%;
		input{
			padding: 0 20upx;
			height: 60upx;
			border: 2upx solid #EEEEEE;
		}
		image{
			width: 100%;
			height: 100%;
		}
		.left-content{
			height: 100%;
			box-sizing: border-box;
			background-color: #FFFFFF;
			width: 23%;
			text-align: center;
			border: 2upx solid rgba(153, 153, 153, 0.2);
			border-left: none;
			border-top: none;
			.title{
				font-size: 28upx;
				padding: 20upx 0;
				border-bottom: 2upx solid rgba(153, 153, 153, 0.2);
				border-left: 10upx solid $base-color;
			}
			.components-warp{
				font-size: $font-secondary;
				padding: 0 10upx;
				.components-item{
					display: flex;
					flex-direction: column;
					align-items: center;
					margin: 20upx 0;
					padding: 20upx 0;
					background: #F6F7FF;
					border-radius: 8upx;
					&.disabled{
						background: #FE893B;
						.label{
							color: #FFFFFF;
						}
					}
					.icon{
						width: 36upx;
						height: 36upx;
						text-align: center;
						border-radius: 99%;
					}
					.label{
						margin-top: 16upx;
						color: #666666;
						font-size: $font-secondary;
					}
				}
			}
		}
		.right-content{
			width: 77%;
			height: 100%;
			overflow-y: auto;
			.footer{
				padding: 20upx;
				position: fixed;
				bottom: 0;
				left: 23%;
				right: 0;
				display: flex;
				background: #FFFFFF;
				z-index: 99;
				font-weight: bold;
				.btn{
					flex: 1;
					border-radius: 49upx;
					height: 80upx;
					line-height: 80upx;
					text-align: center;
					&:not(:last-child){
						margin-right: 20upx;
					}
				}
				.btn-1{
					background: #F2F2F2;
					color: #F32727;
				}
				.btn-2{
					background: #F2F2F2;
					color: $base-color;
				}
				.btn-3{
					background: $base-color;
					color: #FFFFFF;
				}
			}
			.form-warpper{
				padding-bottom: 100upx;
				.transition{
					transition: all .5s ease;
				}
				.form-desc{
					background: #FFFFFF;
					border: 4upx dotted #EEEEEE;
					padding: 20upx;
					color: #666666;
				}
				.form-item{
					font-size: 28upx;
					margin-bottom: 20upx;
					padding: 20upx 40upx;
					background: #FFFFFF;
					position: relative;
					.require{
						position: absolute;
						left: 24upx;
						top: 34upx;
						width: 10upx;
						height: 10upx;
					}
					.remove-btn{
						position: absolute;
						right: 20upx;
						top: 10upx;
						width: 50upx;
						height: 50upx;
						image{
							width: 100%;
							height: 100%;
						}
					}
					.toast-warp{
						display: flex;
						align-items: center;
						position: absolute;
						top: 0;
						bottom: 0;
						left: 0;
						right: 0;
						justify-content: space-evenly;
						padding: 0 40rpx;
						font-weight: bold;
						.toast{
							position: absolute;
							top: 0;
							bottom: 0;
							left: 0;
							right: 0;
							background: #A5A7A6;
							opacity: .4;	
						}
						.down-btn,.up-btn{
							width: 120upx;
							height: 120upx;
							align-items: center;
							justify-content: center;
							opacity: 1;
							border-radius: 99%;
							z-index: 99;
							background: $base-color;
							color: #FFFFFF;
							flex-direction: column;
							image{
								width: 50upx;
								height: 50upx;
							}
						}
					}
					.label{
						margin-bottom: 10upx;
						font-weight: bold;
					}
				}	
				.input-item{
					animation-duration: 2s;
					textarea{
						border: 2upx solid #EEEEEE;
						padding: 20upx;
						height: 150upx;
						width: auto;
					}
				}
				.upload-warp{
					.upload-main{
						flex-wrap: wrap;
						.upload-item{
							width: 160upx;
							height: 160upx;
							background-image: url(../../static/img/icon/form_upload01.png);
							background-size: 100% 100%;
							margin-right: 20upx;
							margin-bottom: 20upx;
							position: relative;
							&::after{
								content: "上传图片";
								position: absolute;
								color: #a8a8a8;
								font-size: 20upx;
								left: 0;
								right: 0;
								bottom: 28upx;
								text-align: center;
							}
						}
					}
				}
				.radio-main{
					.radio-item{
						margin-bottom: 10upx;
					}
					radio{
						transform:scale(0.9);
					}
				}
				.checkbox-main{
					.checkbox-item{
						margin-bottom: 10upx;
					}	
					checkbox{
						transform:scale(0.9);
					}
				}
				.select-main{
					picker{
						padding: 10upx 20upx;
						border: 2upx solid #EEEEEE;
					}
				}
			}
		}
	}
</style>
