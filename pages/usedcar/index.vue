<template>
	<view class="page">
		<view class="page-title">
		</view>
		<uni-card>
			<view class="flow-section">
				<view style="display: flex"
					v-for="item in flowSectionList"
					:key="item.title"
				>
					<view class="flow-item">
						<i class="iconfont" :class="[item.icon, 'text-'+themeColor.name]"/>
						<text>{{ item.title }}</text>
					</view>
					<view v-if="item.num === 1">
						<text class="iconfont iconyou" style="font-size: 10px;line-height: 70px"></text>
					</view>

				</view>
			</view>
		</uni-card>


		<button
			class="confirm-btn"
			:class="'bg-' + themeColor.name"
			@tap="send"
		>
			发布设备
		</button>

		<view class="page-title" style="padding-top: 50px">
			流程说明
		</view>
		<uni-card>
			<view>1、关于工程找活儿</view>
			<view style="font-size: 13px;color: #888">
				工程找活儿是国内领先的工程机械综合服务平台，致力打造成服务于工程机械各环节的全领域平台。为所有工程机械人员及施工需求方提供最全面、最公正、最高效的服务！让每一台机器都创造财富！
			</view>
			<view style="margin-top: 10px">2、工程找活儿卖车流程说明</view>
			<view style="font-size: 13px;color: #888">1.提交您要出售的设备信息。</view>
			<view style="font-size: 13px;color: #888">2.平台审核您的设备后，即可在工程找活儿APP上展示，获得全网关注的机会。</view>
			<view style="font-size: 13px;color: #888">3.卖家联系看车，成交立领车款。</view>

			<view style="margin-top: 10px">3、车源说明</view>
			<view style="font-size: 13px;color: #888">1.个人车源-由用户发布，平台审核后即可全网展示。</view>
			<view style="font-size: 13px;color: #888">2.平台车源-平台线下设备拍照、检测、核实车况，真实试车报告。</view>
			<view style="font-size: 13px;color: #888">3.自营认证-平台自营设备，设备全方位检测，真实车况，设备质保。</view>
		</uni-card>

	</view>
</template>

<script>
import { opinionCreate, uploadImage } from '@/api/userInfo';
export default {
	components: {
	},
	data() {
		return {
			flowSectionList: this.$mConstDataConfig.flowSectionList
		};
	},
	methods: {

		// 发送反馈
		async send() {
			uni.navigateTo({
				url: ``
			})
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $page-color-base;
}
.flow-section {
	@extend %section;
	padding: 28upx 0;

	.flow-item {
		@extend %flex-center;
		width: 120upx;
		height: 120upx;
		border-radius: 10upx;
		font-size: $font-sm;
		color: $font-color-dark;
		position: relative;
	}

	.badge {
		position: absolute;
		top: 0;
		right: 4upx;
	}

	.iconfont {
		font-size: 48upx;
	}

	.icon-shouhoutuikuan {
		font-size: 44upx;
	}
}
/*问题反馈*/
.page-title {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0 15px;
	margin-top: $spacing-base;
	font-size: 18px;
	font-weight: bold;
}

.feedback-star-view.page-title {
	justify-content: flex-start;
	margin: 0;
}

.feedback-quick {
	position: relative;
	padding-right: 40upx;
	.iconfont {
		font-size: $font-sm;
	}
}

.feedback-body {
	background: $color-white;
	padding: $spacing-sm $spacing-base;
	.gender-item {
		margin-right: 20upx;

		.gender-item-text {
			padding-left: 10upx;
		}

		radio .wx-radio-input.wx-radio-input-checked {
			background: $uni-color-primary;
			border-color: $uni-color-primary;
		}
	}
}

.feedback-textare {
	height: 200upx;
	font-size: 34upx;
	line-height: 50upx;
	width: 100%;
	box-sizing: border-box;
	padding: 20upx 30upx 0;
}

.feedback-input {
	font-size: 28upx;
	height: 72upx;
	min-height: 50upx;
	padding: 15upx 20upx;
	line-height: 72upx;
}

.feedback-uploader {
	padding: 22upx 20upx;
}
%section {
	justify-content: space-around;
	display: flex;
	align-content: center;
	background: #fff;
	border-radius: 10upx;
}
%flex-center {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
</style>
