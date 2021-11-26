<template>
	<view class="cam-list"
    :style="'border-radius:' + radius + 'px'">
    <slot name="top"/>
		<view class="list-item"
      v-for="(vo, index) in propinfo"
      @tap="navigateTo(vo.url, 'page', '', itemTap)"
      :key="index">
      <image class="icon-cell" :src="vo.icon"></image>
      <text class="title-cell"> {{ vo.title }}</text>
      <text class="program-font more-icon icon-gengduo">
      </text>
		</view>
	</view>
</template>
<script>
	export default {
    name: 'listItem',
    props: {
			propinfo: {
				type: Array
      },
      itemRemove: {
        type: [Number, String],
        default: ''
      },
      radius: {
        type: [Number,String],
        default: 3
      }
    },
		data() {
			return {
			};
    },
    mounted () {
      // console.log(this.itemClick)
	  console.log(this.itemClick)
    },
		methods: {
			// 切换语言
			switchLanguage() {
      },
      itemTap (res) {
        this.$emit('clickTap', res)
      },
			open() {
				this.homeActive = !this.homeActive;
			}
		}
	};
</script>
<style lang="scss">
	.cam-list {
    width: 690upx;
    margin: 0 auto;
    background: #fff;
    .list-item {
      width: 100%;
      height: 100upx;
      display: flex;
      .icon-cell {
        flex: 0 0 35upx;
        height: 35upx;
        padding: 36upx 20upx;
      }
      .title-cell {
        flex: 0 0 calc(84%);
        font-size: 26upx;
        line-height: 110upx;
      }
      .more-icon {
        font-size: 26upx;
        line-height: 55px;
      }
    }

	}
</style>
