const CONFIG = {
	// 开发环境配置
	development: {
		assetsPath: '/static', // 静态资源路径
		qqMapKey:'SASBZ-QMALS-NUKOI-6W6SQ-SCLBE-CVFSC',
		// baseUrl: 'http://localhost:8091', // 后台接口请求地址
		baseUrl: 'https://zhaohuo.jikebang.com/api-web', // 后台接口请求地址
		hostUrl: 'https://zhaohuo.jikebang.com/api-web', // H5地址(前端运行地址)
		websocketUrl: '', // websocket服务端地址
		weixinAppId: 'wxe17f56a61cf22cc8' // 微信公众号appid
	},
	// 生产环境配置
	production: {
		assetsPath: '/static', // 静态资源路径
		// baseUrl: 'http://localhost:8091', // 后台接口请求地址
		// hostUrl: 'http://localhost:8091', // H5地址(前端运行地址)
		baseUrl: 'https://zhaohuo.jikebang.com/api-web', // 后台接口请求地址
		hostUrl: 'https://zhaohuo.jikebang.com/api-web', // H5地址(前端运行地址)
		websocketUrl: '', // websocket服务端地址
		weixinAppId: 'wxe17f56a61cf22cc8' // 微信公众号appid
	}

};
export default CONFIG[process.env.NODE_ENV];
