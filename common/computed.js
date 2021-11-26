/*
 * @Description: computed
 * @Author: By AC
 * @Date: 2020-09-29 21:57:55
 * @Email: 289065365@qq.com
 * @LastEditTime: 2021-02-14 12:11:27
 * @LastEditors: // code
 */
import store from '@/store';
import { mapState } from "vuex";
import $mConstDataConfig from '@/config/constData.config.js'
import $filters from '@/common/filters.js'
import $mAssetsPath from '@/config/assets.config.js';
export default {
  ...mapState({
	  userInfo: (state) => state.userInfo
  }),
  constDataConfig () {
    return $mConstDataConfig
  },
  hasLoadings () {
    return false
  },
  hasLogin () {
    return store.getters.hasLogin;
  },
  $mAssetsPath () {
    return $mAssetsPath
  },
  moneySymbol () {
    return $mConstDataConfig.moneySymbol
  },
  shareMenuEnabled () {
    if (this.shareMenu) {
      uni.showShareMenu()
    } else {
      uni.hideShareMenu()
    }
  },
  $mFilters () {
    return $filters
  },
  isIPhoneX () {
    let flag = false
    uni.getSystemInfo({
      success (res) {
        // 判断设备是否为刘海屏
        if (res.screenHeight == 812 || res.screenHeight == 896) {
          flag = true
        } else {
          flag = false
        }
      }
    })
    return flag
  },
  saleId () {
    return uni.getStorageSync('saleId')
  },
  setcolor () {
    let color = store.getters.themeColor
    uni.setNavigationBarColor({
      frontColor: color,
      backgroundColor: '#15750a',
      animation: {
          duration: 400,
          timingFunc: 'easeIn'
          }
    })
  },
  themeColor: {
    get () {
      return store.getters.themeColor;
    },
    set (val) {
      store.state.themeColor = val;
    }
  }
}