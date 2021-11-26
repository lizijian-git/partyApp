<template>
	<view class="app-container">
		<view class="form-warpper">
			<view class="cell-line flex font-base title-warp">
				<view class="form-title flex-1">{{ activityInfo.name }}</view>
				<view v-if="activityInfo.isCreator" class="edit-btn" @tap.stop="toActivityEdit">编辑</view>
			</view>
			<view class="cell-line flex tag-list font-base-secondary">
				<view class="tag-item" v-for="label in activityInfo.label" :key="label">{{ label }}</view>
			</view>
			<view class="main-item font-base-secondary">
				<view class="cell-line mb10 flex">
					<view class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../static/img/icon/icon_release.png" mode=""></image>
							</view>
							<view class="label">开始时间</view>							
						</view>
						<view class="value">{{ activityInfo.createTime | formatDate("yyyy-MM-dd hh:mm") }}</view>
					</view>
					<view v-if="activityInfo.endTime" class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../static/img/icon/icon_end.png" mode=""></image>
							</view>
							<view class="label">结束时间</view>
						</view>
						<view class="value">{{ activityInfo.endTime | formatDate("yyyy-MM-dd hh:mm") }}</view>
					</view>
				</view>
				<view class="cell-line mb10 flex">
					<view class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../static/img/icon/icon_publisher.png" mode=""></image>
							</view>
							<view class="label">发起人</view>
						</view>
						<view class="value">{{ activityInfo.nickname }}</view>
					</view>
					<view v-if="activityInfo.telephone" class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../static/img/icon/icon_phone.png" mode=""></image>
							</view>
							<view class="label">联系电话</view>
						</view>
						<view class="value">{{ activityInfo.telephone }}</view>
					</view>
				</view>
				<view class="cell-line mb10 flex">
					<view v-if="activityInfo.isTimeLimit === 1" class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../static/img/icon/icon_limit.png" mode=""></image>
							</view>
							<view class="label">报名截止时间</view>							
						</view>
						<view class="value">{{ activityInfo.limitTime | formatDate("yyyy-MM-dd hh:mm") }}</view>
					</view>
					<view v-if="activityInfo.isNumLimit === 1" class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../static/img/icon/icon_numLimit.png" mode=""></image>
							</view>
							<view class="label">人数限制</view>
						</view>
						<view class="value">{{ activityInfo.limitNum }}人</view>
					</view>
				</view>
				<view class="cell-line flex mb10" @tap.stop="openLocation">
					<view class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../static/img/icon/icon_address.png" mode=""></image>
							</view>
							<view class="label flex-1">活动地点</view>
							<view class="iconfont icon-right"></view>
						</view>
						<view class="value">{{ activityInfo.city }}{{ activityInfo.region }}{{ activityInfo.address }}</view>
					</view>
				</view>
				<view v-if="activityInfo.remark" class="cell-line flex">
					<view class="form-item flex-1">
						<view class="cell-flex flex">
							<view class="icon">
								<image src="../../static/img/icon/icon_desc.png" mode=""></image>
							</view>
							<view class="label">备注要求</view>
						</view>
						<view class="value">{{ activityInfo.remark }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="active-main">
			<view class="tabs flex">
				<view :class="['tab-pane',{ 'active' : current === 0 }]" @tap.stop="handleTabClick(0)">参与人员</view>
				<view :class="['tab-pane',{ 'active' : current === 1 }]" @tap.stop="handleTabClick(1)">费用清单</view>
				<view :class="['tab-pane',{ 'active' : current === 2 }]" @tap.stop="handleTabClick(2)">空间相册</view>
			</view>
			<view v-if="current === 0" class="tab-main tab-0">
				<view class="btn-box flex">
					<view class="status-btn flex">
						<view :class="['btn',{'active' : queryParams.status === 1}]" @tap.stop="doQuery('attend',1)">{{ countNum.attendNum | formatCountNum('参加') }}</view>
						<view :class="['btn',{'active' : queryParams.status === -1}]" @tap.stop="doQuery('attend',-1)">{{ countNum.absentNum | formatCountNum('不参加') }}</view>
						<view :class="['btn',{'active' : queryParams.status === 0}]"  @tap.stop="doQuery('attend',0)">{{ countNum.waitNum | formatCountNum('待定') }}</view>
					</view>
					<view class="tools-btn">
						<!-- <view class="btn delete" @tap.stop="removeFlag = !removeFlag">{{ removeFlag ? '取消' : '移除' }}</view> -->
					</view>
				</view>
				<view class="list-warp">
					<u-swipe-action :show="Boolean(data.show)" v-for="(data,index) in dataList" :key="data.id" btn-width="120" @open="open(index)" @click="removeListData(data.id)" :options="options" :disabled="!activityInfo.isCreator && userInfo.id == activityInfo.userId">
						<view class="list-item">
							<view class="cell-line flex">
								<view class="user-info flex flex-1">
									<view class="avatar">
										<image :src="data.picUrl" mode=""></image>
									</view>
									<view class="nickname">{{data.nickname }}</view>
								</view>
								<view class="date-time">{{ data.createTime | formatDate("yyyy-MM-dd hh:mm") }}</view>
							</view>
							<view v-if="removeFlag" class="remove-btn" @tap.stop="removeListData(data.id)">
								<image src="../../static/img/icon/icon_sub.png" mode=""></image>
							</view>
							<view v-if="data.remark" class="cell-line">{{ data.remark }}</view>
						</view>
					</u-swipe-action>
					<page-empty :total="total"></page-empty>
				</view>
			</view>
			<view v-else-if="current === 1" class="tab-main tab-1">
				<view class="btn-box flex">
					<view class="status-btn flex">
						<view :class="['btn',{'active' : queryParams.type === -1}]" @tap.stop="doQuery('cost',-1)">{{ countNum.outNum | formatCountNum('支出') }}</view>
						<view :class="['btn',{'active' : queryParams.type === 1}]" @tap.stop="doQuery('cost',1)">{{ countNum.inNum | formatCountNum('收入') }}</view>
					</view>
					<view class="tools-btn flex">
						<!-- <view class="btn delete" @tap.stop="removeFlag = !removeFlag">{{ removeFlag ? '取消' : '移除' }}</view> -->
						<view class="btn add" @tap.stop="openPopup('formPopup')">添加</view>
					</view>
				</view>
				<view class="list-warp">
					<u-swipe-action :show="Boolean(data.show)" v-for="(data,index) in dataList" :key="data.id" btn-width="120" @open="open(index)" @click="removeListData(data.id)" :options="options" :disabled="!activityInfo.isCreator && userInfo.id == activityInfo.userId">
						<view class="list-item" @tap.stop="openPopup('formPopup',data)">
							<view class="cell-line flex">
								<view class="flex-1">{{ data.remark }}</view>
								<view v-if="data.voucherUrl" class="primary-btn" @tap.stop="previewPic(data.voucherUrl)">凭证</view>
								<view :style="{ color: queryParams.type === -1 ? '#F33939' : themeColor }">{{ moneySymbol }}{{ data.amount }}</view>
							</view>
							<view class="cell-line flex">
								<view class="user-info flex flex-1">
									<view class="avatar">
										<image :src="data.picUrl" mode=""></image>
									</view>
									<view class="nickname">{{ data.nickname }}</view>
								</view>
								<view class="date-time">{{ data.createTime | formatDate("yyyy-MM-dd hh:mm") }}</view>
							</view>
							<view v-if="removeFlag" class="remove-btn" @tap.stop="removeListData(data.id)">
								<image src="../../static/img/icon/icon_sub.png" mode=""></image>
							</view>
						</view>
					</u-swipe-action>
					<page-empty :total="total"></page-empty>
				</view>
			</view>
			<view v-else-if="current === 2" class="tab-main tab-2">
				<view class="list-warp">
					<u-swipe-action :show="Boolean(data.show)" v-for="(data,index) in dataList" :key="data.id" btn-width="120" @open="open(index)" @click="removeListData(data.id)" :options="options" :disabled="!activityInfo.isCreator && userInfo.id == activityInfo.userId">
						<view class="list-item flex" @tap.stop="toSubmitAblum(data)">
							<view class="pic-url">
								<image :src="data.photoUrl" mode=""></image>
							</view>
							<view class="cell-box flex-1">
								<view class="cell-line flex">
									<view class="flex-1 bold">共{{ data.photoNum }}张</view>
									<view class="remark">{{ data.remark }}</view>
								</view>
								<view class="cell-line flex">
									<view class="user-info flex flex-1">
										<view class="avatar">
											<image :src="data.picUrl" mode=""></image>
										</view>
										<view class="nickname">{{ data.nickname }}</view>
									</view>
									<view class="date-time">{{ data.createTime | formatDate("yyyy-MM-dd hh:mm") }}</view>
								</view>
							</view>
						<!-- <view class="remove-btn">
							<image src="../../static/img/icon/icon_sub.png" mode=""></image>
						</view> -->
						</view>
					</u-swipe-action>
					<page-empty :total="total"></page-empty>
				</view>
			</view>
		</view>
		<button @tap.stop="openSharePopup" hover-class="none" class="share-btn">
			<text class="program-font icon-fenxiang"></text>
			<text class="share-text">分享</text>
		</button>
		<view class="footer font-base flex">
			<view v-if="current === 0" class="btn-group-0 flex flex-1">
				<!-- <view class="btn danger-btn">取消</view> -->
				<view :class="['btn',{ 'primary-btn' : activityInfo.attendStatus == 0 }]" @tap.stop="showAttendPopup(0)">待定</view>
				<view :class="['btn',{ 'primary-btn' : activityInfo.attendStatus == -1 }]" @tap.stop="showAttendPopup(-1)">不参加</view>
				<view :class="['btn',{ 'primary-btn' : activityInfo.attendStatus == 1 }]" @tap.stop="showAttendPopup(1)">参加</view>
			</view>		
			<view v-else-if="current === 1" class="btn-group-1 flex flex-1">
				<view class="cell-line flex">
					<view class="label">支出：</view>
					<view class="danger">{{ moneySymbol }}{{ countNum.outAmount || 0.00 }}</view>
				</view>
				<view class="cell-line flex">
					<view class="label">收入：</view>
					<view class="primary">{{ moneySymbol }}{{ countNum.inAmount || 0.00 }}</view>
				</view>
				<view class="cell-line flex">
					<view class="label">结余：</view>
					<view class="primary" :style="{ color: countNum.resetAmount < 0 ? '#F33939' : themeColor }">{{ moneySymbol }}{{ countNum.resetAmount || 0.00 }}</view>
				</view>
			</view>	
			<view v-else-if="current === 2" class="btn-group-2 flex flex-1">
				<view :class="['submit-btn',{ 'disabled': couldUpload === 0 }]" @tap.stop="toSubmitAblum()">我要上传</view>
			</view>
		</view>
		<u-popup v-model="popupVisible" mode="center" :mask-close-able="false" width="76%" height="630rpx" :border-radius="9" :closeable="true">
			<view class="attend-popup flex">
				<view class="title">操作确认</view>
				<view class="form-item flex alc">
					<view class="label">状态:</view>
					<view class="val">{{ attendParamStatusJosn[attendParams.status] }}</view>
				</view>
				<view class="form-item flex">
					<view class="label">备注:</view>
					<view class="textarea flex-1">
						<textarea v-model="attendParams.remark" placeholder="和大伙说两句~" />
					</view>
				</view>
				<view class="popup-footer">
					<view class="cancel" @tap.stop="popupVisible = false">取消</view>
					<view class="confirm" @tap.stop="attendActivity">确定</view>
				</view>
			</view>
		</u-popup>
		<u-popup v-model="costPopupVisible" mode="bottom" :safe-area-inset-bottom="true" @close="popouClose">
			<view class="costPopup-content">
				<view class="form-popup-warpper">
					<u-form :model="costParams" label-width="140" label-align="left" :label-style="{fontWeight: 'bold'}">
						<u-form-item label="收支类型:" :border-bottom="false" :required="true">
							<u-radio-group v-model="costParams.type" :active-color="themeColor">
								<u-radio :name="-1">支出</u-radio>
								<u-radio :name="1">收入</u-radio>
							</u-radio-group>
						</u-form-item>
						<u-form-item label="金额:" :border-bottom="false" :required="true">
							<view class="flex amount-input">
								<u-input v-model="costParams.amount" type="digit" placeholder="请输入金额" :border="true" :clearable="false" />
								<text>(元)</text>								
							</view>
						</u-form-item>
						<u-form-item class="textarea" label="费用说明:" :border-bottom="false" :required="true">
							<u-input v-model="costParams.remark" placeholder="请输入费用说明" :border="true" type="textarea" />
						</u-form-item>
						<u-form-item class="upload" label="凭证:" :border-bottom="false">
							<view v-if="costParams.voucherUrl" class="pic-url">
								<image :src="costParams.voucherUrl" @tap.stop="picUpload()"></image>
								<view class="remove-btn" @tap.stop="removeVoucherUrl()">
									<image src="../../static/img/icon/icon_sub.png" mode=""></image>
								</view>
							</view>
							<view v-else class="upload-item" @tap.stop="picUpload()"></view>
						</u-form-item>
					</u-form>
				</view>
				<view style="height: 10rpx;background-color: #F7F7F7;"></view>
				<view class="popup-footer flex">
					<view class="cancel flex-1" @tap.stop="costPopupVisible = false">取消</view>
					<view class="confirm flex-1" @tap.stop="addActivityCost">确定</view>
				</view>			
			</view>
		</u-popup>
		<u-popup v-model="showQrCodeMask" mode="center" :mask-close-able="false" width="76%" height="560rpx" :border-radius="9" :closeable="true">
			<view class="qrcode-popup flex">
				<view class="qrcode">
					<image :src="qrCodeUrl" mode=""></image>
				</view>
				<view class="save-btn" @tap.stop="saveImgToLocal">保存至本地</view>
			</view>
		</u-popup>
		<u-popup v-model="rechargeDialogVisiable" width="80%" height="44%" :border-radius="9" mode="center">
			<view class="popup-content">
				<view class="title">提示</view>
				<view class="content">
					<view>
						亲，解锁照片上传需要<text class="money">{{ albumAmount }}元</text>服务费,您的权益如下：
					</view>
					<view class="li">1）可以上传{{ globalConfig.photoUpNum }}张照片</view>
					<view class="li">2）相册可以让亲友浏览和下载保存</view>
				</view>
				<view class="popup-footer">
					<view class="cancel-btn" @tap.stop="rechargeDialogVisiable = false;">再考虑下</view>
					<view class="confirm-btn" @tap.stop="doUnlockAlbum">立即支付</view>
				</view>				
			</view>
		</u-popup>
		<leePopou type="bottom" ref="sharePopup" :round="true" :animation="animation" padding="0">
			<view class="p-list-item">
				<button open-type="share" class="cell-line p-item">
					发送给朋友
				</button>
				<view class="cell-line p-item" @click="openQrCodeMask()">
					生成二维码
				</view>
				<view style="height: 10rpx;background-color: #F7F7F7;"></view>
				<view class="cell-line p-item" @tap.stop="sharePopupClose('sharePopup')">
					取消
				</view>
			</view>
		</leePopou>
	</view>
</template>

<script>
import { mapGetters } from 'vuex'
import { 
		activityInfoDetail,listActivityAttend,listActivityCost,attendActivity,addActivityCost,updateActivityCost,getAttendNum,
		countAmount,listActivityAlbum,deleteActivityAttend,deleteActivityCost,deleteActivityAlbum,getActivityQrCode,
		checkUploadAlbum,doUnlockAlbum
	} from '@/api/basic.js';
import wechatAuth from "@/utils/wechatAuth";
import leePopou from '@/components/lee-popup/lee-popup';

export default{
	mixins: [wechatAuth],
	components: {
		leePopou
	},
	data(){
		return{
			id: '',
			current: 0,
			animation: false,
			showQrCodeMask: false,
			activityInfo: {},
			attendParams: {},
			attendParamStatusJosn: {
				'0': '待定',
				'1': '参加',
				'-1': '不参加'
			},
			costParams: {},
			queryParams: {
				status: 1
			},
			dataList: [],
			options: [
				 {
					text: '删除',
					style: {
						backgroundColor: '#f56c6c'
					}
				}
			],
			countNum: {},
			total: 0,
			attendId: '',
			isCreator: 0,
			isAttend: 0,
			popupVisible: false,
			costPopupVisible: false,
			rechargeDialogVisiable: false,
			removeFlag: false,
			formData: {},
			qrCodeUrl: '',
			albumAmount: 0.00, //上传服务费
			couldUpload: 0 //是否可以上传   1可以  0不可以
		}
	},
	onLoad(options) {
		uni.showLoading({ title: "加载中" })
		this.id = options.id;
		this.queryParams.activityId = this.id;
		this.sceneType = 2;
		this.bizId = this.id;
	},
	onShow() {
		this.appInitial();
	},
	computed:{
		...mapGetters(['globalConfig']),
	},
	filters: {
		formatCountNum: function(value,label) {
			return label + '(' + ~~value + ')';
		}
	},
	methods:{
		toActivityEdit(){
			this.navigateTo('/pages/activity/edit','page',`id=${ this.id }`,this.callback);
		},
		open(index) {
			// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
			// 原本为'false'，再次设置为'false'会无效
			this.dataList[index].show = true;
			this.dataList.map((val, idx) => {
				if(index != idx) this.dataList[idx].show = false;
			})
		},
		// 验证登录
		callback (data) {
			if(!data.isLogin){
				this.onGotUserInfo();
				return;
			}
			this.navigatePageTo(data.path, data.type)
		},
		appInitial(){
			let current = this.current;
			uni.showLoading({ title: '加载中' });
			this.getActivityInfoDetail();
			if(current === 0){
				this.queryParams.status = 1;
				this.$delete(this.queryParams,'type');
				this.getActivityAttendList();
				this.getAttendNum();
			}else if(current === 1){
				this.queryParams.type = -1;
				this.$delete(this.queryParams,'status');
				this.getActivityCostList();
				this.countAmount();
			}else if( current === 2 ){
				this.getActivityAlbumList();
				this.checkUploadAlbum();
			}
		},
		/**
		 * 打开定位
		 */
		openLocation(){
			let { latitude,longitude,province,city,region,address} = this.activityInfo;
			 uni.openLocation({
				latitude: Number(latitude),
				longitude: Number(longitude),
				name: `${address}`,
				address: `${province}${city}${region}${address}`,
				success: function () {}
			});
		},
		/**
		 * @param {Object} type
		 * @param {Object} id
		 */
		removeListData(id){
			
			this.$mHelper.modal("提示","是否确认删除?",true,(res)=>{
				if(res.confirm){
					if(this.current === 0){
						// 移除参与人员
						this.deleteActivityAttend(id);
					}else if(this.current === 1){
						// 移除费用
						this.deleteActivityCost(id);
					}else if(this.current === 2){
						//移除相册
						this.deleteActivityAlbum(id);
					}
				}
			});
		},
		/**
		 * 移除参与人员
		 */
		deleteActivityAttend(id){
			this.$http.post(`${deleteActivityAttend}`,{ activityId: this.id,id }).then(res => {
				this.getActivityInfoDetail();
				this.getActivityAttendList();
				this.getAttendNum();
			});
		},
		/**
		 * 移除费用
		 */
		deleteActivityCost(id){
			this.$http.post(`${deleteActivityCost}`,{ activityId: this.id,id }).then(res => {
				this.getActivityCostList();
				this.countAmount();
			});
		},
		/**
		 * 移除相册
		 */
		deleteActivityAlbum(id){
			this.$http.post(`${deleteActivityAlbum}`,{ activityId: this.id,id }).then(res => {
				this.getActivityAlbumList();
			});
		},
		/**
		 * 检查是否可以上传相册
		 */
		checkUploadAlbum(){
			return new Promise((resolve,reject)=>{
				this.$http.post(`${checkUploadAlbum}`,{ activityId: this.id }).then(res => {
					let records = res.records;
					this.albumAmount = records.albumAmount;
					this.couldUpload = records.couldUpload;
					resolve(records);
				});				
			});
		},
		/**
		 * 获取参与人员统计
		 */
		getAttendNum(){
			this.$http.post(`${getAttendNum}`,{ activityId: this.id }).then(res => {
				this.countNum = res.records;
			});
		},
		/**
		 * 获取费用统计
		 */
		countAmount(){
			this.$http.post(`${countAmount}`,{ activityId: this.id }).then(res => {
				this.countNum = res.records;
			});
		},
		/**
		 * 获取参与人员列表
		 */
		getActivityAttendList(){
			this.$http.post(`${listActivityAttend}`,this.queryParams).then(res => {
				let records = res.records;
				this.dataList = records.aaData;
				this.total = records.iTotalRecords;
				uni.hideLoading();
			});
		},
		/**
		 * 获取费用清单
		 */
		getActivityCostList(){
			this.$http.post(`${listActivityCost}`,this.queryParams).then(res => {
				let records = res.records;
				this.dataList = records.aaData;
				this.total = records.iTotalRecords;
				uni.hideLoading();
			});
		},
		/**
		 * 获取空间相册
		 */
		getActivityAlbumList(){
			this.$http.post(`${listActivityAlbum}`,{ activityId: this.id }).then(res => {
				let records = res.records;
				this.dataList = records.aaData;
				this.total = records.iTotalRecords;
				uni.hideLoading();
			});
		},
		doQuery(flag,value){
			if(flag == 'attend'){
				this.queryParams.status = value;
				this.getActivityAttendList();				
			}else if(flag == 'cost'){
				this.queryParams.type = value;
				this.getActivityCostList();
			}
		},
		handleTabClick(current){
			if(this.curren === current)return;
			this.current = current;
			if(!this.hasLogin)return;
			uni.showLoading("加载中");
			this.dataList = [];
			this.total = 0;
			if(current === 0){
				this.queryParams.status = 1;
				this.$delete(this.queryParams,'type');
				this.getActivityAttendList();
				this.getAttendNum();
			}else if(current === 1){
				this.queryParams.type = -1;
				this.$delete(this.queryParams,'status');
				this.getActivityCostList();
				this.countAmount();
			}else if( current === 2 ){
				this.getActivityAlbumList();
				this.checkUploadAlbum();
			}
		},
		/**
		 * 获取活动详情
		 */
		getActivityInfoDetail(){
			let userId = uni.getStorageSync("userInfo").id;
			this.$http.post(`${activityInfoDetail}`,{ userId,id: this.id }).then(res => {
				let activityInfo = res.records;
				activityInfo.label = activityInfo.label.split(",").filter(label=>label);
				this.activityInfo = activityInfo;
				if(this.hasLogin){
					let shareTitle = `${ this.userInfo.nickname }邀请您参加《${ activityInfo.name }》活动`;
					this.$set(this.wxshare,'path',`pages/activity/detail?id=${ activityInfo.id }`);
					this.$set(this.wxshare,'title',shareTitle);
				}
				uni.hideLoading();
			});
		},
		/**
		 * 上传空间相册
		 */
		toSubmitAblum(item){
			if( this.couldUpload === 0 && !item){
				this.rechargeDialogVisiable = true;
				return;
			}
			let params = item ? `id=${ item.id }` : `activityId=${ this.id }`;
			this.navigateTo('/pages/activity/album','page',params,this.callback);
		},
		/**
		 * 添加费用
		 */
		addActivityCost(){
			let data = this.costParams;
			if(!data.type){
				return this.$mHelper.toast("请选择收支类型");
			}else if(!data.amount){
				return this.$mHelper.toast("金额不能为空");
			}else if(!data.remark){
				return this.$mHelper.toast("费用说明不能为空");
			}
			uni.showLoading({title: '加载中'});
			let url = data.id ? updateActivityCost : addActivityCost;

			this.$http.post(`${url}`,data).then(res => {
				uni.hideLoading();
				this.costParams = {};
				this.costPopupVisible = false;
				this.getActivityCostList();
				this.countAmount();
				this.$mHelper.toast("提交成功");
				
			});
		},
		/**
		 * 人员报名
		 */
		attendActivity(){
			let data = this.attendParams;
			uni.showLoading({title: '加载中'});
			this.$http.post(`${attendActivity}`,data).then(res => {
				uni.hideLoading();
				this.attendParams = {};
				this.popupVisible = false;
				this.getActivityInfoDetail();
				this.getActivityAttendList();
				this.getAttendNum();
			});
		},
		/**
		 * 支付解锁表单功能
		 */
		doUnlockAlbum(){
			uni.showLoading({ title: "加载中" });
			this.$http.post(`${doUnlockAlbum}`,{ activityId	: this.id }).then(res=>{
				//唤起微信支付
				let data = { payData: res.records };
				this.$mPayment.$mpPayment(data).then(()=>{
					this.successPayInter();
				}).catch(()=>{
					uni.hideLoading();
					this.$mHelper.toast("取消支付");
				});
			}).catch();
		},
		/**
		 * 支付成功轮询
		 */
		successPayInter(){
			var queryCount = 0;
			var interval = setInterval(async ()=>{
				//轮询三次清除定时器
				if( ++queryCount >= 3 ){
					clearInterval(interval);
					uni.hideLoading();
				}
				let res = await this.checkUploadAlbum();
				if( this.couldUpload === 1){
					clearInterval(interval);
					uni.hideLoading();
					this.$mHelper.toast("支付成功");
					this.rechargeDialogVisiable = false;
					this.toSubmitAblum();
				}
			}, 1000);
		},
		// 图片上传
		picUpload(){
			uni.showLoading({title: '加载中'});
			this.$utils.uploadFile().then((res)=>{
				this.$set(this.costParams,'voucherUrl',res);
				uni.hideLoading();
			}).catch(()=>{
				uni.hideLoading();
			});
		},
		removeVoucherUrl(){
			this.$set(this.costParams,'voucherUrl','');
		},
		showAttendPopup(status){
			if(!this.hasLogin){
				this.onGotUserInfo();
				return;
			}
			this.popupVisible = true;
			this.attendParams.activityId = this.id;
			this.attendParams.status = status;
			setTimeout(() => {
				this.$set(this.attendParams,'remark','');
			}, 50);
		},
		openPopup(ref,data){
			if(!this.hasLogin){
				this.onGotUserInfo();
				return;
			}
			if(data){
				let userId = uni.getStorageSync("userInfo").id;
				if( data.isCreator || data.userId == userId ){
					this.costParams = Object.assign({},this.costParams,data);
				}else{
					return;
				}
			}else{
				this.costParams.activityId = this.id;
				this.$set(this.costParams,'remark','');				
			}
			this.costPopupVisible = true;
		},
		openSharePopup(){
			this.animation = true;
			this.$refs.sharePopup.open();
		},
		sharePopupClose(){
			this.$refs.sharePopup.close();
		},
		// 关闭
		popouClose(){
			this.costPopupVisible = false;
		},
		saveImgToLocal(){
			this.$utils.saveImgToLocal(this.qrCodeUrl);
		},
		openQrCodeMask(){
			uni.showLoading({ title: "加载中" })
			this.$http.post(`${getActivityQrCode}`,{ id: this.id }).then(res => {
				this.qrCodeUrl = res.records;
				this.showQrCodeMask = true;
				uni.hideLoading();
			}).catch(()=>{});
		},
		previewPic(url){
			uni.previewImage({
				urls : [url]
			})
		}
	}
}
</script>
<style>
	page{
		background: #F6F7FB;
	}
</style>
<style lang="scss" scoped>
	.app-container{
		padding: 20upx;
		image{
			width: 100%;
			height: 100%;
		}
		.title-warp{
			align-items: center;
			.form-title{
				font-size: 44upx;
				font-weight: bold;
				color: #333333;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.edit-btn{
				background: $base-color;
				font-size: $base-color;
				color: #FFFFFF;
				height: 50upx;
				line-height: 50upx;
				padding: 0 20upx;
				border-radius: 9upx;
				margin-left: 10upx;
			}
		}
		.user-info{
			align-items: center;
			.avatar{
				width: 40upx;
				height: 40upx;
				image{
					border-radius: 99%;
				}
			}
			.nickname{
				color: #666666;
				margin-left: 10upx;
			}
		}
		.icon{
			width: 32upx;
			height: 32upx;
		}
		.tag-list{
			margin: 20upx 0;
			.tag-item{
				background: rgba(60, 195, 147, 0.2);
				box-sizing: content-box;
				color: $base-color;
				height: 38upx;
				line-height: 38upx;
				padding: 0 10upx;
				opacity: 0.7;
				border: 2upx solid $base-color;
				border-radius: 6upx;
				margin-right: 26upx;
			}
		}
		.main-item{
			border: 2upx solid rgba(238, 238, 238, 0.4);
			border-radius: 20upx;
			padding: 26upx;
			background: #FFFFFF;
			.mb10{
				margin-bottom: 20upx;
			}
			.cell-line{
				.form-item{
					.cell-flex{
						margin-bottom: 6upx;
						.label{
							margin-left: 20upx;
						}
					}
					.value{
						color: #999999;
						margin-left: 50upx;
					}
				}
			}
		}
		.active-main{
			margin-top: 30upx;
			padding-bottom: 120upx;
			.tabs{
				padding: 0 36upx;
				background: #FFFFFF;
				color: #161B30;
				font-size: $font-secondary;
				height: 100upx;
				line-height: 100upx;
				.tab-pane{
					margin-right: 30upx;
				}
				.active{
					font-weight: bold;
					font-size: 36upx;
					position: relative;
					&::after{
						content: '';
						position: absolute;
						background-image: url(../../static/img/icon/tab_active_line.png);
						background-size: 100% 100%;
						width: 30px;
						bottom: 4px;
						left: 50%;
						height: 10px;
						transform: translateX(-50%);
					}
				}
			}
			.tab-main{
				.btn-box{
					justify-content: space-between;
					margin: 20upx 0;
					.btn{
						padding: 0 30upx;
						height: 46upx;
						line-height: 46upx;
						font-weight: bold;
						background: #f4f4f5;
						border: 2upx solid #e9e9eb;
						color: #909399;
						font-size: $font-secondary;
						box-sizing: content-box;
						border-radius: 24upx;
						margin-right: 24upx;
						&:last-child{
							margin-right: 0;
						}
					}
					.status-btn{
						.active{
							background: rgba(60, 195, 147, 0.2);
							border: 2upx solid $base-color;
							color: $base-color;
						}
						.btn{
							font-weight: normal;
						}
					}
					.tools-btn{
						font-weight: bold;
						.delete{
							background: #EDEDED;
							border-color: #EDEDED;
							color: #F33939;
						}
						.add{
							background: #3CC292;
							border-color: #3CC292;
							color: #FFFFFF;
						}
					}
				}
				.list-warp{
					/deep/ .u-swipe-action{
						background-color: inherit !important;
						margin-bottom: 20upx;
					}
					.list-item{
						border: 2upx solid rgba(238, 238, 238, 0.4);
						border-radius: 9upx;
						position: relative;
						background: #FFFFFF;
						.cell-line{
							align-items: center;
							padding: 24upx;
							.nickname{
								color: #333333;
							}
							.date-time{
								color: #666666;
							}
						}
						.remove-btn{
							position: absolute;	
							width: 50upx;
							height: 50upx;
							top: -12upx;
							right: 0;
						}
					}
				}
				&.tab-0{
					.cell-line{
						&:nth-child(2){
							padding-left: 40upx;
							color: #999999;
							font-size: $font-secondary;
							border-top: 2upx solid rgba(153, 153, 153, 0.2);
						}
					}
				}
				&.tab-1{
					.cell-line{
						&:first-child{
							border-bottom: 2upx solid rgba(153, 153, 153, 0.2);
						}				
						.primary-btn{
							padding: 0 20rpx;
							height: 40rpx;
							line-height: 40rpx;
							background: #f4f4f5;
							border: 2upx solid #e9e9eb;
							color: #909399;
							font-size: $font-secondary;
							box-sizing: content-box;
							border-radius: 24upx;
							margin-right: 10upx;
							background: rgba(60, 195, 147, 0.2);
							border: 2upx solid $base-color;
							color: $base-color;
						}
					}
				}
				&.tab-2{
					margin-top: 20upx;
					.list-item{
						align-items: center;
						padding: 20upx 0;
						.pic-url{
							width: 100upx;
							height: 100upx;
							margin: 0 24upx;
							image{
								border-radius: 10upx;
							}
						}
						.cell-line{
							padding: 10upx;
							&:first-child{
								border-bottom: 2upx solid rgba(153, 153, 153, 0.2);
							}
							.bold{
								font-weight: bold;
							}
						}
						.remark{
							color: #999999;
							font-weight: bold;
							font-size: $font-sm;
						}
					}
				}
			}
		}
		.share-btn{
			position: fixed;
			bottom: calc(80px + env(safe-area-inset-bottom)); /*兼容 IOS>11.2*/
			right: 20upx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			text-align: center;
			background-color: $base-color;
			color: #FFFFFF;
			border-radius: 99%;
			width: 88upx;
			height: 88upx;
			margin: 0;
			padding: 0;				
			line-height: inherit;
			.share-text{
				display: block;
				font-size: $font-sm;
			}
		}
		button{
			border: none;
			background: none;
			font-size: inherit;
			&::after{
				border: none;
			}
		}
		.attend-popup{
			flex-direction: column;
			height: inherit;
			padding: 40upx;
			position: relative;
			.title{
				text-align: center;
			}
			.form-item{
				margin: 20upx 0;
				&.alc{
					align-items: center;
				}
				.label{
					color: #000000;
					font-weight: bold;
					font-size: $font-lg;
					margin-right: 20upx;
				}
				textarea{
					border: 2upx solid #EEEEEE;
					padding: 20upx;
					height: 280upx;
					background: #efefef;
					border-radius: 19upx;
					width: auto;
				}
				.val{
					color: $base-color;
					font-size: 36upx;
					font-weight: bold;
				}
			}
			.popup-footer{
				margin: 10upx 0;
				display: flex;
				justify-content: space-around;
				.cancel,.confirm{
					border-radius: 49upx;
					height: 70upx;
					line-height: 70upx;
					text-align: center;
					width: 33%;
					font-weight: bold;
				}
				.cancel{
					background: #f2f2f2;
					color: $base-color;
				}				
				.confirm{
					background: $base-color;
					color: #FFFFFF;
				}
			}
		}
		.footer{
			height: 120upx;
			align-items: center;
			padding: 0 20upx;
			position: fixed;
			background: #FFFFFF;
			left: 0;
			right: 0;
			bottom: 0;
			align-items: center;
			.btn-group-0{
				justify-content: space-around;
				font-weight: bold;
				.btn{
					background: #f2f2f2;
					color: $base-color;
					height: 60upx;
					line-height: 60upx;
					padding: 0 46upx;
					border-radius: 49upx;
				}
				.danger-btn{
					color: #F33939;
				}
				.primary-btn{
					background: $base-color;
					color: #FFFFFF;
				}
			}
			.btn-group-1{
				justify-content: space-between;
				.cell-line{
					font-weight: bold;
					align-items: center;
					.danger{
						font-size: 36upx;
						color: #F33939;
					}
					.primary{
						font-size: 36upx;
						color: $base-color;
					}
				}
			}
			.btn-group-2{
				justify-content: center;
				.submit-btn{
					background: $base-color;
					width: 60%;
					text-align: center;
					font-weight: bold;
					color: #FFFFFF;
					height: 80rpx;
					line-height: 80rpx;
					padding: 0 46rpx;
					border-radius: 49rpx;
				}
				.disabled{
					background: #FE893B;
					color: #FFFFFF;
				}
			}
		}
		.qrcode-popup{
			flex-direction: column;
			align-items: center;
			height: inherit;
			position: relative;
			.qrcode{
				width: 360upx;
				height: 360upx;
				margin: 50upx 0 40upx;
			}		
			.save-btn{
				background: $base-color;
				border-radius: 49upx;
				color: #FFFFFF;
				height: 60upx;
				line-height: 60upx;
				width: 50%;
				text-align: center;
			}
		}
		.costPopup-content{
			.form-popup-warpper{
				padding-left: 40upx;
				.pic-url,.upload-item{
					position: relative;
					width: 160upx;
					height: 160upx;
					margin-right: 20upx;
				}
				.remove-btn{
					position: absolute;	
					width: 50upx;
					height: 50upx;
					top: -26upx;
					right: -16upx;
				}
				.upload-item{
					background-image: url(../../static/img/icon/form_upload01.png);
					background-size: 100% 100%;
					position: relative;
					&::after{
						content: "上传图片";
						position: absolute;
						color: #a8a8a8;
						font-size: 20upx;
						left: 0;
						right: 0;
						bottom: 0;
						text-align: center;
					}
				}
				/deep/ .amount-input{
					text{
						margin-left: 20upx;
					}
				}
				/deep/ .textarea{
					.u-input{
						width: 90%;
					}
				}
				/deep/ .upload,/deep/ .textarea{
					.u-form-item__body{
						align-items: flex-start;
					}
				}
			}
			.popup-footer{
				height: 100upx;
				line-height: 100upx;
				font-weight: bold;
				font-size: $font-lg;
				.cancel{
					color: #999999;
					text-align: center;
					position: relative;
					&::after{
						content: '';
						position: absolute;
						top: 50%;
						bottom: 0;
						right: 0;
						height: 50%;
						transform: translateY(-50%);
						border-right: 2upx solid #CCC;
					}
				}
				.confirm{
					color: $base-color;
					text-align: center;
				}
			}
		}
		.p-list-item{
			font-size: $font-lg;
			.p-item{
				text-align: center;
				height: 90upx;
				line-height: 90upx;
				.service-btn{
					width: 100%;
				}
			}
			
			:first-child{
				line-height: 90upx;
				text-align: center;
				margin: 0;
			}
			:not(:last-child){
				    border-bottom: 2rpx solid #f7f7f7;
			}
		}
	}
</style>
