<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">_</view>
			<view class="welcome"></view>
			<view style="font-weight: bold;font-size: 28px;text-align: center">绑定手机号</view>

			<!--#ifndef MP-WEIXIN-->
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" v-model="phone" placeholder="请输入手机号码"/>
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<view class="input-item-right">
						<input type="number" maxlength="6" placeholder="请输入验证码" v-model="code" @confirm="toBind"
									 style="width: 70%;"/>
						<view class="codeText" v-if="coding == false" @click="getCode()">获取验证码</view>
						<view class="authTime" v-else>{{ auth_time }}秒</view>
					</view>
				</view>
			</view>
			<button class="confirm-btn" @click="toBind" :disabled="logining">绑定手机号</button>
			<!--#endif-->
			<!--#ifdef MP-WEIXIN-->
			<button class="confirm-btn" open-type="getPhoneNumber" @getphonenumber="onGetPhoneNumber">一键绑定</button>
			<!--#endif-->
		</view>

		<view class="register-section">

		</view>
	</view>
</template>

<script>
import {mapMutations, mapState} from 'vuex';

import {registerByPass, bindSmsCode, bindMobile} from '@/api/login';

export default {
	components: {},
	data() {
		return {
			phone: '',
			code: '',
			logining: false,
			coding: false,
			auth_time: 60
		};
	},
	onLoad() {

	},
	computed: {
		...mapState(['userInfo'])
	},
	methods: {
		...mapMutations(['login']),
		inputChange(e) {
			const key = e.currentTarget.dataset.key;
			this[key] = e.detail.value;
		},
		toLoginPwd() {
			uni.navigateTo({
				url: '/pages/public/login'
			});
		},
		navBack() {
			uni.switchTab({
				url: '/pages/index/index'
			});
		},
		toRegist() {
			uni.navigateTo({
				url: '/pages/public/reg'
			});
		},
		async toBind() {
			let client = "app";
			// #ifdef MP-WEIXIN
			client = "mp";
			// #endif
			// #ifdef H5
			client = "h5";
			// #endif
			var that = this;
			let phoneReg = /^1[1-9][0-9]\d{8}$/;
			try {
				if (this.phone === '') {
					throw '请填写手机号';
				}
				if (!phoneReg.test(this.phone)) {
					throw '手机号格式有误';
				}
				if (this.code === '') {
					throw '请填写验证码';
				}
			} catch (err) {
				this.$mHelper.toast(err);
				return;
			}
			this.logining = false;
			let openId = uni.getStorageSync('openId');
			let params = {mobile: this.phone, openId: openId, smsCode: this.code, client: client};
			let res = await this.$http.apiCall('post', "/bindMobile", params);
			console.log("绑定手机号成功：" + res);
			if (res) {
				this.$mHelper.toast('恭喜您，登录成功！');
				this.$mStore.commit('login', res);
				this.$mRouter.reLaunch({route: '/pages/profile/profile'});
			}
		},
		async onGetPhoneNumber(e){
			if(e.detail.errMsg==="getPhoneNumber:fail user deny"){
				//用户决绝授权
				this.$mHelper.toast('绑定手机号后，会有全部功能的操作权限！');
			}else{
				//允许授权
				let openId = uni.getStorageSync('openId');
				let accessToken = uni.getStorageSync('access_token');
				let params = {iv:e.detail.iv,encryptedData: e.detail.encryptedData,openId:openId,accessToken:accessToken};
				console.log("绑定手机号请求参数："+JSON.stringify(params))
				let res = await this.$http.apiCall('post', "/getPhoneNumber", JSON.stringify(params));
				console.log("绑定手机号结果：" + res);
				if (res) {
					this.$mHelper.toast('恭喜您，登录成功！');
					this.$mStore.commit('login', res);
					this.$mRouter.reLaunch({route: '/pages/profile/profile'});
				}
			}
		},
		// 获取验证码
		async getCode() {
			var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
			if (!myreg.test(this.phone)) {
				uni.showToast({
					icon: 'none',
					title: '请输入正确的手机号码'
				});
				return false;
			}
			//设置倒计时秒
			this.auth_time = 60;
			this.coding = true;
			var auth_timetimer = setInterval(() => {
				this.auth_time--;
				if (this.auth_time < 0) {
					this.coding = false;
					clearInterval(auth_timetimer);
				}
			}, 1000);
			//获取验证码
			this.$http.get(bindSmsCode, {params: {mobile: this.phone}}).then(res => {
				console.log("发送验证码结果：" + JSON.stringify(res))
				if (res === -1) {
					this.$mHelper.toast('该手机号已经绑定其他微信帐户，不能再次绑定');
				} else if (res === 0) {
					this.$mHelper.toast('验证码已发送');
				} else {
					this.$mHelper.toast(`验证码已发送失败，返回码:${res}`);
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #fff;
}

.container {
	padding-top: 115px;
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	background: #fff;
}

.wrapper {
	position: relative;
	z-index: 90;
	background: #fff;
	padding-bottom: 40upx;
}

.input-item-right {
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	justify-content: space-between;
}

.codeText {
	font-size: 28upx;
	width: 25%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #0081ff;
}

.authTime {
	font-size: 28upx;
	width: 25%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #0081ff;
}

.back-btn {
	position: absolute;
	left: 40upx;
	z-index: 9999;
	padding-top: var(--status-bar-height);
	top: 40upx;
	font-size: 40upx;
	color: $font-color-dark;
}

.left-top-sign {
	font-size: 120upx;
	color: $page-color-base;
	position: relative;
	left: -16upx;
}

.right-top-sign {
	position: absolute;
	top: 80upx;
	right: -30upx;
	z-index: 95;

	&:before,
	&:after {
		display: block;
		content: '';
		width: 400upx;
		height: 80upx;
		background: #fff;
	}

	&:before {
		transform: rotate(50deg);
		border-radius: 0 50px 0 0;
	}

	&:after {
		position: absolute;
		right: -198upx;
		top: 0;
		transform: rotate(-50deg);
		border-radius: 50px 0 0 0;
		/* background: pink; */
	}
}

.left-bottom-sign {
	position: absolute;
	left: -270upx;
	bottom: -320upx;
	border: 100upx solid #d0d1fd;
	border-radius: 50%;
	padding: 180upx;
}

.welcome {
	position: relative;
	left: 50upx;
	top: -90upx;
	font-size: 46upx;
	color: #555;
	text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}

.input-content {
	padding: 0 60upx;
}

.input-item {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	padding: 0 30upx;
	background: $page-color-light;
	height: 120upx;
	border-radius: 4px;
	margin-bottom: 50upx;

	&:last-child {
		margin-bottom: 0;
	}

	.tit {
		height: 50upx;
		line-height: 56upx;
		font-size: $font-sm + 2upx;
		color: $font-color-base;
	}

	input {
		height: 60upx;
		font-size: $font-base + 2upx;
		color: $font-color-dark;
		width: 100%;
	}
}

.confirm-btn {
	width: 630upx;
	height: 76upx;
	line-height: 76upx;
	border-radius: 50px;
	margin-top: 70upx;
	background: #0081ff;
	color: #fff;
	font-size: $font-lg;

	&:after {
		border-radius: 100px;
	}
}

.forget-section {
	font-size: $font-sm + 2upx;
	color: $font-color-spec;
	text-align: center;
	margin-top: 40upx;
}

.register-section {
	position: absolute;
	left: 0;
	bottom: 50upx;
	width: 100%;
	font-size: $font-sm + 2upx;
	color: $font-color-base;
	text-align: center;

	text {
		color: $font-color-spec;
		margin-left: 10upx;
	}
}
</style>
