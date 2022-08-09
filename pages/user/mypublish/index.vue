<template>
	<view class="about">
		<view
			class="list-cell b-b"
			v-for="item in navList"
			:key="item.title"
			@tap="
				navTo(`${item.url}`)
			"
			hover-class="cell-hover"
			:hover-stay-time="50"
		>
			<text class="cell-tit">{{ item.title }}</text>
			<text class="cell-tip">{{ item.content }}</text>
			<text class="cell-more iconfont iconyou"></text>
		</view>
	</view>
</template>
<script>
/**
 * @des 关于商城
 *
 * @author stav stavyan@qq.com
 * @date 2019-12-09 10:13
 * @copyright 2019
 */
import { merchantView } from '@/api/merchant';
import rfQrcode from '@/components/rf-qrcode';
export default {
	components: { rfQrcode },
	data() {
		return {
			aboutInfo: {},
			navList: [
				{ title: '二手机', url: '/pages/usedcar_sbu/list?isMy=true' },
				// { title: '版权信息', url: 'copyright_companyname,copyright_desc,copyright_url' },
				// { title: '证照信息', url: '' },
				{ title: '出租', url: '/pages/chuzu/list?isMy=true' },
				{ title: '求租', url: '/pages/qiuzu/list?isMy=true' },
				{ title: '求职', url: '/pages/qiuzhi/list?isMy=true' },
				{ title: '招聘', url: '/pages/zhaopin/list?isMy=true' },
				{ title: '替班', url: '/pages/tiban/list?isMy=true' },
				{ title: '加油车', url: '/pages/jiayouche/jiayouche/list?isMy=true' },
				{ title: '拖车', url: '/pages/tuoche/tuoche/list?isMy=true' },
				{ title: '用车', url: '/pages/yongche/yongche/list?isMy=true' },
				{ title: '维修厂', url: '/pages/repair/shop/list?isMy=true' },
				{ title: '维修师傅', url: '/pages/repair/worker/list?isMy=true' },
				{ title: '文章', url: '/pages/article/list?isMy=true' }
			],
			appName: this.$mSettingConfig.appName,
			loading: true,
			hostUrl: this.$mConfig.hostUrl,
			merchantId: ''
		};
	},
	onLoad() {
	},
	methods: {
		// 统一跳转接口
		navTo(url) {
			this.$mRouter.push({ route:url });
		}
	}
};
</script>
<style lang="scss">
page {
	position: relative;
	background-color: #f5f5f5;
}
/*关于商城*/
.about {
	padding: 20upx 0;
	.history-section {
		padding: 30upx 0 0;
		margin-top: 20upx;
		background: #fff;
		border-radius: 10upx;
		.sec-header {
			display: flex;
			align-items: center;
			font-size: $font-base;
			color: $font-color-dark;
			line-height: 40upx;
			margin-left: 30upx;
			.iconfont {
				font-size: 44upx;
				color: #5eba8f;
				margin-right: 16upx;
				line-height: 40upx;
			}
		}
		.qrcode-wrapper {
			padding: $spacing-lg 0;
			text-align: center;
			.qrcode-img-wrapper {
				display: flex;
				justify-content: center;
				align-items: center;
			}
			.qrcode {
				height: 280upx;
			}
			.qrcode-img {
				width: 300upx;
				height: 300upx;
				image {
					width: 300upx;
					height: 300upx;
				}
			}
			.info {
				display: block;
			}
		}
	}
}
</style>
