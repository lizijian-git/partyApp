<template>
	<view class="empay-box" :style="{'marginTop': mrTop}" v-if="total === 0">
	   <view>
		  <image class="empty-image" src="../../static/img/icon/icon_empty.png"></img>
	   </view>
	   <slot>
			<text class="text"> {{ text }}</text>
	   </slot>
	</view>
</template>
<script>
export default {
  name: 'pageEmpty',
  props: {
	mrTop: {
		type: String,
		default: '74rpx'
	},
    total: {
      type: [Number, String],
      default: 0
    },
    text: {
      type: String,
      default: '暂无数据'
    }
  },
  data () {
    return {
      show: false
    }
  },
  computed: {
    showEmpty () {
      return this.total <= 0
    }
  }
}
</script>
<style lang="scss" scoped>
.empay-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 0 74upx;
	view{
	  width: 226upx;
	  height: 180upx;
	  min-height: 180upx;
	  .empty-image {
		width: 100%;
		height: 100%;
	  }
	}
	  .text {
		font-size: $font-secondary;
		line-height: 70upx;
		text-align: center;
		color: #999999;
	  }
}
</style>