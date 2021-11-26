/**
 * @description: api列表
 * @param {*}
 * @return {*}
 */

//小程序配置
const mallConfig = 'mall/MallConfig/getOne'

//获取分享标题和封面图
const getShareInfo = 'app/AppUser/getShareInfo'

//首页轮播图列表
const listAdvertisement = 'mall/MallAdvertisement/getAllList'

//获取首页表单列表
const listForm = 'form/FormInfo/getFormList'

//表单详情
const formDetail = 'form/FormInfo/getDetail'

//创建表单
const addForm = 'form/FormInfo/toAdd'

//修改表单内容
const updateForm = 'form/FormInfo/toUpdate'

//提交表单填写内容
const addFormAttend = 'form/FormAttend/toAdd'

//修改表单填写内容
const updateFormAttend = 'form/FormAttend/toUpdate'

//查看填写的表单内容
const formAttendDetail = 'form/FormAttend/getOne'

//提交用户反馈
const addUserFeedback = 'app/AppUserFeedback/add'

//图片上传
const UPLOAD_FILE = 'file/upload?fileType=1'

//用户支付解锁表单功能
const doUnlockForm = 'form/FormInfo/doUnlock'

//解锁活动相册功能
const doUnlockAlbum = 'activity/ActivityAlbum/doUnlock'

//获取表单Excel下载链接
const getExcelUrl = 'form/FormInfo/getExcelUrl'

//获取表单小程序二维码链接
const getQrCodeUrl = 'form/FormInfo/getQrCodeUrl'

// 活动部分
// 发起人创建活动
const addActivityInfo = 'activity/ActivityInfo/toAdd'

//首页活动列表
const listActivityInfo = 'activity/ActivityInfo/getActivityList'

//活动详情
const activityInfoDetail = 'activity/ActivityInfo/getDetail'

//修改活动
const updateActivityInfo = 'activity/ActivityInfo/toUpdate'

//获取参与人员列表
const listActivityAttend = 'activity/ActivityAttend/getList'

//人员报名
const attendActivity = 'activity/ActivityAttend/toAttend'

//移除参与人员
const deleteActivityAttend = 'activity/ActivityAttend/toDelete'

//获取人员统计
const getAttendNum = 'activity/ActivityAttend/countNum'

//获取费用清单
const listActivityCost = 'activity/ActivityCost/getList'

//添加费用
const addActivityCost = 'activity/ActivityCost/toAdd'

//移除费用
const deleteActivityCost = 'activity/ActivityCost/toDelete'

//修改费用
const updateActivityCost = 'activity/ActivityCost/toUpdate'

//获取费用统计
const countAmount = 'activity/ActivityCost/countAmount'

//获取活动相册列表
const listActivityAlbum = 'activity/ActivityAlbum/getList'

//获取相册详情
const getActivityAlbumDetail = 'activity/ActivityAlbum/getDetail'

//添加相册
const addActivityAlbum = 'activity/ActivityAlbum/toAdd'

//移除相册
const deleteActivityAlbum = 'activity/ActivityAlbum/toDelete'

//修改相册
const updateActivityAlbum = 'activity/ActivityAlbum/toUpdate'

//获取活动二维码
const getActivityQrCode = 'activity/ActivityInfo/getQrCodeUrl'

//检测是否可以上传相册
const checkUploadAlbum = 'activity/ActivityAlbum/checkUpload'

export{
	mallConfig,
	getShareInfo,
	listAdvertisement,
	listForm,
	formDetail,
	addForm,
	updateForm,
	addFormAttend,
	updateFormAttend,
	formAttendDetail,
	addUserFeedback,
	UPLOAD_FILE,
	doUnlockForm,
	doUnlockAlbum,
	getExcelUrl,
	getQrCodeUrl,
	addActivityInfo,
	listActivityInfo,
	activityInfoDetail,
	updateActivityInfo,
	listActivityAttend,
	attendActivity,
	deleteActivityAttend,
	getAttendNum,
	listActivityCost,
	addActivityCost,
	deleteActivityCost,
	updateActivityCost,
	countAmount,
	listActivityAlbum,
	getActivityAlbumDetail,
	addActivityAlbum,
	deleteActivityAlbum,
	updateActivityAlbum,
	getActivityQrCode,
	checkUploadAlbum
}