<template>
	<view class="rf-notice-detail">
		<view class="banner" v-if="announceDetail.cover">
			<rf-image class="banner-img" :src="announceDetail.cover"></rf-image>
			<view class="banner-title in2line">{{ announceDetail.noticeTitle }}</view>
		</view>
		<view class="banner-title" v-if="!announceDetail.cover">{{
			announceDetail.noticeTitle
		}}</view>
		<view class="article-meta" v-if="announceDetail.createTime">
			<text class="article-author">{{ announceDetail.createBy }}</text>
			<text class="article-text">发布于</text>
			<text class="article-time">{{ announceDetail.createTime  }}</text>
		</view>
		<view class="article-content">
			<rf-parser lazy-load :html="announceDetail.noticeContent"></rf-parser>
		</view>
		<rf-empty
			info="暂无商城公告详情"
			v-if="!announceDetail && !loading"
		></rf-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
import { noticeDetail } from '@/api/sms';
import dayjs from '@/common/dayjs';

export default {
	data() {
		return {
			announceDetail: {},
			id: undefined,
			loading: true
		};
	},
	filters: {
		// 时间格式化
		time(val) {
			return dayjs(val).format('YYYY-MM-DD HH:mm');
		}
	},
	onLoad(event) {
		this.id = event.id;
		this.getNotifyAnnounceView(event.id);
	},
	onShareAppMessage() {
		return {
			title: this.banner.title,
			path: `/pages/index/notice/detail?id=${this.id}`
		};
	},
	methods: {
		// 获取通知列表
		async getNotifyAnnounceView(id) {
			await this.$http
				.get(`${noticeDetail}`, {params:{ id }})
				.then(r => {
					this.loading = false;
					this.announceDetail = r;
					uni.setNavigationBarTitle({
						title: r.title
					});
				})
				.catch(() => {
					this.loading = false;
				});
		}
	}
};
</script>

<style lang="scss">
.rf-notice-detail {
	.banner {
		overflow: hidden;
		position: relative;
		background-color: #ccc;
		.banner-img {
			height: 300upx;
			width: 100%;
		}
		.banner-title {
			max-height: 84upx;
			overflow: hidden;
			position: absolute;
			bottom: 0;
			width: 100%;
			font-size: 32upx;
			font-weight: 400;
			line-height: 42upx;
			color: white;
			z-index: 11;
			background-color: rgba(0, 0, 0, 0.25);
			padding: 4upx 20upx;
		}
	}
	.banner-title {
		padding: $spacing-lg $spacing-lg 0;
		font-size: $font-lg;
	}
	.article-meta {
		padding: 20upx 40upx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		color: gray;

		.article-text {
			font-size: 26upx;
			line-height: 50upx;
			margin: 0 20upx;
		}

		.article-author,
		.article-time {
			font-size: 30upx;
		}
	}

	.article-content {
		padding: 0 30upx;
		overflow: hidden;
		font-size: 30upx;
		margin-bottom: 30upx;
	}
}
</style>
