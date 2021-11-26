export default {
	// app应用名称
	appName: 'name',

	// 购物车在tab的位置
	cartIndex: 3,

	// 消息在tab的位置
	notifyIndex: 2,

	// 验证码发送间隔
	sendCodeTime: 60,

	// 金额符号
	moneySymbol: '￥',

	// 单商品替代词
	singleSkuText: '基础款',
	// 路由白名单
	whiteList: [
		'/pages/index/index', // 首页
		'/pages/subnews/detail', // 新闻详情
		'/pages/product/groupbuy', // 团购
		'/pages/course/index',     // 课程
		'/pages/suborder/detail',  //
		'/pages/suborder/verifyEdit',  //用户提交审核资料
		'/pages/search/index',     // 搜索页
		'/pages/mall/order/detail', //商家端订单详情
		'/pages/mall/memberList', //商家端会员列表
		'/pages/mall/acount/balance', //商家端账户明细
		'/pages/mall/acount/rebate', //商家端待处理返利列表
		'/pages/mall/order/verify',
		'/pages/acount/about/index', //新手指南
		'/pages/mall/activity/index', //商家端活动管理
		'/pages/mall/activity/add', //商家端活动编辑
		'/pages/mall/acount/recharge' //商家端账户充值
	],
	// Api接口白名单
	needUserIdApiList: [
		'store/StoreInfo/add',
		'store/StoreActivity/userSignUp',
		'store/StoreRecharge/doRecharge',
		'mall/MallOrder/getList',
		'mall/MallOrder/doCancel',
		'mall/MallOrder/getProfitList',
		'app/AppUserWithdrawal/getList',
		'app/AppUserFeedback/add',
		'app/AppUserWithdrawal/doApply',
		'app/AppUser/getQrCode',
		'app/AppUser/getMiniPhone',
		'store/StoreInfo/getAuditList',
		'store/StoreInfo/doAudit'
	],
	// 顶部导航菜单
	menuTop: [
		{
			icon: 'iconxiaoxi1',
			text: '消息',
			urlType: 'tab',
			url: '/pages/notify/notify'
		},
		{
			icon: 'iconzhuyedefuben',
			text: '首页',
			urlType: 'tab',
			url: '/pages/index/index'
		},
		{
			icon: 'iconwode-',
			text: '我的',
			urlType: 'tab',
			url: '/pages/profile/profile'
		},
			{
			icon: 'icongouwuche2',
			text: '购物车',
			urlType: 'tab',
			url: '/pages/cart/cart'
		},
		{
			icon: 'iconbianji',
			text: '我要反馈',
			url: '/pages/set/feedback/feedback'
		},
		{
			icon: 'iconquanbudingdan',
			text: '我的订单',
			url: '/pages/order/order?state=-1'
		}
	],
	withDrawState: ['已取消','待审核','待转账','已完成','审核不通过'],
	courseState: ['已下架','未开始','进行中','已结束'],
	// 课程状态
	 stateConfigList: ['未开始', '火热报名中', '已结束'],
	 // 优惠券
	 couState: ['', '未使用', '已使用','已过期'],
	// 个人中心卡片
	acountCard:[{
		title: '年卡',
		icon: 'https://bucket-mohuan.oss-cn-beijing.aliyuncs.com/static/wap/2020/08262325/bank-icon@2x.png',
		url: '/pages/acount/subcard/index'
	}, {
		title: '优惠券',
		icon: 'https://bucket-mohuan.oss-cn-beijing.aliyuncs.com/static/wap/2020/08262325/coupin%402x.png',
		url: '/pages/acount/coupon/index'
	}, {
		title: '余额',
		icon: 'https://bucket-mohuan.oss-cn-beijing.aliyuncs.com/static/wap/2020/08262325/money%402x.png',
		url: '/pages/acount/balance/index'
	}],
	// 个人中心-设置中心菜单
	settingList: [
		{ icon: 'icongonggao', url: '/pages/index/notice/notice', title: '商城公告', color: '#ff6b81' },
		{ icon: 'iconyouhuiquan-copy', url: '/pages/user/coupon/list', title: '领券中心', color: '#ff6b81' },
		{ icon: 'icondizhi1', url: '/pages/user/address/address', title: '地址管理', color: '#ff6b81' },
		{ icon: 'iconshoucang3', url: '/pages/user/collection/collection', title: '我的收藏', color: '#ff6b81' },
		{ icon: 'iconfenxiang', url: '', title: '分享', color: '#ff6b81' },
		{ icon: 'iconfenxiang', url: '/pages/activity/lottery/index', title: '抽奖', color: '#ff6b81' },
		{ icon: 'iconshezhi3', url: '/pages/set/set', title: '设置', color: '#ff6b81' }
	],
	// 支付类型
	paymentType: ['', '余额支付', '年卡支付', '微信支付', '微信支付+余额支付'],
	// 设置-设置中心
	setList: [
		{
			title: '我的行程',
			url: '/pages/acount/mytrip/index',
			content: '',
			icon: 'https://bucket-mohuan.oss-cn-beijing.aliyuncs.com/static/wap/2020/08262325/xingcheng@2x.png'
		},
		{
			title: '年卡',
			url: '/pages/mall/cardList',
			content: '',
			icon: 'https://bucket-mohuan.oss-cn-beijing.aliyuncs.com/static/wap/2020/08262325/cika@2x.png'
		},
		// {
		// 	title: '支付差价',
		// 	url: '/pages/acount/paydiffe/index',
		// 	content: '',
		// 	icon: 'https://bucket-mohuan.oss-cn-beijing.aliyuncs.com/static/wap/2020/08262325/yifukuan@2x.png'
		// },
		// {
		// 	title: '我的收货地址',
		// 	url: '/pages/acount/address/index',
		// 	content: '',
		// 	icon: 'https://bucket-mohuan.oss-cn-beijing.aliyuncs.com/static/wap/2020/08262325/address@2x.png'
		// },
		{ title: '我的团购',
		 url: '/pages/acount/teambuy/index',
		 content: '',
		 icon: 'https://bucket-mohuan.oss-cn-beijing.aliyuncs.com/static/wap/2020/08262325/shop@2x.png'
		},
		{
			title: '关于我们',
			url: '/pages/acount/about/index',
			content: '',
			icon: 'https://bucket-mohuan.oss-cn-beijing.aliyuncs.com/static/wap/2020/08262325/about@2x.png'
		},
		/*  #ifdef APP-PLUS  */
		{ title: '检查更新', url: 'versionUpgrade', content: '' },
		/*  #endif  */
		{ title: '意见反馈',
		 url: '/pages/acount/feedback/index',
			content: '',
			icon: 'https://bucket-mohuan.oss-cn-beijing.aliyuncs.com/static/wap/2020/08262325/fankui@2x.png'
		 }
	],
	verifyMemberMame: [
		'/pages/acount/subcard/index',
		 '/pages/acount/coupon/index',
		 '/pages/acount/balance/index',
		 '/pages/suborder/list',
		 '/pages/acount/setting/index',
		 '/pages/acount/mytrip/index',
		 '/pages/acount/teambuy/index'
		],
	// 个人中心-我的订单
	orderSectionList: [
		{
			title: '待付款',
			icon: 'iconfont icondaifukuan',
			url: '/pages/order/order?state=0',
			num: null
		},
		{
			title: '待发货',
			icon: 'iconfont iconshouye',
			url: '/pages/order/order?state=1',
			num: null
		},
		{
			title: '待收货',
			icon: 'iconfont iconyishouhuo',
			url: '/pages/order/order?state=2',
			num: null
		},
		{
			title: '评价',
			icon: 'iconfont iconpingjia',
			url: '/pages/order/order?state=3',
			num: null
		},
		{
			title: '退款/售后',
			icon: 'iconfont iconshouhoutuikuan',
			url: '/pages/order/refund',
			num: null
		}
	],
	orderState: ['已取消', '待付款', '报名成功', '已完成', '退款中', '已退款', '已过期', "已部分退款"],
	// 推广中心
	distributionList: [
		{ title: '累计拥金', value: 0.00, url: '/pages/distribution/brokerage/detail' },
		{ title: '当前拥金', value: 0.00, url: '/pages/distribution/brokerage/brokerage' },
		{ title: '已提现拥金', value: 0.00, url: '/pages/distribution/cash/list' }
	],
	// 拥金模块
	brokerageList: [
		{ title: '累计拥金', value: 0.00, url: '' },
		{ title: '当前拥金', value: 0.00, url: '' },
		{ title: '销售笔数', value: 0, url: '' },
		{ title: '销售金额', value: 0.00, url: '' }
	],
	// 推广我的版块
	distrtributionMeMenu: [
			{ title: '自推订单', icon: 'iconfont iconzituidingdan', value: 0.00, url: '/pages/distribution/order/myorder' },
			{ title: '分销订单', icon: 'iconfont icontuanduidingdan', value: 0.00, url: '/pages/distribution/order/distribution' },
			{ title: '提现帐号', icon: 'iconfont icontixianzhanghao', value: 0, url: '/pages/distribution/bankcard/list' },
			{ title: '推广二维码', icon: 'iconfont iconerweima', value: 0.00, url: '/pages/distribution/spread/qrcode' }
		],
	// 推广拥金区块
	distributionMenu: [
			{ title: '我的拥金', icon: 'iconfont iconzituidingdan', value: 0.00, url: '/pages/distribution/brokerage/detail?state=0' },
			{ title: '进行中拥金', icon: 'iconfont iconjinhangzhongdeyongjin', value: 0.00, url: '/pages/distribution/brokerage/detail?state=1' },
			{ title: '我要提现', icon: 'iconfont iconwoyaotixian', value: 0, url: '/pages/distribution/cash/cash' },
			{ title: '提现记录', icon: 'iconfont icontixianjilu', value: 0.00, url: '/pages/distribution/cash/list' }
		],
	// 个人中心-积分余额
	amountList: [
		{ title: '余额', value: 0, url: '/pages/user/account/account' },
		{ title: '优惠券', value: 0, url: '/pages/user/coupon/coupon?type=1' },
		{ title: '积分', value: 0, url: '/pages/user/account/integral' }
	],

	// 订单状态
	orderStatus: [
		{ key: 0, value: '待付款' },
		{ key: 1, value: '待发货' },
		{ key: 2, value: '已发货' },
		{ key: 3, value: '已收货' },
		{ key: 4, value: '已完成' },
		{ key: -1, value: '退货申请' },
		{ key: -2, value: '退款中' },
		{ key: -3, value: '退款完成' },
		{ key: -4, value: '已关闭' },
		{ key: -5, value: '撤销申请' },
		{ key: 101, value: '待成团' },
		{ key: 201, value: '备货中' },
		{ key: 202, value: '待付尾款' }
	],

	// 订单退货状态
	refundStatus: [
		{ key: 1, value: '退款申请' },
		{ key: 2, value: '等待退货' },
		{ key: 3, value: '等待确认收货' },
		{ key: 4, value: '等待确认退款' },
		{ key: 5, value: '已退款' },
		{ key: -1, value: '退款已拒绝' },
		{ key: -2, value: '退款已关闭' },
		{ key: -3, value: '退款不通过' }
	],

	// 订单评价状态
	evaluateStatus: [
		{ key: 0, value: '未评价' },
		{ key: 1, value: '已评价' },
		{ key: 2, value: '已追评' }
	],

	// 订单状态导航
	orderNavList: [
		{ state: undefined, text: '全部' },
		{ state: 0, text: '待付款' },
		{ state: 1, text: '待发货' },
		{ state: 2, text: '待收货' },
		{ state: 3, text: '评价' }
	],

	// 直播记录列表
	liveTypeList: [
		{
			state: 101,
			text: '进行中'
		},
		{
			state: 102,
			text: '未开始'
		},
		{
			state: 103,
			text: '已结束'
		}
	],

	// 收货地址/自提点
	addressTypeList: [
		{
			state: 1,
			text: '选择物流配送'
		},
		{
			state: 2,
			text: '选择自提配送'
		}
	],

	// 热门推荐
	hotRecommendList: [
		{
			url: '/pages/marketing/bargain/list',
			icon: '/static/kj.png',
			title: '我要砍价',
			desc: '淘到理想好物'
		},
		{
			url: '/pages/marketing/group/list',
			icon: '/static/tg.png',
			title: '团购专区',
			desc: '发现品质好物'
		},
		{
			url: '/pages/marketing/discount/list',
			icon: '/static/zk.png',
			title: '限时折扣',
			desc: '抢到就是赚到'
		}
	],

  // 消息类型 1:公告;2:提醒;3:私信
  notifyTypeList: [
    { type: 0, content: '' },
    { type: 1, content: '公告' },
    { type: 2, content: '提醒' },
    { type: 3, content: '私信' }
  ],

	// 主题列表
	themeList: [
				{
					title: '官方',
					name: '默认',
					color: '#fa436a',
					tabList: [
						'/static/tab-home-rf.png',
						'/static/tab-cate-rf.png',
						'/static/tab-cart-rf.png',
						'/static/tab-my-rf.png'
					]
				},
				{
					title: '嫣红',
					name: 'red',
					color: '#e54d42',
					tabList: [
						'/static/tab-home-red.png',
						'/static/tab-cate-red.png',
						'/static/tab-cart-red.png',
						'/static/tab-my-red.png'
					]
				},
				{
					title: '桔橙',
					name: 'orange',
					color: '#f37b1d',
					tabList: [
						'/static/tab-home-orange.png',
						'/static/tab-cate-orange.png',
						'/static/tab-cart-orange.png',
						'/static/tab-my-orange.png'
					]
				},
				{
					title: '明黄',
					name: 'yellow',
					color: '#fbbd08',
					tabList: [
						'/static/tab-home-yellow.png',
						'/static/tab-cate-yellow.png',
						'/static/tab-cart-yellow.png',
						'/static/tab-my-yellow.png'
					]
				},
				{
					title: '橄榄',
					name: 'olive',
					color: '#8dc63f',
					tabList: [
						'/static/tab-home-olive.png',
						'/static/tab-cate-olive.png',
						'/static/tab-cart-olive.png',
						'/static/tab-my-olive.png'
					]
				},
				{
					title: '森绿',
					name: 'green',
					color: '#39b54a',
					tabList: [
						'/static/tab-home-green.png',
						'/static/tab-cate-green.png',
						'/static/tab-cart-green.png',
						'/static/tab-my-green.png'
					]
				},
				{
					title: '天青',
					name: 'cyan',
					color: '#1cbbb4',
					tabList: [
						'/static/tab-home-cyan.png',
						'/static/tab-cate-cyan.png',
						'/static/tab-cart-cyan.png',
						'/static/tab-my-cyan.png'
					]
				},
				{
					title: '海蓝',
					name: 'blue',
					color: '#0081ff',
					tabList: [
						'/static/tab-home-blue.png',
						'/static/tab-cate-blue.png',
						'/static/tab-cart-blue.png',
						'/static/tab-my-blue.png'
					]
				},
				{
					title: '姹紫',
					name: 'purple',
					color: '#6739b6',
					tabList: [
						'/static/tab-home-purple.png',
						'/static/tab-cate-purple.png',
						'/static/tab-cart-purple.png',
						'/static/tab-my-purple.png'
					]
				},
				{
					title: '木槿',
					name: 'mauve',
					color: '#9c26b0',
					tabList: [
						'/static/tab-home-mauve.png',
						'/static/tab-cate-mauve.png',
						'/static/tab-cart-mauve.png',
						'/static/tab-my-mauve.png'
					]
				},
				{
					title: '桃粉',
					name: 'pink',
					color: '#e03997',
					tabList: [
						'/static/tab-home-pink.png',
						'/static/tab-cate-pink.png',
						'/static/tab-cart-pink.png',
						'/static/tab-my-pink.png'
					]
				},
				{
					title: '棕褐',
					name: 'brown',
					color: '#a5673f',
					tabList: [
						'/static/tab-home-brown.png',
						'/static/tab-cate-brown.png',
						'/static/tab-cart-brown.png',
						'/static/tab-my-brown.png'
					]
				},
				{
					title: '玄灰',
					name: 'grey',
					color: '#8799a3',
					tabList: [
						'/static/tab-home-grey.png',
						'/static/tab-cate-grey.png',
						'/static/tab-cart-grey.png',
						'/static/tab-my-grey.png'
					]
				},
				{
					title: '草灰',
					name: 'gray',
					color: '#aaaaaa',
					tabList: [
						'/static/tab-home-gray.png',
						'/static/tab-cate-gray.png',
						'/static/tab-cart-gray.png',
						'/static/tab-my-gray.png'
					]
				},
				{
					title: '墨黑',
					name: 'black',
					color: '#333333',
					tabList: [
						'/static/tab-home-black.png',
						'/static/tab-cate-black.png',
						'/static/tab-cart-black.png',
						'/static/tab-my-black.png'
					]
				}
			]
};
