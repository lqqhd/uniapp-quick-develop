export default {
	// app应用名称
	appName: '工程找活儿',

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

	defaultUserPic: '基础款',
	// 顶部导航菜单
	menuTop: [
		{
			icon: 'iconxiaoxi1',
			text: '消息',
			urlType: 'tab',
		//	url: '/pages/notify/notify'
			url: '/pages/cart/cartbak'
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
	// 首页导航
	markingList: [
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_cz.png', url: '/pages/chuzu/list', title: '出租', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_qiuzu.png', url: '/pages/qiuzu/list', title: '求租', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_qz.png', url: '/pages/qiuzhi/list', title: '求职', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_zp.png', url: '/pages/zhaopin/list', title: '招聘', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_db.png', url: '/pages/tiban/list', title: '帮帮替班', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_bbesj.png', url: '/pages/usedcar/tablist', title: '帮帮二手机', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_fcb.png', url: '/pages/sendcar/list', title: '帮帮发车', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_tc.png', url: '/pages/tuoche/tuoche/list', title: '拖车', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_yc.png', url: '/pages/yongche/yongche/list', title: '用车', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_jyc.png', url: '/pages/jiayouche/order/add', title: '加油车', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_sc.png', url: '/pages/category/category', title: '配件商城', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_wxc.png', url: '/pages/repair/shop/list', title: '维修厂', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_wxsf.png', url: '/pages/repair/worker/list', title: '维修师傅', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_lt.png', url: '/pages/article/list', title: '论坛交流', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/c_gd.png', url: '/pages/category/more', title: '更多', color: '#ff6b81'},
	],
	// 首页子导航
	subMenuList: [
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/sm/s_yjxq.png', url: '/pages/xuqiu/xuqiu/add', title: '提交用机需求', color: '#0DD3D710'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/sm/s_xjxj.png', url: '/pages/xunjia/xunjia/add', title: '新机询价入口', color: '#E05EE610'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/sm/s_sbpx.png', url: '/pages/peixun/peixun/add', title: '设备培训入口', color: '#21AAF610'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/sm/s_jrdk.png', url: 'more', title: '金融贷款', color: '#5B93E810'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/sm/s_bxfw.png', url: 'more', title: '保险服务', color: '#C4507B10'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/sm/s_bbyh.png', url: 'more', title: '帮帮云盒', color: '#2792C210'}
	],
	// 发布页面导航
		publishList: [
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/p_wymc.png', url: '', title: '我要卖车', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/p_wycz.png', url: '/pages/chuzu/add', title: '我要出租', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/p_wyzp.png', url: '/pages/qiuzu/add', title: '我要租赁', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/p_wyqz.png', url: '/pages/qiuzhi/add', title: '我要求职', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/p_wyzhaopin.png', url: '/pages/zhaopin/add', title: '我要招聘', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/p_zptb.png', url: '/pages/tiban/add', title: '招聘替班', color: '#ff6b81'}
	],
	//首页热门机型
	hotList: [
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/hot/hot_wjj.png', url: '4', title: '挖掘机', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/hot/hot_ttj.png', url: '36', title: '推土机', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/hot/hot_zzj.png', url: '22', title: '装载机', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/hot/hot_ylj.png', url: '5', title: '压路机', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/hot/hot_qzj.png', url: '30', title: '起重机', color: '#ff6b81'},
		{icon: 'https://yzimg.jikebang.com/gczh/imgs/hot/hot_fjgz.png', url: '5063', title: '附件工装', color: '#ff6b81'},
	],
	// 个人中心-设置中心菜单 e07472 ff4757 ff6b81
	settingList: [
		{icon: 'iconziliaoguanli', url: '/pages/user/mypublish/index', title: '我的发布', color: '#ff6b81'},
		{icon: 'icongonggao', url: '/pages/index/notice/notice', title: '商城公告', color: '#ff6b81'},
		{icon: 'iconyouhuiquan-copy', url: '/pages/user/coupon/list', title: '领券中心', color: '#ff6b81'},
		{icon: 'icondizhi1', url: '/pages/user/address/address', title: '地址管理', color: '#ff6b81'},
		{icon: 'iconshoucang3', url: '/pages/user/collection/collection', title: '我的收藏', color: '#ff6b81'},
		{icon: 'iconfenxiang', url: '', title: '分享', color: '#ff6b81'},
		{icon: 'iconzhibo', url: '/pages/marketing/live/list', title: '直播', color: '#ff6b81'},
		{icon: 'iconshezhi3', url: '/pages/set/set', title: '设置', color: '#ff6b81'}
	],

	// 设置-设置中心
	setList: [
		{
			title: '个人资料',
			url: '/pages/user/userinfo/userinfo',
			content: ''
		},
		{
			title: '修改密码',
			url: '/pages/public/password?type=1',
			content: ''
		},
		{
			title: '支付设置',
			url: '/pages/set/pay/setPassword?type=1',
			content: ''
		},
		{
			title: '发票管理',
			url: '/pages/set/invoice/invoice',
			content: '',
			class: 'mT'
		},
		{title: '开票历史', url: '/pages/set/invoice/list', content: ''},
		{title: '清除缓存', url: 'clearCache', content: ''},
		{
			title: '关于工程找活儿',
			url: '/pages/set/about/about',
			content: '',
			class: 'mT'
		},
		{
			title: '站点帮助',
			url: '/pages/set/helper/index',
			content: ''
		},
		{
			title: '文章列表',
			url: '/pages/set/article/index',
			content: ''
		},
		/*  #ifdef APP-PLUS  */
		{title: '检查更新', url: 'versionUpgrade', content: ''},
		/*  #endif  */
		{title: '意见反馈', url: '/pages/set/feedback/list', content: ''}
	],

	//卖车流程
	flowSectionList: [
		{
			title: '提交信息',
			icon: 'iconfont iconquanbudingdan',
			url: '/pages/order/order?state=0',
			num: 1
		},
		{
			title: '平台评估',
			icon: 'iconfont iconshouye',
			url: '/pages/order/order?state=1',
			num: 1
		},
		{
			title: '买卖撮合',
			icon: 'iconfont iconwodetuandui',
			url: '/pages/order/order?state=2',
			num: 1
		},
		{
			title: '立领车款',
			icon: 'iconfont icontixianzhanghao',
			url: '/pages/order/order?state=3',
			num: 0
		}
	],

	//发车流程
	sendcarSectionList: [
		{
			title: '平台看车',
			icon: 'iconfont icondizhi1',
			url: '/pages/order/order?state=0',
			num: 1
		},
		{
			title: '联系平台',
			icon: 'iconfont icondianhua',
			url: '/pages/order/order?state=1',
			num: 1
		},
		{
			title: '车况说明',
			icon: 'iconfont iconxiaoxi2',
			url: '/pages/order/order?state=2',
			num: 1
		},
		{
			title: '确定价格',
			icon: 'iconfont icontixianzhanghao',
			url: '/pages/order/order?state=3',
			num: 1
		},
		{
			title: '物流到家',
			icon: 'iconfont iconquyuguanli',
			url: '/pages/order/order?state=3',
			num: 1
		},
		{
			title: '验收提车',
			icon: 'iconfont iconyiwancheng',
			url: '/pages/order/order?state=3',
			num: 0
		}

	],

	//二手车流程
	usedcarSectionList: [
		{
			title: '电话咨询专家答疑',
			icon: 'iconfont icondianhua',
			url: '/pages/order/order?state=0',
			num: 1
		},
		{
			title: '平台带看现场试车',
			icon: 'iconfont iconyiwancheng',
			url: '/pages/order/order?state=1',
			num: 1
		},
		{
			title: '确定价格签订协议',
			icon: 'iconfont iconxiaoxi2',
			url: '/pages/order/order?state=2',
			num: 1
		},
		{
			title: '交易完成后续服务',
			icon: 'iconfont iconquyuguanli',
			url: '/pages/order/order?state=3',
			num: 0
		}

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

	// 个人中心-积分余额
	amountList: [
		{title: '余额', value: 0, url: '/pages/user/account/account'},
		{title: '优惠券', value: 0, url: '/pages/user/coupon/coupon?type=1'},
		{title: '积分', value: 0, url: '/pages/user/account/integral'}
	],


	// 订单状态
	orderStatus: [
		{key: 1, value: '待付款'},
		{key: 2, value: '待发货'},
		{key: 3, value: '待收货'},
		{key: 4, value: '已完成'},
		{key: 5, value: '取消订单'},
		{key: 6, value: '退款通过'},
		{key: 7, value: '退货通过'},
	],
	// /** 订单类型 0 普通订单 1 定金预售订单 2全款预售订单 3 拼团订单 4 众筹全款 5 众筹1元 6 众筹无回报 7 虚拟商品订单 8 社区团购订单 默认0 普通订单 */
	orderType: [
		{key: 0, value: '普通订单'},
		{key: 1, value: '定金预售订单'},
		{key: 2, value: '全款预售订单'},
		{key: 3, value: '拼团订单'},
		{key: 4, value: '众筹全款'},
		{key: 5, value: '众筹1元 '},
		{key: 6, value: '众筹无回报'},
		{key: 7, value: '虚拟商品订单'},
		{key: 8, value: '社区团购订单'},

	],
	// 订单退货状态
	refundStatus: [
		{key: 1, value: '退款申请'},
		{key: 2, value: '等待退货'},
		{key: 3, value: '等待确认收货'},
		{key: 4, value: '等待确认退款'},
		{key: 5, value: '已退款'},
		{key: -1, value: '退款已拒绝'},
		{key: -2, value: '退款已关闭'},
		{key: -3, value: '退款不通过'}
	],

	// 订单评价状态
	evaluateStatus: [
		{key: 0, value: '未评价'},
		{key: 1, value: '已评价'},
		{key: 2, value: '已追评'}
	],

	// 订单状态导航
	orderNavList: [
		{state: undefined, text: '全部'},
		{state: 1, text: '待付款'},
		{state: 2, text: '待发货'},
		{state: 3, text: '待收货'},
		{state: 6, text: '评价'}
	],

	// 营销类型 1 直降 2 满赠 3抢购 4满减 5 满折 6 包邮 7 定金预售 8 全款预售 9 试用 10拼团 11 众筹
	marketingType: [
		{key: 1, value: '直降'},
		{key: 2, value: '满赠'},
		{key: 3, value: '抢购'},
		{key: 4, value: '满减'},
		{key: 5, value: '满折'},
		{key: 6, value: '包邮'},
		{key: 7, value: '定金预售'},
		{key: 8, value: '全款预售'},
		{key: 9, value: '试用'},
		{key: 10, value: '拼团'},
		{key: 11, value: '众筹'},
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
			url: '/pages/zhaopin/list',
			icon: 'https://yzimg.jikebang.com/gczh/imgs/qk_zxzp.png',
			title: '最新招聘',
			desc: '淘到理想好物'
		},
		{
			url: '/pages/tiban/list',
			icon: 'https://yzimg.jikebang.com/gczh/imgs/qk_dbxx.png',
			title: '代班信息',
			desc: '发现品质好物'
		},
		{
			url: '/pages/qiuzu/list',
			icon: 'https://yzimg.jikebang.com/gczh/imgs/qk_zupin.png',
			title: '最新租貧',
			desc: '抢到就是赚到'
		},
		{
			url: '',
			icon: 'https://yzimg.jikebang.com/gczh/imgs/qk_jxesj.png',
			title: '精选二手机',
			desc: '淘到理想好物'
		},
		{
			url: '/pages/category/category',
			icon: 'https://yzimg.jikebang.com/gczh/imgs/qk_djjl.png',
			title: '低价捡漏',
			desc: '发现品质好物'
		},
		{
			url: '',
			icon: 'https://yzimg.jikebang.com/gczh/imgs/qk_grzxsb.png',
			title: '个人最新设备',
			desc: '抢到就是赚到'
		},
		{
			url: '/pages/user/signin/index',
			icon: 'https://yzimg.jikebang.com/gczh/imgs/qiandao.png',
			title: '每日签到',
			desc: '抢到就是赚到'
		}
	],

	// 消息类型 1:公告;2:提醒;3:私信
	notifyTypeList: [
		{type: 0, content: ''},
		{type: 1, content: '公告'},
		{type: 2, content: '提醒'},
		{type: 3, content: '私信'}
	],

	// 主题列表
	themeList: [
		{
			title: '官方',
			name: 'rf',
			color: '#fa436a',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-rf.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-rf.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-rf.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-rf.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-rf.png'
			]
		},
		{
			title: '嫣红',
			name: 'red',
			color: '#e54d42',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-red.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-red.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-red.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-red.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-red.png'
			]
		},
		{
			title: '桔橙',
			name: 'orange',
			color: '#f37b1d',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-orange.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-orange.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-orange.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-orange.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-orange.png'
			]
		},
		{
			title: '明黄',
			name: 'yellow',
			color: '#fbbd08',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-yellow.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-yellow.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-yellow.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-yellow.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-yellow.png'
			]
		},
		{
			title: '橄榄',
			name: 'olive',
			color: '#8dc63f',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-olive.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-olive.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-olive.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-olive.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-olive.png'
			]
		},
		{
			title: '森绿',
			name: 'green',
			color: '#39b54a',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-green.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-green.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-green.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-green.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-green.png'
			]
		},
		{
			title: '天青',
			name: 'cyan',
			color: '#1cbbb4',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-cyan.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-cyan.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-cyan.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-cyan.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-cyan.png'
			]
		},
		{
			title: '海蓝',
			name: 'blue',
			color: '#0081ff',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-blue.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-blue.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-blue.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-blue.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-blue.png'
			]
		},
		{
			title: '姹紫',
			name: 'purple',
			color: '#6739b6',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-purple.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-purple.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-purple.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-purple.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-purple.png'
			]
		},
		{
			title: '木槿',
			name: 'mauve',
			color: '#9c26b0',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-mauve.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-mauve.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-mauve.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-mauve.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-mauve.png'
			]
		},
		{
			title: '桃粉',
			name: 'pink',
			color: '#e03997',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-pink.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-pink.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-pink.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-pink.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-pink.png'
			]
		},
		{
			title: '棕褐',
			name: 'brown',
			color: '#a5673f',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-brown.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-brown.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-brown.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-brown.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-brown.png'
			]
		},
		{
			title: '玄灰',
			name: 'grey',
			color: '#8799a3',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-grey.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-grey.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-grey.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-grey.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-grey.png'
			]
		},
		{
			title: '草灰',
			name: 'gray',
			color: '#aaaaaa',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-gray.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-gray.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-gray.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-gray.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-gray.png'
			]
		},
		{
			title: '墨黑',
			name: 'black',
			color: '#333333',
			tabList: [
				'https://yzimg.jikebang.com/gczh/imgs/tab-home-black.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cate-black.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-notify-black.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-cart-black.png',
				'https://yzimg.jikebang.com/gczh/imgs/tab-my-black.png'
			]
		}
	]
};
