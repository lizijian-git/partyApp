<template>
	<view class="tabbar_box">
	  <view v-for="(item,index) in tabBar.list" :key="item.text" class="tabbar_nav" @tap.stop="setSelected(index)">
		<view v-if="item.isSpecial" class='special-wrapper'>
			<image class="tabbar_icon" :src="item.selectedIconPath"></image>
			<text :class="[{ 'bese-color' : selected === index }]">{{item.text}}</text>
		</view>
		<block v-else>
			<image class="tabbar_icon" :src=" selected === index ? item.selectedIconPath : item.iconPath"></image>
			<text :class="[{ 'bese-color' : selected === index }]">{{item.text}}</text>			  			  
		</block>
	  </view>
	  <leePopou type="bottom" ref="share" :round="true" :animation="animation" padding="0">
		  <view class="popou-content">
			  <view class="title">类型选择</view>
			  <view class="flex-item flex">
				  <view class="item flex flex-1" @tap.stop="toPath('/pages/form/edit')">
					  <image src="../../static/img/tab/form.png" mode=""></image>
					  <view class="text">信息表单</view>
				  </view>
				  <view class="item flex flex-1" @tap.stop="toPath('/pages/activity/edit')">
					  <image src="../../static/img/tab/activity.png" mode=""></image>
					  <view class="text">聚会活动</view>
				  </view>
			  </view>
			  <view style="height: 10rpx;background-color: #F7F7F7;"></view>
			  <view class="cell-line" @tap.stop="pupouClose('share')">
			  	取 消
			  </view>
		  </view>
	  </leePopou>
	</view>
</template>
<script>
import wechatAuth from "@/utils/wechatAuth";
import leePopou from '@/components/lee-popup/lee-popup';
export default{
	mixins: [wechatAuth],
	components: {
		leePopou
	},
	props: ['selected'],
	data(){
		return{
			animation: false,
			tabBar: {
				list: [
					{
						"pagePath": "/pages/index/index",
						"iconPath": "../../static/img/tab/home.png",
						"selectedIconPath": "../../static/img/tab/home-active.png",
						"text": "首页"
					},
					{
					  "pagePath": "/pages/form/edit",
					  "selectedIconPath": "../../static/img/tab/launch-active.png",
					  "isSpecial": true,
					  "text": "发布"
					},
					{
					  "pagePath": "/pages/profile/index",
					  "iconPath": "../../static/img/tab/mine.png",
					  "selectedIconPath": "../../static/img/tab/mine-active.png",
					  "text": "个人中心"
					}
				]
			}
		}
	},
	methods:{
		// 验证登录
		callback (data) {
			if(!data.isLogin){
				this.onGotUserInfo();
				return;
			}
			this.navigatePageTo(data.path, data.type)
		},
		setSelected(index){
			if(index === 1){
				this.animation = true;
				this.$refs.share.open();
				// this.navigateTo(this.tabBar.list[index].pagePath,'page', '',this.callback);
			}else{
				this.navigatePageTo(this.tabBar.list[index].pagePath,'tab');
			}
		},
		toPath(path){
			this.pupouClose('share');
			this.navigateTo(path,'page', '',this.callback);
		},
		// 关闭
		pupouClose(ref){
			this.$refs[ref].close();
		},
	}
}
</script>
<style lang="scss" scoped>
	.tabbar_box {
	  display: flex;
	  flex-direction: row;
	  justify-content: space-around;
	  position: fixed;
	  left: 0;
	  bottom: 0;
	  z-index: 999;
	  width: 100%;
	  padding-top: 10upx;
	  padding-bottom: calc(constant(safe-area-inset-bottom)); /*兼容 IOS<11.2*/
	  padding-bottom: calc(env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
	  background: #FFFFFF;
	  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
	  .popou-content{
		  font-size: 34upx;
		  .title{
			  text-align: center;
			  padding: 40upx 0;
		  }
		  .flex-item{
			  padding: 0 40upx 40upx;
			  image{
				  width: 60upx;
				  height: 60upx;
			  }
			  .item{
				  color: #000;
				  border: 2upx solid #dcdfe6;
				  align-items: center;
				  border-radius: 9upx;
				  padding: 30upx;
				  &:first-child{
					  margin-right: 34upx;
				  }
				  .text{
					  margin-left: 20upx;
					  font-weight: bold;
				  }
			  }
		  }
		  .cell-line{
			  height: 80upx;
			  line-height: 80upx;
			  text-align: center;
		  }
	  }
	}
	.tabbar_nav {
	  flex: 1;
	  display: flex;
	  flex-direction: column;
	  justify-content: center;
	  align-items: center;
	  font-size: 20rpx;
	  height: 100%;
	  padding: 0;
	  position: relative;
	}
	.tabbar_icon {
	  width: 48rpx;
	  height: 48rpx;
	  padding-bottom: 5rpx;
	}
	.special-wrapper {
	  position: absolute;
	  /* left: 77rpx; */
	  top: -36rpx;
	  width: 108rpx;
	  height: 108rpx;
	  border-radius: 50%;
	  border-top: 2rpx solid #f2f2f3;
	  background-color: #fff;
	  text-align: center;
	  box-sizing: border-box;
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	}
	.special-wrapper .tabbar_icon {
	  width: 75rpx;
	  height: 75rpx;
	  margin: 6rpx 0 4rpx;
	  flex-shrink: 0;
	}
	.special-text-wrapper {
	  width: 56rpx;
	  height: 56rpx;
	}
	
	.special-text-wrapper text {
	  padding-bottom: 20rpx;
	}

</style>