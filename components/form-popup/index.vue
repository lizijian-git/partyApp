<template>
	<view>
		<u-popup v-model="show" mode="top" @close="popupClose">
			<view class="app-container">
				<view class="form-warpper">
					<view class="form-item">
						<view class="label">字段名称</view>
						<input v-model="formData.title" placeholder="请输入" />
					</view>
					<view v-if="formData.type === 1 || formData.type === 5" class="form-item">
						<view class="label">提醒文字</view>
						<input v-model="formData.config.placeholder" placeholder="请输入" />
					</view>
					<view v-if="formData.type === 2" class="form-item">
						<view class="label">上传数量</view>
						<u-number-box v-model="formData.config.limitNum" :min="1"></u-number-box>
					</view>
					<view v-if="formData.type === 3 || formData.type === 4 || formData.type === 7" class="form-item options-main">
						<view class="label flex">
							<view class="mr10">选项设置</view>
							<view class="add-btn" @tap.stop="handleAddOption">+添加</view>
							<!-- <view class="add-btn" @tap.stop="handleAddOption"></view> -->
						</view>
						<view v-for="(item,index) in formData.config.options" :key="index" class="input-item flex">
							<input class="mr10 mb5" v-model="formData.config.options[index]" placeholder="请输入" />
							<view class="reduce-btn" @tap.stop="removeOption(index)"></view>
						</view>
					</view>
					<view v-if="formData.type === 6" class="form-item">
						<view class="label">类型选择</view>
						<view class="form-item flex">
							<view v-for="item in timeType" :key="item.type" @tap.stop="handleTimeType(item.type)" :class="['type-btn','mr10',{'active': item.type === formData.config.timeType}]">
								{{ item.name }}
							</view>
						</view>
					</view>
					<view class="form-item setting-main">
						<view class="label">设置</view>
						<u-checkbox-group :wrap="true" :active-color="themeColor">
							<u-checkbox v-model="formData.isRequire" name="isRequire">设为必填项</u-checkbox>
							<u-checkbox v-model="formData.isShow" name="isShow">该组件提交的记录用于展示</u-checkbox>
						</u-checkbox-group>
					</view>
				</view>
				<view class="footer">
					<view class="btn cancel-btn" @tap.stop="close">取消</view>
					<view class="btn confirm-btn" @tap.stop="confirm">确定</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	name:"form-popup",
	components:{},
	props:{
		value: {
			type: Object,
			required: true
		}
	},
	watch: {
		value: {
			handler(nVal){
				this.formData = nVal;		
			}
		}
	},
	data() {
		return {
			show: false,
			formData: {},
			timeType: [
				{
					type: 1,
					name: '年份'
				},
				{
					type: 2,
					name: '年月'
				},
				{
					type: 3,
					name: '年月日'
				},
				{
					type: 4,
					name: '年月日时分'
				}
			]
		};
	},
	methods:{
		confirm(){
			let formData = this.deepCopyData(this.formData);
			if((formData.type == 3 || formData.type == 4 || formData.type == 7)){
				let options = formData.config.options;
				if(options.length <= 0)return this.$mHelper.toast("请至少设置一个选项");
				formData.config.options = options.filter(v=>v);
				let len = formData.config.options.length;
				if(len <= 0)return this.$mHelper.toast("选项内容不能为空");
				this.formData = formData;
			}
			this.formData['isRequire'] = Number(this.formData['isRequire']);
			this.formData['isShow'] = Number(this.formData['isShow']);
			this.$emit('confirm',this.formData);
			this.close();
		},
		open(){
			this.show = true;
		},
		close(){
			this.show = false;
		},
		handleTimeType(type){
			this.formData.config.timeType = type;
		},
		handleAddOption(){
			this.formData.config.options.push('');
		},
		removeOption(index){
			this.formData.config.options.splice(index,1);
		},
		popupClose(){
			this.$emit('close');
		}
	}
}
</script>

<style lang="scss" scoped>
.app-container{
	background: #FFFFFF;
	padding: 20upx 20upx 40upx;
	.form-warpper{
		padding: 0 20upx;
		margin-bottom: 20upx;
		.form-item{
			margin-bottom: 20upx;
			.label{
				margin-bottom: 10upx;
				font-size: $font-lg;
				font-weight: bold;
			}
			input{
				border: 2upx solid #EEEEEE;
				padding: 10upx 20upx;
			}
			.mr10{
				margin-right: 20upx;
			}
			.mb5{
				margin-bottom: 10upx;
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
			font-weight: normal;
			font-size: $font-secondary;
		}
		.reduce-btn{
			width: 60upx;
			height: 60upx;
			background-size: 100% 100%;
			background-image: url(../../static/img/icon/icon_sub.png);
			margin-bottom: 12upx;	
		}
		.type-btn{
			border-radius: 6upx;
			background: rgba(255, 255, 255, 0.5);
			border: 1px solid rgba(153, 153, 153, 0.2);
			opacity: 0.7;
			height: 52upx;
			line-height: 52upx;
			box-sizing: content-box;
			padding: 0 20upx;
			&.active{
				color: #07C160;
				background: rgba(7, 193, 96, 0.22);
				border: 2upx solid #07C160;
			}
		}
		.options-main{
			.flex{
				align-items: center;
			}
		}
	}
	.footer{
		display: flex;
		justify-content: center;
		font-weight: bold;
		.btn{
			border-radius: 49upx;
			padding: 0 80upx;
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			&:not(:last-child){
				margin-right: 50upx;
			}
		}
		.cancel-btn{
			border: 1px solid rgba(153, 153, 153, 0.30196078431372547);
			box-shadow: 0px 0px 6px rgba(255, 255, 255, 0.16);
			color: $base-color;
		}
		.confirm-btn{
			background: $base-color;
			color: #FFFFFF;
		}
	}
}
</style>
