/* eslint-disable */
// #ifdef H5
import {
// 支付宝h5支付
	toaliwappay,
// 获取微信公众号支付
	wechatofficialaccountpayparm,
// 获取微信H5支付参数
	wechath5payparm,
} from '@/api/basic';
import jweixin from '@/common/jweixin';
// #endif
import {
	querybaseinfoset,
	//APP支付宝支付
	aliPay,
// 支付宝pc支付
	toalipagepay,
// 获取微信小程序支付
	wechatappletpay,
// APP微信支付
	wxpay
} from '@/api/basic';
import {isBindingCheck} from '@/api/login';
import {http} from '@/utils/request/service';
import mHelper from '@/utils/helper';
import mRouter from '@/utils/router';
import {toprepay,} from '@/api/product';
import console from "@dcloudio/uni-h5/src/core/helpers/console";

export default {
	// 判断是否公众号（微信H5）
	isWechat() {
		// #ifdef H5
		const ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
		// #endif
	},

	// wxjssdk
	async wxConfigH5(url) {
		if (this.isWechat()) {
			const jsApiList = JSON.stringify([
				'chooseWXPay',
				'scanQRCode',
				'updateAppMessageShareData',
				'updateTimelineShareData'
			]);
			await http
				.post(`${wechatConfig}`, {
					url: url,
					jsApiList, // 需要调用微信的原生方法
					debug: true // 是否打开调试
				})
				.then(r => {
					jweixin.config({
						...r
					});
				});
		}
	},
	checkWXJSBridge(data) {
		let that = this
		let interval = setInterval(() => {
			if (typeof window.WeixinJSBridge != 'undefined') {
				clearTimeout(interval)
				that.onBridgeReady(data)
			}
		}, 200)
	},
	onBridgeReady(data) {
		console.log(data)
		var _this = this
		window.WeixinJSBridge.invoke(
			'getBrandWCPayRequest', {
				appId: data.appId, // 公众号名称，由商户传入
				timeStamp: data.timeStamp, // 时间戳，自1970年以来的秒数
				nonceStr: data.nonceStr, // 随机串
				package: data.package,
				signType: data.signType, // 微信签名方式：
				paySign: data.paySign // 微信签名
			},
			function (res) {
				if (res.err_msg === 'get_brand_wcpay_request:ok') {
					_this.$common.successToShow('支付成功')
				} else if (res.err_msg === 'get_brand_wcpay_request:cancel') {
					_this.$common.errorToShow('取消支付')
				} else {
					_this.$common.errorToShow('支付失败')
				}
				setTimeout(() => {
					_this.$common.redirectTo(
						'/pages/order/payment/result?id=' + data.payment_id
					)
				}, 1000)
			}
		)
	},
	/*
	 *@des 微信支付
	 *
	 *@param order_group 订单:order;充值:recharge;
	 *@param data 订单 {“order_id”:199} 充值 {“money”:100};
	 */
	async weixinPay(order_group, data, route = '/pages/user/money/success', code) {
		// console.log("payment.js中开始发起支付...")
		// #ifdef H5
		//	if (!this.isWechat()) {//TODO
		//	mHelper.toast('仅支持微信H5、微信小程序、APP支付');
		//return;
		//}
		// #endif
		let url = '';
		// #ifdef H5
		if (this.isWechat()) {//TODO
			url = `${wechatofficialaccountpayparm}`;
		} else {
			url = `${wechath5payparm}`;
		}
		// #endif
		// #ifdef APP-PLUS
		url = `${wxpay}`;
		// #endif
		// #ifdef MP-WEIXIN
		url = `${wechatappletpay}`;
		// #endif

		// #ifdef MP-QQ
		mHelper.toast('QQ小程序暂不支持充值');
		return;
		// #endif
		// #ifdef APP-PLUS
		await http.get(url, {params:data}).then(r => {
				// console.log("从服务器端获取的微信订单信息："+JSON.stringify(r.data))
			//data返回参数
			//{
			//	appid: "wxd5cdb23fa8a8a8a4"
			//	noncestr: "ElHzMeZUqs676yRK"
			//	package: "Sign=WXPay"
			//	partnerid: "1601210852"
			//	prepayid: "wx271544341817098433edb8b12397d20000"
			//	sign: "5E26B16FE8B6995D333F09A44A5C7EC3"
			//	timestamp: "1603784674"
			//}

				uni.requestPayment({
					provider: 'wxpay', // 微信支付
					timeStamp: r.data.time_stamp,
					nonceStr:r.data.nonce_str,
					package:r.data.package_,
					signType:r.data.sign_type,
					paySign:r.data.pay_sign,
					success: function () {
						mHelper.toast('支付成功');
						mRouter.redirectTo({route});
					},
					fail: function (err) {
						console.log('err', err);
						mHelper.toast('支付已取消');
					}
				});
			});
		// #endif
		// #ifndef APP-PLUS
		await http
			.post(`${querybaseinfoset}`, {
				// #ifdef H5
				oauth_client: 'wechat',
				// #endif
				// #ifdef MP-WEIXIN
				oauth_client: 'wechatMp'
				// #endif
			})
			.then(async res => {
				if (true) {
					// console.log("非APP发起的支付："+JSON.stringify(data))
					//if (res.data.openid) {
					await http
						.get(url, {
							params: {
								order_group,
								pay_type: 1,
								// #ifdef H5
								trade_type: 'js',
								// #endif
								// #ifdef MP-WEIXIN
								trade_type: 'mini_program',
								// #endif
								orderCode: data.orderCode,
								orderId: data.orderId,
								orderType: data.orderType,
								type: data.type,
								//	openid: res.data.openid
							}
						})
						.then(r => {
							// #ifdef H5
							location.href = r.data.mwebUrl
							jweixin.ready(() => {
								console.log(r.data.mwebUrl)
								location.href = r.data.mwebUrl
								jweixin.chooseWXPay({
									...r.data.mwebUrl,
									success() {
										mHelper.toast('支付成功');
										mRouter.redirectTo({route});
									},
									fail(res) {
										// 支付成功后的回调函数
										mHelper.toast('支付已取消');
									}
								});
							});
							// #endif
							// #ifdef MP-WEIXIN
							// console.log("发起微信小程序支付1，结果："+JSON.stringify(r))
							if (r.flag === -10) {
								mHelper.toast('请绑定微信');
								mRouter.push({
									route: '/pages/public/auth'
								});
								return false;
								//	let authUrl='/pages/public/auth';
								//	mRouter.redirectTo({ authUrl });
								//	this.$mRouter.redirectTo({ route });
							}
							uni.requestPayment({
								provider: 'wxpay', // 微信支付
								timeStamp: r.data.time_stamp,
								nonceStr:r.data.nonce_str,
								package:r.data.package_,
								signType:r.data.sign_type,
								paySign:r.data.pay_sign,
								success: () => {
									mHelper.toast('支付成功');
									mRouter.redirectTo({route});
								},
								fail: res => {
									mHelper.toast('支付已取消');
								},
								complete: () => {
								}
							});
							// #endif
						});
				} else {
					// #ifdef MP-WEIXIN
					console.log("发起微信小程序支付2。。。")
					uni.login({
						provider: 'weixin',
						success: function (loginRes) {
							http
								.post(url + `?code=${loginRes.code}`, {
									order_group,
									pay_type: 1,
									trade_type: 'mini_program',
									data
								})
								.then(r => {
									uni.requestPayment({
										provider: 'wxpay', // 微信支付
										timeStamp: r.data.time_stamp,
										nonceStr:r.data.nonce_str,
										package:r.data.package_,
										signType:r.data.sign_type,
										paySign:r.data.pay_sign,
										success: () => {
											mHelper.toast('支付成功');
											mRouter.redirectTo({route});
										},
										fail: res => {
											mHelper.toast('支付已取消');
										},
										complete: () => {
										}
									});
								});
						},
						fail: function (err) {
							console.log("支付异常："+JSON.stringifyerr)
							mHelper.log(err);
						}
					});
					// #endif
					// #ifdef H5
					await http
						.post(url + `?code=${code}`, {
							order_group,
							pay_type: 1,
							trade_type: 'js',
							data
						})
						.then(r => {
							jweixin.ready(() => {
								jweixin.chooseWXPay({
									...r.config,
									success() {
										mHelper.toast('支付成功');
										mRouter.redirectTo({route});
									},
									fail(res) {
										// 支付成功后的回调函数
										mHelper.toast('支付已取消');
									}
								});
							});
						});
					// #endif
				}
			});
		// #endif
	},

	/*
	 *@des 支付宝支付
	 *
	 *@param order_group 订单:order;充值:recharge;
	 *@param data 订单 {“order_id”:199} 充值 {“money”:100};
	 */
	async aliPay(order_group, data, route = '/pages/user/money/success') {

		// #ifdef MP-QQ
		mHelper.toast('QQ小程序不支持支付宝充值');
		return;
		// #endif
		// #ifdef MP-WEIXIN
		mHelper.toast('微信小程序不支持支付宝充值');
		return;
		// #endif

		let url = '';
		// #ifdef H5
		url = `${toaliwappay}`;
		// #endif
		// #ifdef APP-PLUS
		url = `${aliPay}`;
		// #endif
		await http
			.get(url, {
				params: {
					orderCode: data.orderCode,
					orderId: 11,
					orderType: 1,
					type: data.type,
					// #ifdef H5
					trade_type: 'wap',
					// #endif
					// #ifdef APP-PLUS
					trade_type: 'app',
					// #endif

				}
			})
			.then(r => {
				console.log("支付服务器端获取的签名后的数据："+JSON.stringify(r))
				// #ifdef H5
				if (r) {
					let divDom = document.createElement('div')
					divDom.innerHTML = r.data;
					document.body.appendChild(divDom)

					let testForm = document.getElementsByName('punchout_form')
					testForm[0].dispatchEvent(new Event('submit'))
					testForm[0].submit()
					document.body.removeChild(testForm[0])

				}
				//	window.location.href = r;
				// #endif
				// #ifdef APP-PLUS
				uni.requestPayment({
					provider: 'alipay',
					timeStamp: r.data.time_stamp,
					nonceStr:r.data.nonce_str,
					package:r.data.package_,
					signType:r.data.sign_type,
					paySign:r.data.pay_sign,
					success: function () {
						mHelper.toast('支付成功');
						mRouter.redirectTo({route});
					},
					fail: function (err) {
						console.log("支付失败，错误信息："+JSON.stringify(err));
						mHelper.toast('支付已取消');
					}
				});
				// #endif
			});
	},

	/*
	 *@des 余额支付
	 *
	 *@param data 支付参数
	 */
	async balancePay(data, route = '/pages/user/money/success') {
		await http
			.post(`${toprepay}`, data)
			.then(r => {
				// -1:用户不存在 -2:支付密码错误 -3:没有待支付的订单 -4:用户预存款金额不足 -6:没有设置支付密码 1 成功
				if (-1 == r) {
					mHelper.toast('用户不存在');
				} else if (-2 == r) {
					mHelper.toast('支付密码错误');
				} else if (-3 == r) {
					mHelper.toast('没有待支付的订单');
				} else if (-4 == r) {
					mHelper.toast('用户预存款金额不足');
				} else if (-6 == r) {
					mHelper.toast('没有设置支付密码');
				} else if (1 == r) {
					mRouter.redirectTo({route});
				}

			});
	}
};
