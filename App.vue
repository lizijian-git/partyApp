<!--
 * @Description: 应用主入口
 * @Author: By AC
 * @Date: 2020-09-29 21:57:55
 * @Email: 289065365@qq.com
 * @LastEditTime: 2020-12-23 23:02:34
 * @LastEditors: // code
-->
<script>
import idxConfig from "@/config/idxConfig";
import utils from "@/utils/utils.js";
export default {
	data () {
		return {}
	},
	onLaunch: function() {
		utils.getMallConfig();
	},
	onShow: function() {
		// console.log('App Show');
	},
	onHide: function() {
		// console.log('App Hide');
	}
};
</script>
<style lang="scss">

// import scss
@import './static/scss/main.scss';
@import './static/scss/reset.scss';
@import './components/aui-dialog/common/aui/css/aui.css';
@import "uview-ui/index.scss";
// @import url("./common/aui/css/aui.iconfont.css");
// 导入阿里巴巴矢量图标库
/*#ifdef MP*/
@import './static/iconfont/iconfont.css';
@import './static/iconfont/camp.css';
/*#endif*/
/*#ifndef MP*/
@import url('https://at.alicdn.com/t/font_2030146_wodkrrsp7hq.css');
/*#endif*/

/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */
</style>
