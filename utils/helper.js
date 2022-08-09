/* eslint-disable */
import mRouter from '@/utils/router';
import mConstDataConfig from '@/config/constData.config';
import mStore from '@/store';
import appShare from '@/utils/share';
// #ifdef H5
import jweixin from '@/common/jweixin';
import $mPayment from '@/utils/payment';
// #endif
import {http} from '@/utils/request/service';
import {advView} from '@/api/basic';
import console from "@dcloudio/uni-h5/src/core/helpers/console";
//常用方法集合
export default {

	//获取某值在数组中的索引值
	getOptionIndex(arr,value){
		let idx = null;
		for (let i = 0; i < arr.length; i++) {
			let o = arr[i];
			if(o.value === value){
				idx = i;
				break;
			}
		}
		return idx;
	},
	//获取复选框处理后的值
	setCheckboxOption(arr,value){
		let dbArr = value.split(",");
		for (let i = 0; i < arr.length; i++) {
			let o = arr[i];
			if(dbArr.indexOf(o.value) > -1){
				arr[i].checked = true;
			}
		}
		return arr;
	},
	//获取某值在抽屉（右侧）弹出框数据中的索引值
	getDrawerIndex(arr,value){
		let idx = null;
		for (let i = 0; i < arr.length; i++) {
			let o = arr[i];
			if(o.value === value){
				idx = i;
				break;
			}
		}
		return idx;
	},

	/**
	 * toast提示
	 */
	toast(title, duration = 3000, mask = false, icon = 'none') {
		if (Boolean(title) === false) {
			return;
		}
		uni.showToast({
			title,
			duration,
			mask,
			icon
		});
	},
	/*获取平台类型 */
	getNaviBarHeight() {
		let height = '90rpx';
		// #ifdef MP
		let device = uni.getSystemInfoSync();
		console.log(device)
		if (device.system.indexOf('iOS') > -1) {
			if (device.model.indexOf('iPhone X') > -1) {
				height = '44px;margin-top: 25px;padding-bottom: 5px;';
			} else {
				height = '44px';
			}
		} else {
			height = '48px';
		}
		// #endif
		console.log(height)
		return height;
	},
	rightNav(route) {
		if (!route) return;
		if (!mStore.getters.hasLogin) {
			console.log(this.hasLogin)
			uni.removeStorageSync('backToPage');
			mRouter.push({route: '/pages/public/logintype'});
		} else {
			mRouter.push({route});
		}
	},
	/**
	 * 返回登录页面，弹出确认提示框
	 */
	async goToLogin() {
		uni.showModal({
			content: '您未登录或会话已过期，是否跳转登录页面？',
			success: confirmRes => {
				if (confirmRes.confirm) {
					this.backToLogin();
				}
			}
		});
	},
	/**
	 * 返回登录页面
	 */
	async backToLogin() {
		console.log('logout1')
		// 存当前页面的地址
		const currentPage = getCurrentPages()[getCurrentPages().length - 1];
		const params = {};
		// #ifdef H5
		params.route = `/${currentPage.$vm.route}`;
		params.query = currentPage.$vm.$mp && currentPage.$vm.$mp.query;
		// #endif
		// #ifdef MP
		params.route = `/${currentPage.$vm.__route__}`;
		params.query = currentPage.$vm.$mp && currentPage.$vm.$mp.query;
		// #endif
		// #ifdef APP-PLUS
		params.route = `/${currentPage.route}`;
		params.query = currentPage.options;
		// #endif
		uni.setStorageSync('backToPage', JSON.stringify(params));
		uni.removeTabBarBadge({index: mConstDataConfig.cartIndex});
		uni.removeTabBarBadge({index: mConstDataConfig.notifyIndex});
		await mStore.commit('logout');
		mRouter.push({route: '/pages/public/logintype'});
	},
	/**
	 * 返回上一页携带参数
	 */
	prePage(index) {
		let pages = getCurrentPages();
		let prePage = pages[pages.length - (index || 2)];
		// #ifdef H5
		return prePage;
		// #endif
		return prePage.$vm;
	},
	/**
	 * 开发环境全局打印日志
	 * @param {Object} title
	 */
	log(title) {
		if (process.env.NODE_ENV === 'development' && Boolean(title) === true) {
			console.log(JSON.stringify(title));
		}
	},
	/**
	 * 异步获取设备信息
	 */
	getInfoAsync() {
		return new Promise((resolve, reject) => {
			plus.device.getInfo({
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e.message);
				}
			});
		});
	},
	/**
	 * 安卓10不支持IMEI,则获取OAID
	 */
	getOaidAsync() {
		return new Promise((resolve, reject) => {
			plus.device.getOAID({
				success(e) {
					resolve(e);
				},
				fail(e) {
					reject(e.message);
				}
			});
		});
	},
	/**
	 * 获取一个随机数
	 * @param {Object} min
	 * @param {Object} max
	 */
	random(min, max) {
		switch (arguments.length) {
			case 1:
				return parseInt(Math.random() * min + 1, 10);
				break;
			case 2:
				return parseInt(Math.random() * (max - min + 1) + min, 10);
				break;
			default:
				return 0;
				break;
		}
	},
	/**
	 * 获取ios的IDFA
	 */
	getIdfa() {
		let idfa = '';
		try {
			if ('iOS' == plus.os.name) {
				let manager = plus.ios.invoke('ASIdentifierManager', 'sharedManager');
				if (plus.ios.invoke(manager, 'isAdvertisingTrackingEnabled')) {
					let identifier = plus.ios.invoke(manager, 'advertisingIdentifier');
					idfa = plus.ios.invoke(identifier, 'UUIDString');
					plus.ios.deleteObject(identifier);
				}
				plus.ios.deleteObject(manager);
			}
		} catch (e) {
			console.error('获取idfa失败');
		}
		return idfa;
	},
	/*
	 * obj 转 params字符串参数
	 * 例子：{a:1,b:2} => a=1&b=2
	 */
	objParseParam(obj) {
		let paramsStr = '';
		if (obj instanceof Array) return paramsStr;
		if (!(obj instanceof Object)) return paramsStr;
		for (let key in obj) {
			paramsStr += `${key}=${obj[key]}&`;
		}
		return paramsStr.substring(0, paramsStr.length - 1);
	},
	/*
	 * obj 转 路由地址带参数
	 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
	 */
	objParseUrlAndParam(path, obj) {
		let url = path || '/';
		let paramsStr = '';
		if (obj instanceof Array) return url;
		if (!(obj instanceof Object)) return url;
		paramsStr = this.objParseParam(obj);
		paramsStr && (url += '?');
		url += paramsStr;
		return url;
	},
	/*
	 * 获取url字符串参数
	 */
	getRequestParameters(locationhref) {
		let href = locationhref || '';
		let theRequest = new Object();
		let str = href.split('?')[1];
		if (str != undefined) {
			let strs = str.split('&');
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split('=')[0]] = strs[i].split('=')[1];
			}
		}
		return theRequest;
	},
	/**
	 * 加密字符串
	 */
	strEncode(str) {
		const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let l = key.length;
		let a = key.split('');
		let s = '',
			b,
			b1,
			b2,
			b3;
		for (let i = 0; i < str.length; i++) {
			b = str.charCodeAt(i);
			b1 = b % l;
			b = (b - b1) / l;
			b2 = b % l;
			b = (b - b2) / l;
			b3 = b % l;
			s += a[b3] + a[b2] + a[b1];
		}
		return s;
	},
	/**
	 * 解密字符串
	 */
	strDecode(str) {
		const key = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let l = key.length;
		let b,
			b1,
			b2,
			b3,
			d = 0,
			s;
		s = new Array(Math.floor(str.length / 3));
		b = s.length;
		for (let i = 0; i < b; i++) {
			b1 = key.indexOf(str.charAt(d));
			d++;
			b2 = key.indexOf(str.charAt(d));
			d++;
			b3 = key.indexOf(str.charAt(d));
			d++;
			s[i] = b1 * l * l + b2 * l + b3;
		}
		b = eval('String.fromCharCode(' + s.join(',') + ')');
		return b;
	},
	/**
	 * 比较版本号
	 */
	compareVersion(reqV, curV) {
		if (curV && reqV) {
			let arr1 = curV.split('.'),
				arr2 = reqV.split('.');
			let minLength = Math.min(arr1.length, arr2.length),
				position = 0,
				diff = 0;
			while (
				position < minLength &&
				(diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0
				) {
				position++;
			}
			diff = diff != 0 ? diff : arr1.length - arr2.length;
			if (diff > 0) {
				if (position == minLength - 1) {
					return 1;
				} else {
					return 2;
				}
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	},
	/**
	 * H5复制
	 */
	h5Copy(content) {
		let textarea = document.createElement('textarea');
		textarea.value = content;
		textarea.readOnly = 'readOnly';
		document.body.appendChild(textarea);
		textarea.select(); // 选择对象
		textarea.setSelectionRange(0, content.length); //核心
		let result = document.execCommand('Copy'); // 执行浏览器复制命令
		textarea.remove();
		const msg = result ? '复制成功' : '复制失败';
		this.toast(msg);
	},
	/**
	 * app分享
	 */
	handleAppShare(shareUrl, shareTitle, shareContent, shareImg) {
		let shareData = {
			shareUrl,
			shareTitle,
			shareContent,
			shareImg
		};
		appShare(shareData, res => {
		});
	},

	async handleWxH5Share(title, desc, link, imgUrl) {
		// #ifdef H5
		if ($mPayment.isWechat()) {
			if (uni.getSystemInfoSync().platform === 'android') {
				await $mPayment.wxConfigH5(link);
			}
			jweixin.ready(function () {
				// eslint-disable-next-line
				jweixin.updateAppMessageShareData({
					title, // 分享标题
					desc, // 分享描述
					link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl, // 分享图标
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
				// eslint-disable-next-line
				jweixin.updateTimelineShareData({
					title, // 分享标题
					desc, // 分享描述
					link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
					imgUrl, // 分享图标
					success: function () {
						// 用户确认分享后执行的回调函数
					},
					cancel: function () {
						// 用户取消分享后执行的回调函数
					}
				});
			});
		}
		// #endif
	},

	// 去掉字符串中的空格
	trim(str) {
		if (!str) {
			return '';
		}
		return str.replace(/\s*/g, '');
	},

	// 判断两个对象是否相同
	isObjectValueEqual(x, y) {
		// 指向同一内存时
		if (x === y) {
			return true;
		} else if (
			typeof x == 'object' &&
			x != null &&
			typeof y == 'object' && y != null
		) {
			if (Object.keys(x).length != Object.keys(y).length) return false;

			for (var prop in x) {
				if (y.hasOwnProperty(prop)) {
					if (!this.isObjectValueEqual(x[prop], y[prop])) return false;
				} else return false;
			}

			return true;
		} else return false;
	},

	platformGroupFilter() {
		let platformGroup = 'tinyShop';
		// #ifdef H5
		if ($mPayment.isWechat()) {
			platformGroup = 'tinyShopWechat';
		} else {
			platformGroup = 'tinyShopH5';
		}
		// #endif
		// #ifdef MP-QQ
		platformGroup = 'tinyShopQqMp';
		// #endif
		// #ifdef MP-WEIXIN
		platformGroup = 'tinyShopWechatMp';
		// #endif
		// #ifdef MP-ALIPAY
		platformGroup = 'tinyShopAliMp';
		// #endif
		// #ifdef MP-QQ
		platformGroup = 'tinyShopQqMp';
		// #endif
		// #ifdef MP-BAIDU
		platformGroup = 'tinyShopBaiduMp';
		// #endif
		// #ifdef APP-PLUS
		switch (uni.getSystemInfoSync().platform) {
			case 'android':
				platformGroup = 'tinyShopAndroid';
				break;
			case 'ios':
				platformGroup = 'tinyShopIos';
				break;
		}
		// #endif
		return platformGroup;
	},

	// 广告图跳转封装
	handleBannerNavTo(data, id, advId) {
		let url;
		http.get(advView, {params:{id: advId}});
		switch (data) {
			case 'notify_announce_view': // 公告详情
				url = `/pages/index/notice/detail?id=${id}`;
				break;
			case 'product_view': // 产品详情
				url = `/pages/product/product?id=${id}`;
				break;
			case 'combination_view': // 某分类下产品列表
				url = `/pages/marketing/combination/list?id=${id}`;
				break;
			case 'coupon_view': // 优惠券详情
				url = `/pages/user/coupon/detail?id=${id}`;
				break;
			case 'helper_view': // 站点帮助详情
				url = '/pages/set/helper/index';
				break;
			case 'bargain_list': // 砍价列表
				url = '/pages/marketing/bargain/list';
				break;
			case 'discount_list': // 限时折扣
				url = '/pages/marketing/discount/list';
				break;
			case 'group_buy_list': // 团购列表
				url = '/pages/marketing/group/list';
				break;
			case 'wholesale_list': // 拼团列表
				url = '/pages/marketing/wholesale/list';
				break;
			case 'product_list_for_cate': // 某分类下产品列表
				url = `/pages/product/list?cate_id=${id}`;
				break;
			case 'mini_program_live_view': // 跳转至带货直播间
				// #ifdef MP-WEIXIN
				url = `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${[id]}`;
				// #endif
				// #ifndef MP-WEIXIN
				this.toast('请从微信小程序进入直播间');
				// #endif
				break;
			default:
				break;
		}
		if (url) {
			mRouter.push({route: url});
		}
	},

	formatDate(year,month,day) {
		var monthTmp = month + 1 < 10 ? '0' + month : month
		var dayTmp = day < 10 ? '0' + day : day
		return year + '-' + monthTmp + '-' + dayTmp
	},
	/**
	 * 保存系统配置，一般在index进行，以保证系统配置的及时性
	 * @param data
	 */
	saveSysConfig(data){
		uni.setStorageSync('sysConfg', JSON.stringify(data));
	},
	/**
	 * 获取系统参数配置
	 * @param key
	 * @returns {*}
	 */
	getSysConfg(key){
		let data = uni.getStorageSync('sysConfg');
		let conf = JSON.parse(data);
		return conf[key];
	}

};
