<template>
  <view class="app-containner">
	  <view class="main-warpper">
	  	<view class="article">
	  		<text class="title">问题描述</text>
			<view class="content">
				<textarea type="textarea" maxlength="200"  v-model="feedForm.content" placeholder="使用中遇到的问题，希望增加的服务，对应优化的建议，都欢 迎您写在这里，感谢您帮助我们做的更好。"></textarea>
				<text decode="true" style="float: right;">{{ feedForm.content.length }}/200</text>
			</view>
			<label>联系电话：</label>
			<view class="tel">
				<input type="number" v-model="feedForm.phone" placeholder="请输入您的联系电话或手机号码"></input>
			</view>
	  	</view>
	  </view>
		<button type="primary" form-type="submit" aria-placeholder="" @tap.stop="submitFeedback()" class="bind-btn" :style="{ backgroundColor: themeColor }"> 提交 </button>
    </view>
</template>
<script>
import { addUserFeedback } from '@/api/basic'
export default {
  data() {
    return {
      feedForm: {
        phone: '',
        content: ''
      }
    }
  },
  methods: {
    submitFeedback () {
      if (!this.feedForm.phone) {
        return this.$mHelper.toast('请输入手机号')
      } else if (!this.feedForm.content) {
        return this.$mHelper.toast('请输入反馈的内容')
      }
      this.$http.post(`${addUserFeedback}`, this.feedForm).then(r => {
        this.$mHelper.toast('反馈已提交成功')
		setTimeout(()=>{
			this.$mRouter.back()
		},1000);
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
html, body, page, .uni-page-body {
  background: #F7F8FA!important;
}
.app-containner {
	padding: 20rpx;
	button{
		&::after{
			border: none;
		}
	}
	  .bind-btn {
	      width: 600upx;
	      height: 88upx;
	      line-height: 88upx;
	      margin-top: 202upx;
	      color: #fff;
	      border-radius: 60upx;
	  }
	.main-warpper{
		padding: 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		.title{
			font-weight: bold;
		}
		.content{
			margin: 16rpx 0;
			background-color: #F7F8FA;
			border-radius: 10rpx;
			height: 400rpx;
			padding: 20rpx;
			font-size: 26rpx;
			textarea{
				width: 100%;
				height: 80%;
			}
		}		
		label{
			font-size: 28rpx;
		}
		.tel{
			margin: 16rpx 0;
			font-size: 26rpx;
			padding: 20rpx;
			background-color: #F7F8FA;
			border-radius: 10rpx;
		}
	}
}
</style>