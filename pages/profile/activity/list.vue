<template>
	<view class="app-container">
		<activityList ref="activityListRef" :current="current" :tabs="tabs" />
	</view>
</template>

<script>
import { formNum } from '@/api/userInfo.js';
import activityList from '@/components/activity-list'
export default{
	components:{
		activityList
	},
	data() {
		return {
			tabs: ['我发起的', '我参与的']
		}
	},
	onLoad(options) {
		this.$refs.activityListRef.current = ~~options.current;
		this.$refs.activityListRef.getActivityList();
		this.getFormNum();
	},
	methods: {
		/**
		 * 获取活动数量
		 */
		getFormNum(){
			this.$http.post(`${formNum}`,{}).then(res => {
				let records = res.records;
				let { activityAttendNum,activitySelfNum } = records;
				let tabs = ['我发起的', '我参与的'];
				if(activityAttendNum > 0)tabs[1] = `我参与的(${ activityAttendNum })`
				if(activitySelfNum > 0)tabs[0] = `我发起的(${ activitySelfNum })`
				this.tabs = tabs;
			});
		}
	},
}
</script>

<style>
</style>
