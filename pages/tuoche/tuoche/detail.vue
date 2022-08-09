<template>
	<view class="container">
		<!--顶部设备轮播图-->
		<view class="carousel">
			<swiper indicator-dots circular="true" duration="400" controls touchable>
				<swiper-item class="swiper-item" v-for="(item, index) in imagesArr" :key="index">
					<view class="image-wrapper">
						<image :src="item" class="loaded" mode="aspectFill"></image>
					</view>
					<uni-tag class="content" circle size="small" :text="index+1+` / `+imagesArr.length"></uni-tag>
				</swiper-item>
			</swiper>
		</view>

		<view class="banner-title" v-if="formData.name">{{ formData.name }}</view>
		<view class="detail-meta" v-if="formData.createTime">
			<text class="field-title">发布时间：</text>
			<text class="field-time">{{ formData.createTime }}</text>
		</view>
		<uni-group title="基本信息">
			<view class="line">
				<text class="field-title">服务地区：</text>
				<text>{{ formData.regionNames }}</text>
			</view>
			<view class="line">
				<text class="field-title">拖车信息：</text>
				<text>{{ formData.carInfo }}</text>
			</view>
			<view class="line">
				<text class="field-title">服务时间：</text>
				<text>{{ formData.serviceTime }}</text>
			</view>
			<view class="line">
				<text class="field-title">服务内容：</text>
				<text>{{ formData.serviceContent }}</text>
			</view>
			<view class="line">
				<text class="field-title">区域范围：</text>
				<text>{{ formData.area }}</text>
			</view>
			<view class="line">
				<text class="field-title">联系电话：</text>
				<text>{{ formData.phone }}</text>
			</view>
			<view class="line">
				<tui-rate :current="formData.star" active="#ff7900" @change="" :size="20"></tui-rate>
			</view>
			<view class="line">
				<text class="field-title">设备说明：</text>
				<text>{{ formData.remark }}</text>
			</view>

		</uni-group>
		<uni-bottom-nav  :options="favorite?options2:options1" :fill="true" :button-group="buttonGroup" @click="onClick" @buttonClick="buttonClick"/>

		<rf-empty
			info="暂无详情"
			v-if="!formData && !loading"
		></rf-empty>

		<view style="height: 10px;background-color: #f8f8f8"></view>

		<view style="margin: 20px 15px;padding-bottom: 20px">
			<view style="margin-top: 10px">
				<tui-icon name="about" color="#0081ff" style="margin-right: 5px" :size="14"></tui-icon>
				<text style="margin-left: 5px">温馨提示：</text>
			</view>
			<view style="font-size: 13px;color: #888">1.联系我时，请说在工程找活儿看到的！</view>
			<view style="font-size: 13px;color: #888">2.如遇无效、虚假、诈骗信息，请立即举报！</view>
			<view style="font-size: 13px;color: #888">3.可通过电话和消息沟通，尽可能了解详细的拖车情况。</view>
		</view>
		<view style="height: 50px"></view>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
import {noticeDetail} from '@/api/sms';
import dayjs from '@/common/dayjs';

export default {
	data() {
		return {
			imagesArr: [],
			formData: {},
			id: undefined,
			loading: true,
			favorite:false,
			options1	: [{
				icon: 'info',
				text: '举报'
			},{
				icon: 'star',
				text: '收藏'
			}],
			options2: [{
				icon: 'info',
				text: '举报'
			},{
				icon: 'star-filled',
				color:'#ffa200',
				text: '收藏'
			}],
			buttonGroup: [
				{
					text: '立刻联系',
					backgroundColor: '#007aff',
					color: '#fff'
				}
			]
		};
	},
	filters: {
		// 时间格式化
		time(val) {
			return dayjs(val).format('YYYY-MM-DD HH:mm');
		}
	},
	async onLoad(options) {
		this.id = options.id;
		await this.getDetail(options.id);
		this.favorite = await this.hasAttention();
	},
	onShareAppMessage() {
		return {
			title: this.banner.title,
			path: `/pages/index/notice/detail?id=${this.id}`
		};
	},
	methods: {
		// 收藏
		async toFavorite() {
			if (!this.formData.id) return;
			if (!this.$mStore.getters.hasLogin) {
				await this.$mHelper.backToLogin();
			} else {
				let favorite = await this.hasAttention()
				favorite ? this.handleCollectDel() : this.handleCollectCreate();
			}
		},
		// 查询收藏结果
		async hasAttention() {
			return await this.$http.apiCall('get', '/hasAttention', {id: this.formData.id,type:'9'});
		},
		// 收藏设备
		async handleCollectCreate() {
			let params = {
				id: this.formData.id,
				type:'9',
				image:this.formData.url,
				title:'拖车'+this.formData.name,
				navUrl:'/pages/tuoche/tuoche/detail?id='+this.formData.id
			}
			await this.$http.get('/addattention', {params:params}).then(async res => {
				this.favorite = true;
				this.$mHelper.toast('收藏成功');
			});
		},
		// 取消收藏设备
		async handleCollectDel() {
			let _this = this;
			await this.$http.get('/cancelattention', {params:{id: this.formData.id,type:'9'}}).then(async res => {
				this.favorite = false;
				this.$mHelper.toast('取消收藏成功');
			});
		},
		// 获取示例详情
		async getDetail(id) {
			let res = await this.$http.apiCall('get', '/tuoche/tuoche/detail', {id: id});
			this.loading = false;
			if (res.name) {
				uni.setNavigationBarTitle({
					title: res.name
				});
			}
			this.formData = res;
			if (this.formData.images) {
				this.imagesArr = this.formData.images.split(",");
			}
		},
		onClick(e) {
			if (e.index === 0) {
				this.$mRouter.push({route: '/pages/set/feedback/feedback'});
			} else {
				this.toFavorite()
			}
		},
		buttonClick(e) {
			let _this = this;
			uni.showModal({
				title: '提示',
				content: '点击拨打，立即联系：' + this.formData.phone,
				confirmText: '拨打',
				success: async function (res) {
					if (res.confirm) {
						uni.makePhoneCall({
							phoneNumber: _this.formData.phone,
							success: () => {
								console.log("成功拨打电话")
							}
						})
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.container {
	background: #fff;

	.carousel {
		height: 400upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 400upx;
			overflow: hidden;
			border-bottom: 1upx solid rgba(0, 0, 0, 0.01);

			image {
				width: 100%;
				height: 100%;
			}

			.content {
				position: absolute;
				right: $spacing-base;
				bottom: $spacing-base;
			}
		}
	}

	.banner {
		overflow: hidden;
		position: relative;
		background-color: #fff;

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
			line-height: 42upx;
			color: white;
			z-index: 11;
			background-color: rgba(0, 0, 0, 0.25);
			padding: 4upx 20upx;
		}
	}

	.field-title {
		color: #999;
	}

	.line {
		padding-bottom: 10px;
	}

	.banner-title {
		padding: $spacing-lg $spacing-lg 0;
		font-size: $font-lg;
		font-weight: bold;
	}

	.detail-meta {
		padding: 20upx 30upx;
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
		.field-time {
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
