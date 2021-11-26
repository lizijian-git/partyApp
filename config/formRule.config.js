/*
 * 应用表单校验相关配置
 * 依赖：graceChecker.js 进行校验
 *
 * 使用：引入该js到页面，let res = graceChecker.check({phoneNo:"",code:""},formRule.loginRule)
 */

export default {
		
	/* 提交商家入驻表单 */
	appStoreRule: [
	{
		name: 'name',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '店铺名称不能为空'
	}, {
		name: 'platformType',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '请选择活动平台'
	}, {
		name: 'platformType',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '请定位店铺位置'
	}, {
		name: 'contacts',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '联系人不能为空'
	}, {
		name: 'contactPhone',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '手机号不能为空'
	}, {
		name: 'contactPhone',
		checkType: 'phoneno',
		checkRule: '',
		errorMsg: '手机号格式不正确'
	}, {
		name: 'logoUrl',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '请上传店铺logo'
	},
	{
		name: 'codeUrl',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '请上传店铺二维码'
	}
	],
	
	//活动编辑
	activityRule: [
		{
			name: 'startTime',
			checkType: 'notnull',
			checkRule: '',
			errorMsg: '请选择开始时间'
		},
		{
			name: 'endTime',
			checkType: 'notnull',
			checkRule: '',
			errorMsg: '请选择结束时间'
		},
		{
			name: 'allNum',
			checkType: 'notnull',
			checkRule: '',
			errorMsg: '请输入参与数量'
		},
		{
			name: 'rebateAmount',
			checkType: 'notnull',
			checkRule: '',
			errorMsg: '请输入返利红包金额'
		}
	],
	
	/* 用户密码登录 */
	loginByPassRule: [{
		name: 'mobile',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '手机号不能为空'
	}, {
		name: 'mobile',
		checkType: 'phoneno',
		checkRule: '',
		errorMsg: '手机号格式不正确'
	}, {
		name: 'password',
		checkType: 'string',
		checkRule: '6,18',
		errorMsg: '请输入6-18位密码'
	}],

	/* 用户验证码登录 */
	loginByCodeRule: [{
		name: 'mobile',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '手机号不能为空'
	}, {
		name: 'mobile',
		checkType: 'phoneno',
		checkRule: '',
		errorMsg: '手机号格式不正确'
	}, {
		name: 'code',
		checkType: 'string',
		checkRule: '4',
		errorMsg: '请输入4位验证码'
	}],

	/* 发送验证码验证手机号 */
	sendCodeRule: [{
		name: 'mobile',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '手机号不能为空'
	}, {
		name: 'mobile',
		checkType: 'phoneno',
		checkRule: '',
		errorMsg: '手机号格式不正确'
	}],

	/* 编辑新增个人发票 */
	pInvoiceRule: [{
		name: 'title',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '发票抬头不能为空'
	}],

	/* 编辑新增公司发票 */
	cInvoiceRule: [{
		name: 'title',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '发票抬头不能为空'
	}, {
		name: 'duty_paragraph',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '发票税号不能为空'
	}],

	/* 用户注册 */
	registerRule: [{
		name: 'mobile',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '手机号不能为空'
	}, {
			name: 'mobile',
			checkType: 'phoneno',
			checkRule: '',
			errorMsg: '手机号格式不正确'
		}, {
			name: 'code',
			checkType: 'string',
			checkRule: '4',
			errorMsg: '请输入4位验证码'
		}, {
			name: 'password',
			checkType: 'string',
			checkRule: '6,18',
			errorMsg: '请输入6-18位密码'
		}
	],

	/* 密码重置 */
	resetPasswordRule: [{
		name: 'mobile',
		checkType: 'notnull',
		checkRule: '',
		errorMsg: '手机号不能为空'
	}, {
			name: 'mobile',
			checkType: 'phoneno',
			checkRule: '',
			errorMsg: '手机号格式不正确'
		}, {
			name: 'code',
			checkType: 'string',
			checkRule: '4',
			errorMsg: '请输入4位验证码'
		}, {
			name: 'password',
			checkType: 'string',
			checkRule: '6,18',
			errorMsg: '请输入6-18位密码'
		}
	]
};
