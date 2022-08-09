/*
 * 路由对象
 * 中心思想：需要路由鉴权,由于uni-app没有vue中的全局钩子函数，所以封装了Router对象。
 * 说明：应用中的路由跳转尽量使用该Router的方法，并配合config中的路由表对象进行跳转。
 *
 * 示例：this.$mRouter.push({route:this.$mRoutesConfig.main,query:{a:1}})
 *
 */
import mStore from "@/store";

class Router {
	constructor() {
		this.callBack = () => {
		};
	}

	beforeEach(callBack) {
		if (callBack instanceof Function) this.callBack = callBack;
	}

	push(to) {
		this.callBack('navigateTo', to);
	}

	rightPush(to) {
		if (!mStore.getters.hasLogin) {
			uni.showModal({
				content: '您未登录或会话已过期，是否跳转登录页面？',
				success: confirmRes => {
					if (confirmRes.confirm) {
						this.push({route: '/pages/public/logintype'});
					}
				}
			});
		}else{
			this.callBack('navigateTo', to);
		}
	}

	redirectTo(to) {
		this.callBack('redirectTo', to);
	}

	reLaunch(to) {
		this.callBack('reLaunch', to);
	}

	switchTab(to) {
		this.callBack('switchTab', to);
	}

	back(delta) {
		// #ifdef H5
		history.back();
		// #endif
		// #ifndef H5
		uni.navigateBack({
			delta
		});
		// #endif
	}
}

export default new Router();
