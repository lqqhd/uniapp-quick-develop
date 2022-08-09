<template>
	<view style="padding-top: 30px">
		<view class="hot-recommend" v-for="(sItem, sIndex) in publishList" :key="sIndex" @tap.stop="navTo(sItem.url)">
			<view class="right">
				<image class="hot-recommend-image" :src="sItem.icon"></image>
			</view>
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
import {merchantView} from '@/api/merchant';
import rfQrcode from '@/components/rf-qrcode';

export default {
	components: {rfQrcode},
	data() {
		return {
			publishList: []
		};
	},
	onLoad() {
		this.initData();
	},
	methods: {
		// 初始化数据
		initData() {
			let hideFunction = this.$mHelper.getSysConfg("hide_function");

			if (hideFunction === "1") {
				for (let i = 0; i < this.$mConstDataConfig.publishList.length; i++) {
					let item = this.$mConstDataConfig.publishList[i];
					if (item.title.indexOf("招聘") === -1 && item.title.indexOf("求职") === -1) {
						this.publishList.push(item)
					}
				}
			} else {
				this.publishList = this.$mConstDataConfig.publishList;
			}
		},
		// 统一跳转接口
		navTo(route) {
			this.$mRouter.rightPush({route});
		}
	}
};
</script>
<style lang="scss">
page {
	position: relative;
	background-color: #fff;
}

/* 爆款推荐 */
.hot-recommend {
	background-color: $color-white;
	display: flex;
	padding: $spacing-lg $spacing-lg 0;

	.hot-recommend-image {
		width: 100%;
		height: 100%;
	}

	.left {
		flex: 3;
		height: 320upx;
		margin-right: 15upx;
	}

	.right {
		flex: 4;

		.hot-recommend-image {
			height: 172upx;
		}
	}
}
</style>
