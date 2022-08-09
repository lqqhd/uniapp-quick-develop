/**
 * @version 3.0.4
 * @Author lu-ch
 * @Email webwork.s@qq.com
 * 文档: https://www.quanzhan.co/luch-request/
 * github: https://github.com/lei-mu/luch-request
 * DCloud: http://ext.dcloud.net.cn/plugin?id=392
 * HBuilderX: beat-2.7.14 alpha-2.8.0
 */
import Request from '@/utils/luch-request/index.js'
import {refreshToken} from '@/api/login';
import indexConfig from '@/config/index.config';
import mHelper from '@/utils/helper';
import store from '@/store';

const getTokenStorage = () => {
  let token = ''
  try {
    token = 'Bearer ' + uni.getStorageSync('accessToken')
  } catch (e) {
  }
  return token
}

const http = new Request()
http.setConfig((config) => { /* 设置全局配置 */
  config.baseURL = indexConfig.baseUrl; /* 根域名不同 */
  config.header = {
    ...config.header
  }
  return config
})

let isRefreshing = false;
let requests = [];

http.interceptors.request.use((config) => { /* 请求之前拦截器。可以使用async await 做异步操作 */
  config.header = {
    ...config.header,
		Authorization: getTokenStorage()
  }
  /*
 if (!token) { // 如果token不存在，return Promise.reject(config) 会取消本次请求
   return Promise.reject(config)
 }
 */
  return config
}, (config) => {
  return Promise.reject(config)
})

http.interceptors.response.use(async (response) => { /* 请求之后拦截器。可以使用async await 做异步操作  */
	// console.log("调用后台成功，返回的数据："+JSON.stringify(response))
	/* 请求之后拦截器 */
	switch (response.data.code) {
		case 200:
			return response.data.data;
		case 500:
			mHelper.toast(response.data.msg);
			return Promise.reject(response.data.message);
		default:
			mHelper.toast(response.data.msg);
			return Promise.reject(response.data.msg);
	}
}, (response) => { // 请求错误做点什么。可以使用async await 做异步操作
	// console.log("调用后台失败，返回的数据："+JSON.stringify(response))
	switch (response.statusCode) {
		case 200:
			return response.data.data;
		case 400:
			mHelper.toast('错误的请求');
			return Promise.reject(response.data.message);
		case 401:
			isRefreshing = false;
			// refreshToken 的返回状态为401
			if (response.config.url === refreshToken) {
				uni.removeStorageSync('accessToken');
				store.commit('logout');
				uni.showModal({
					content: '会话已过期，是否跳转登录页面？',
					success: confirmRes => {
						if (confirmRes.confirm) {
							mHelper.backToLogin();
							throw response.data.message;
						}
					}
				});
				break;
			} else {
				//TODO 如何刷新token，这里需要处理
				// 如果refreshToken为空 则直接跳转登录
				// if (!store.state.refreshToken) {
					uni.removeStorageSync('accessToken');
					store.commit('logout');
					uni.showModal({
						content: '会话已过期，是否跳转登录页面？',
						success: confirmRes => {
							if (confirmRes.confirm) {
								mHelper.backToLogin();
								throw response.data.message;
							}
						}
					});
					throw response.data.message;
				// } else {
				// 	// isRefreshing同一个页面只执行一次
				// 	if (!isRefreshing) {
				// 		isRefreshing = true;
				// 		// 刷新token
				// 		handleRefreshToken(store.state.refreshToken, response);
				// 		requests.forEach(cb => cb());
				// 		requests = [];
				// 		isRefreshing = false;
				// 		return http.request(response.config);
				// 	} else {
				// 		return new Promise(resolve => {
				// 			// 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
				// 			requests.push(() => {
				// 				resolve(http.request(response.config));
				// 			});
				// 		});
				// 	}
				// }
			}
			break;
		case 405:
			mHelper.toast('当前操作不被允许');
			return Promise.reject(response.data.message);
		case 404:
			mHelper.toast(response.data.message);
			return Promise.reject(response.data.message);
		case 429:
			mHelper.toast('请求过多，先休息一下吧');
			return Promise.reject(response.data.message);
		case 500:
			mHelper.toast(response.data.msg);
			return Promise.reject(response.data.message);
		default:
			mHelper.toast(response.data.msg);
			return Promise.reject(response.data.msg);
	}
  return Promise.reject(response)
})

// 刷新refreshToken
async function handleRefreshToken(refresh_token) {
	const params = {};
	params.group = mHelper.platformGroupFilter();
	params.refresh_token = refresh_token;
	await http.post(refreshToken, params).then(async r => {
		store.commit('login', r);
		isRefreshing = false;
	});
}


export {
  http
}
