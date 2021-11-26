<template>
	<view class="app-container">
		<view class="form-name">{{ formName }}</view>
		<view class="form-desc">
			{{ formDesc }}(共{{ customData.length }}项)
		</view>
		<view class="form-warpper font-base">
			<u-form label-position="top" errory-type="toast">
				<u-form-item v-for="(item,index) in customData" :key="index" :label-style="{fontWeight: 'bold'}" :border-bottom="false" :label="(index+1)+'.'+item.title" :required="item.isRequire == 1">
					<u-input v-if="item.type === 1" v-model="item.data" :placeholder="item.config.placeholder" :border="true" />
					<!-- <u-upload v-else-if="item.type === 2" :auto-upload="false" ></u-upload> -->
					<view v-else-if="item.type === 2" class="upload-main flex">
						<block v-for="(uItem,uIndex) in item.config.limitNum" :key="uIndex">
							<view v-if="!item.data[uIndex]" class="upload-item" @tap.stop="picUpload(index,uIndex)"></view>
							<view v-else class="pic-url">
								<image :src="item.data[uIndex]" mode="" @tap.stop="picUpload(index,uIndex)"></image>
								<view class="remove-btn" @tap.stop="removePic(index,uIndex)">
									<image src="../../../static/img/icon/icon_sub.png" mode=""></image>
								</view>
							</view>
						</block>
					</view>
					<u-radio-group v-else-if="item.type === 3" v-model="item.data" :active-color="themeColor" :wrap="true">
						<u-radio v-for="option in item.config.options" :key="option.value" :name="option.value">
							{{option.value}}
						</u-radio>
					</u-radio-group>
					<u-checkbox-group v-else-if="item.type === 4" :active-color="themeColor" :wrap="true">
						<u-checkbox v-model="option.checked" v-for="option in item.config.options" :key="option.value" :name="option.value">
							{{option.value}}
						</u-checkbox>
					</u-checkbox-group>
					<u-input v-else-if="item.type === 5" v-model="item.data" :placeholder="item.config.placeholder" :border="true" type="textarea" />
					<u-input v-else-if="item.type === 6" v-model="item.data" :border="true" type="select" @click="showDatePicker(item.config.timeType,index)" />
					<u-input v-else-if="item.type === 7" v-model="item.data" :border="true" type="select" @click="showSelect(item.config.options,index)" />
				</u-form-item>
			</u-form>
			<!-- <view v-for="(item,index) in customData" :key="index" class="form-item">
				<view class="label">{{ index + 1 }}、{{ item.name }}</view>
				<view v-if="item.type === 1">
					<input v-model="item.data" :placeholder="item.config.placeholder" />
				</view>
				<view v-else-if="item.type === 2" class="upload-warp">
					<view v-for="n in item.config.limitNum" :key="n" class="upload-item"></view>
				</view>
				<view v-else-if="item.type === 3">
					<radio-group>
						<view v-for="option in item.config.options" :key="option" class="mb5">
							<radio :value="option">{{ option }}</radio>
						</view>
					</radio-group>
				</view>
				<view v-else-if="item.type === 4">
					<checkbox-group>
						<view v-for="option in item.config.options" :key="option" class="mb5">
							<checkbox :value="option">{{ option }}</checkbox>
						</view>
					</checkbox-group>
				</view>
				<view v-else-if="item.type === 5">
					<textarea :placeholder="item.config.placeholder"></textarea>
				</view>
				<view v-else-if="item.type === 6">
					<input placeholder="请选择日期时间" disabled @tap.stop="showDatePicker(item.config.timeType)"></input>
				</view>
				<view v-else-if="item.type === 7">
					<input placeholder="请选择" v-model="item.data" disabled @tap.stop="showSelect(item.config.options,index)"></input>
				</view>
			</view> -->
		</view>
		<view v-if="source != 'formBuild' && source != 'formDetail'" class="footer flex">
			<view class="submit" @tap.stop="submitForm">{{ id ? '再次提交' : '提交' }}</view>
		</view>
		<u-picker v-model="datePickerVisiable" mode="time" :params="pickerParams" :confirm-color="themeColor" @confirm="pickerConfirm"></u-picker>
		<u-select v-model="selectVisiable" mode="single-column" :list="options" :default-value="selectDefault" :confirm-color="themeColor" @confirm="selectConfirm"></u-select>
	</view>
</template>

