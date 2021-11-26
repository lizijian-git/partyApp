<template>
	<view class="app-container">
		<formList ref="formListRef" :current="current" :tabs="tabs" />
	</view>
</template>

<script>
import { formNum } from '@/api/userInfo.js';
import formList from '@/components/form-list'
export default{
	components:{
		formList
	},
	data() {
		return {
			tabs: ['我发起的', '我参与的']
		}
	},
	onLoad(options) {
		this.$refs.formListRef.current = ~~options.current;
		this.$refs.formListRef.getFormList();
		this.getFormNum();
	},
	methods: {
		/**
		 * 获取表单数量
		 */
		getFormNum(){
			this.$http.post(`${formNum}`,{}).then(res => {
				let records = res.records;
				let { formAttendNum,formSelfNum } = records;
				let tabs = ['我发起的', '我参与的'];
				if(formAttendNum > 0)tabs[1] = `我参与的(${ formAttendNum })`
				if(formSelfNum > 0)tabs[0] = `我发起的(${ formSelfNum })`
				this.tabs = tabs;
			});
		}
	},
}
</script>

<style>
</style>
