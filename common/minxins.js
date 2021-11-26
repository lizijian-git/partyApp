/*
 * @Description: 混入
 * @Author: By AC
 * @Date: 2020-09-29 21:57:55
 * @Email: 289065365@qq.com
 * @LastEditTime: 2021-02-18 21:33:09
 * @LastEditors: // code
 */

import $filters from '@/common/filters.js'
import $computed from '@/common/computed.js'
import methods from '@/common/methods'
import store from '@/store';
import { getShareInfo } from '@/api/basic.js';
export default {
	data () {
		return {
			listTotal: 1,
			shareMenu: true,
			hasLoading: true,
			sceneType: '',
			bizId: '',
			wxshare:{
				title:'聚喜爱欢迎您~',
				path:'/pages/index/index',
				imageUrl:'',
				desc:'',
				content:''
			}
		}
	},
	async onShareAppMessage (res) {		
		let records = await this.getShareInfo({ sceneType: this.sceneType,bizId: this.bizId });
		let imageUrl = records.sharePicUrl;
		let title = records.title;
		return {
		  title,
		  path: this.wxshare.path,
		  imageUrl,
		  desc: this.wxshare.desc,
		  content: this.wxshare.content,
		  success (res) {},
		  fail (res) {}
		}
	},
	onShow () {},
	onLoad (options) {},
	methods: methods,
	filters: $filters,
	computed: $computed
}