<script>
import { formDetail,formAttendDetail,updateFormAttend,addFormAttend,UPLOAD_FILE } from '@/api/basic.js';
import wechatAuth from "@/utils/wechatAuth";
export default{
	mixins: [wechatAuth],
	data(){
		return{
			id: '', //表单内容id
			formId: '', //表单id
			formName: '',
			formDesc: '',
			formData: {},
			customData: [],
			pickerParams: {
				year: true
			},
			isCreator: 0, //是否是建表人
			editIndex: 0,
			datePickerVisiable: false,
			selectVisiable: false,
			selectDefault: [0],
			options: [],
			source: '' //来源
		}
	},
	async onLoad(options){
		uni.showLoading({ title: "加载中" });
		let scene = decodeURIComponent(options.scene);
		this.formId = options.formId || this.queryRouteparams(scene, 'formId');
		if(options.source){
			this.source = options.source;
		}
		if(options.id){
			this.id = options.id;
			let res = await this.getFormAttendDetail({id: this.id});
			let records = res.records;
			this.formData = JSON.parse(records.formData);
		}else if(this.hasLogin && this.source == 'index'){
			let userId = uni.getStorageSync("userInfo").id;
			let res = await this.getFormAttendDetail({ formId: this.formId,userId });
			let records = res.records;
			if(records){
				this.id = records.id;
				this.formData = JSON.parse(records.formData);				
			}
		}

		if( options.source == 'formBuild' ){
			let {customData,remark} = this.$store.state.formData;
			this.formDesc = remark;
			this.initForm(JSON.parse(customData));
		}else{
			this.getFormDetail();	
		}
	},
	methods:{
		getFormAttendDetail(data){
			return new Promise((resolve,reject)=>{
				this.$http.post(`${formAttendDetail}`,data).then(res => {
					resolve(res);
				});				
			});
		},
		getFormDetail(){
			let userId = uni.getStorageSync("userInfo").id;
			this.$http.post(`${formDetail}`,{ userId,id: this.formId }).then(res => {
				let formInfo = res.records.formInfo;
				let customData = JSON.parse(formInfo.customData);
				this.initForm(customData);
				this.isCreator =  res.records.isCreator;
				this.formName = formInfo.name;
				this.formDesc = formInfo.remark;
			});
		},
		initForm(customData){
			customData.forEach(v=>{
				//处理选项的数据结构：[{ label: '',value: '' }]
				if(v.type === 3 || v.type === 4 || v.type === 7){
					let options = v.config.options;
					let tempOptions = [];
					options.forEach(v1=>{
						tempOptions.push({ label: v1,value: v1 })
					});
					//多选要设置checked,用于数据绑定
					if(v.type === 4){
						tempOptions.map(v=>v.checked = false);
					}
					v.config.options = tempOptions;
				}
				
				if(v.type === 2 || v.type === 4){
					v.data = v.data || [];
				}else{
					v.data = v.data || '';
				}
			});
			
			//编辑
			if(this.id){
				this.formData.forEach(v=>{
					customData.forEach(v1=>{
						if(v.name == v1.name){
							v1.data = v.data;
							if( v1.type === 4 ){
								let options = v1.config.options;
								options.map(v=>v.checked = v1.data.includes(v.value));
							}
						}
					})
				});
			}
			this.customData = customData;
			uni.hideLoading();
		},
		showDatePicker(timeType,index){
			if( timeType >= 2 )this.pickerParams.month = true;
			if( timeType >= 3 )this.pickerParams.day = true;
			if( timeType >= 4 )this.pickerParams.hour = true;
			if( timeType == 5 )this.pickerParams.minute = true;
			this.editIndex = index;
			this.datePickerVisiable = true;
		},
		showSelect(options,index){
			this.options = options;
			this.editIndex = index;
			this.selectVisiable = true;
		},
		pickerConfirm(e){
			let { year,month,day,hour,minute } = e;
			let dateStr = year;
			if(month)dateStr += "-" + month;
			if(day)dateStr += "-" + day;
			if(hour)dateStr += " " + hour;
			if(minute)dateStr += ":" + minute;
			this.customData[this.editIndex].data = dateStr;
		},
		// 图片上传
		picUpload(itemIndex,picIndex){
			uni.showLoading({title: '加载中'});
			this.$utils.uploadFile().then((res)=>{
				this.customData[itemIndex].data[picIndex] = res;
				this.$forceUpdate();
				uni.hideLoading();
			}).catch(()=>{
				uni.hideLoading();
			});
		},
		removePic(itemIndex,picIndex){
			this.customData[itemIndex].data.splice(picIndex,1);
		},
		selectConfirm(e){
			let data = e[0];
			this.customData[this.editIndex].data = e[0].value;
		},
		submitForm(){
			
			if(!this.hasLogin){
				this.onGotUserInfo();
				return;
			}
			
			let formData = this.deepCopyData(this.customData);
			
			formData.forEach(v=>{
				//处理选项的数据结构：[{ label: '',value: '' }]
				if(v.type === 3 || v.type === 4 || v.type === 7){
					let options = v.config.options;
					let tempOptions = [];
					if(v.type === 4){
						let data = [];
						options.forEach(v1=>{
							if(v1.checked)data.push(v1.value);
						});
						v.data = data;
					}
					options.forEach(v1=>{
						tempOptions.push(v1.value);
					});
					v.config.options = tempOptions;
				}
			});
			this.checkFormVaild(formData).then(async (res)=>{
				uni.showLoading({ title: "加载中" });
				let userId = uni.getStorageSync("userInfo").id;
				let data = {		
					userId,
					formId: this.formId,
					formData: JSON.stringify(formData)
				}
				
				let rr = await this.getFormAttendDetail({ formId: this.formId,userId });
				if(rr.records && rr.records.id){
					this.id = rr.records.id;
					this.isCreator = rr.records.isCreator;
				}
				if(this.id){
					data.id = this.id;
					this.updateFormAttend(data);
				}else{
					this.addFormAttend(data);
				}				
			}).catch(err=>{
				this.$mHelper.toast(err);
			});
		},
		checkFormVaild(formData){
			return new Promise((resolve,reject)=>{
				for (var i = 0; i < formData.length; i++) {
					if(formData[i].isRequire && (!formData[i].data || !formData[i].data.length)){
						reject(formData[i].title+"不能为空");
					}
				}			
				resolve();
			});
		},
		addFormAttend(data){
			this.$http.post(`${addFormAttend}`,data).then(res => {
				uni.hideLoading();
				if(this.isCreator){
					this.$mHelper.toast("提交成功",3000,false,'success');
					setTimeout(()=>{
						this.navigatePageTo('/pages/profile/form/detail','page',`id=${ res.records.formId }`);
					}, 1000);
				}else{
					this.navigatePageTo('/pages/profile/form/successTips','page',`id=${ res.records.formId }`);
				}
			});
		},
		updateFormAttend(data){
			this.$http.post(`${updateFormAttend}`,data).then(res => {
				uni.hideLoading();
				if(this.isCreator){
					this.$mHelper.toast("提交成功",3000,false,'success');
					setTimeout(()=>{
						this.navigatePageTo('/pages/profile/form/detail','page',`id=${ res.records.formId }`);
					}, 1000);
				}else{
					this.navigatePageTo('/pages/profile/form/successTips','page',`id=${ res.records.formId }`);
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
		padding: 0 28upx;
		image{
			width: 100%;
			height: 100%;
		}
		.form-name{
			text-align: center;
			margin: 36upx 0 20upx;
			font-size: 34upx;
			font-weight: bold;
		}
		.form-desc{
			border: 4upx dotted #EEEEEE;
			padding: 20upx;
			color: #666666;
		}
		.form-warpper{
			padding-bottom: calc(70px + constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
			padding-bottom: calc(70px + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
			.mb5{
				margin-bottom: 10upx;
			}
			.upload-main{
				flex-wrap: wrap;
				margin-bottom: 20upx;
				.pic-url,.upload-item{
					width: 160upx;
					height: 160upx;
					margin-right: 20upx;
					position: relative;
					.remove-btn{
						position: absolute;	
						width: 50upx;
						height: 50upx;
						top: -26upx;
						right: -10upx;
					}
				}
				.upload-item{
					background-image: url(../../../static/img/icon/form_upload01.png);
					background-size: 100% 100%;
					position: relative;
					&::after{
						content: "上传图片";
						position: absolute;
						color: #a8a8a8;
						font-size: 20upx;
						left: 0;
						right: 0;
						bottom: 0;
						text-align: center;
					}
				}
			}
			.form-item{
				margin-bottom: 20upx;
				.label{
					margin-bottom: 10upx;
				}
				input{
					border: 2upx solid #EEEEEE;
					padding: 10upx 20upx;
				}
				textarea{
					border: 2upx solid #EEEEEE;
					padding: 20upx;
					height: 200upx;
					width: auto;
				}
				.upload-warp{
					.upload-item{
						border: 4upx dotted #EEEEEE;
						width: 200upx;
						height: 200upx;
					}
				}
			}
		}
		.footer{
			padding: 0 20upx;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #FFFFFF;
			justify-content: center;
			z-index: 99;
			padding-bottom: calc(20px + constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
			padding-bottom: calc(20px + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
			.submit{
				background: $base-color;
				color: #FFFFFF;
				border-radius: 49upx;
				height: 80upx;
				line-height: 80upx;
				width: 660upx;
				font-weight: bold;
				text-align: center;
			}			
		}
	}
</style>
