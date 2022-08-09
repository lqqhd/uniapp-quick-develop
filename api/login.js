
// 密码注册
const registerByPass = '/register';

//忘记密码
const forgetpwd = '/forgetpwd/update';

//绑定手机号
const bindMobile = '/bindMobile';

// 密码登录
const loginByPass = '/loginByPassword';

const getOpenId= '/getOpenId';

// 微信授权登录
const wechatH5Login = '/tiny-shop/v1/third-party/wechat';

// 微信小程序授权登录
const mpWechatLogin = '/mpWechatLogin';

// App微信授权登录
const thirdPartyWechatOpenPlatform = '/uniWxLogin';

// 密码重置
const updatePassword = '/updatepwd/update';
//修改用户支付密码接口
const updatepaypwd = '/updatepaypwd/update';

// 第三方绑定
const authLogin = '/tiny-shop/v1/member/auth/create';

// 查询绑定状态
const isBindingCheck = '/tiny-shop/v1/member/auth/is-binding';

// 手机号验证码登录
const loginBySmsCode = '/loginBySmsCode';

// 获取手机验证码
const smsCode = '/sendmobilecode';

//绑定手机号时调用的获取验证码功能，有绑定前的判断是否此用户已经绑定
const bindSmsCode = '/sendBindMobileCode';

// 退出登录
const logout = '/logout';

// 刷新token
const refreshToken = '/tiny-shop/v1/site/refresh';

// 登录令牌有效性检测
const verifyAccessToken = '/sendmobilecode';

export {updatepaypwd,
	getOpenId,
	registerByPass,
	loginByPass,
	isBindingCheck,
	wechatH5Login,
	mpWechatLogin,
	thirdPartyWechatOpenPlatform,
	authLogin,
	updatePassword,
	smsCode,
	loginBySmsCode,
	logout,
	refreshToken,
	verifyAccessToken,
	bindSmsCode,
	forgetpwd,
	bindMobile
};
