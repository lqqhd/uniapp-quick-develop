<template>
	<view class="integral">
		<view class="header" :class="'bg-' + themeColor.name">
			<view class="title">当前积分</view>
			<text class="num">
				{{
					(pointAdd + pointMin) ||
						'0'
				}}
			</text>
			<view class="line" />
			<view class="nav">
				<view class="item">
					<text class="num">
						{{
							(pointAdd -pointMin) ||
								'0'
						}}
					</text>
					<text class="title">累计积分</text>
				</view>
				<view class="item">
					<text class="num">
						{{
							-(
								pointMin ) || '0'
						}}
					</text>
					<text class="title">累计消费</text>
				</view>
				<view class="item">
					<text class="num">
						{{
							(pointAdd) ||
								'0'
						}}
					</text>
					<text class="title">累计收入</text>
				</view>
			</view>
			<view class="tab">
				<view
					class="item"
					:class="current === index ? `text-${themeColor.name} on` : ''"
					v-for="(item, index) in navList"
					:key="index"
					@tap="nav(index)"
				>
					{{ item.name }}
				</view>
			</view>
		</view>
		<view class="wrapper">
			<view class="list1" :hidden="current !== 0">
				<view class="tip acea-row row-middle">
					<span class="iconfont icon-shuoming"></span
					>提示：积分可用来兑换指定商品
				</view>
				<view
					class="list b-b"
					v-for="(item, index) in integralList"
					:key="index"
				>
					<view class="wrapper">
						<view class="address-box">
							{{ item.detail }}
						</view>
						<view class="u-box">
							{{ item.createTime  }}
						</view>
					</view>
					<text
						class="change-num"
						:class="
							parseFloat(item.point) >= 0 ? 'change-num-add' : 'change-num-reduce'
						"
						>{{ item.point | numFilter }}</text
					>
				</view>
				<rf-load-more class="load-more" :status="loadingType"></rf-load-more>
			</view>
			<view class="list1" :hidden="current !== 1">
				<view class="tip acea-row row-middle">
        					<span class="iconfont icon-shuoming"></span
        					>提示：积分兑换的商品
        				</view>
        				<view
        					class="list b-b"
        					v-for="(item, index) in integralOrderList"
        					:key="index"
        				>
        					<view class="wrapper">
        						<view class="address-box">
        							{{ item.skuDetail.name }}
        						</view>
        						<view class="u-box">
        							{{ item.createTime  }}
        						</view>
        					</view>
        					<text
        						class="change-num"
        						:class="'change-num-reduce'
        						"
        						>-{{ item.skuDetail.point  }}</text
        					>
        				</view>
        				<rf-load-more class="load-more" :status="loadingType"></rf-load-more>
			</view>
		</view>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
/**
 * @des 积分中心
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-10 15:24
 * @copyright 2019
 */
import { pointsList,pointTotalList,querypointmallorderlist ,
                                    submitpointmallorder ,
                                    confirmreceiptpointmallorder ,
                                    querypointmallorderdetail ,
                                    pointorderCount } from '@/api/userInfo';
import rfLoadMore from '@/components/rf-load-more/rf-load-more.vue';

import dayjs from '@/common/dayjs';
export default {
	name: 'Integral',
	components: {
		rfLoadMore
	},
	data() {
		return {
		navList: [{ name: '积分明细' }, { name: '积分订单' }],
			current: 0,
			pointAdd:0,
			pointMin:0,
			integralList: [],
			integralOrderList:[],
			loadingType: 'more',
			pageNum :0,
			userInfo: {},
			loading: true
		};
	},
	onLoad() {
		this.initData();
	},
	filters: {
		time(val) {
			return dayjs(val).format('YYYY-MM-DD HH:mm:ss');
		},
		numFilter(val) {
			return val >= 0 ? `+${val.toString()}` : val;
		}
	},
	// 加载更多
	onReachBottom() {
  if (this.loadingType === 'nomore') return;
		this.pageNum++;
		this.getIntegralListList();
	},
	methods: {
		toCategory() {
			this.$mRouter.reLaunch({ route: '/pages/category/category' });
		},
		nav(index) {
			this.loading = true;
			this.current = index;
			this.pageNum = 0;
			this.integralList.length = 0;
			if(index==0){
				this.getIntegralListList();
			}else{
				this.querypointmallorderlist();
			}

		},
		initData() {
			this.userInfo = uni.getStorageSync('userInfo') || undefined;
			this.getIntegralListList();
			this.getPointTotalList();
		},

		async getPointTotalList() {
    			await this.$http
    				.get(`${pointTotalList}`, {

    				})
    				.then(r => {
    					this.loading = false;
    					if(r[0].type==1){
									this.pointAdd=r[0].point;
									this.pointMin=r[1].point;
    					}else{
    								this.pointMin=r[0].point;
								   this.pointAdd=r[1].point;
    					}
    				})
    				.catch(() => {
    					this.loading = false;
    				});
    		},
    	async	querypointmallorderlist(){
    		await this.$http
        				.get(`${querypointmallorderlist}`, {
        					pageNum: this.pageNum,

        				})
        				.then(r => {
        					this.loading = false;
        					if(r.list){
        					this.loadingType = r.list.length === 10 ? 'more' : 'nomore';
        					this.integralOrderList = [...this.integralOrderList, ...r.list];
        					}
        				})
        				.catch(() => {
        					this.loading = false;
        				});
    		},
		async getIntegralListList() {
			await this.$http
				.get(`${pointsList}`, {
					pageNum: this.pageNum,

				})
				.then(r => {
					this.loading = false;
					if(r.list){
					this.loadingType = r.list.length === 10 ? 'more' : 'nomore';
					this.integralList = [...this.integralList, ...r.list];
					}
				})
				.catch(() => {
					this.loading = false;
				});
		}
	}
};
</script>
<style scoped lang="scss">
page {
	background-color: $color-white;
}
.integral {
	background-color: $color-white;
	/*  #ifndef H5  */
	height: 100vh;
	/*  #endif  */
	.header {
		opacity: 0.9;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		width: 100%;
		height: 420upx;
		font-size: $font-base;
		color: #fff;
		padding: 20upx 0;
		text-align: center;
		position: relative;
		.title {
			font-size: $font-sm;
			margin: 10upx 0;
		}
		.num {
			/*<!--color: $base-color;-->*/
			font-size: $font-lg + 20upx;
			font-weight: lighter;
			line-height: 1;
		}
		.line {
			width: 10%;
			height: 3upx;
			background-color: #fff;
			margin: 20upx auto 30upx;
		}
		.nav {
			width: 100%;
			display: flex;
			.item {
				flex: 1;
				.num {
					font-size: $font-lg + 4upx;
					display: block;
					line-height: 1;
				}
			}
		}
		.tab {
			position: absolute;
			bottom: -2upx;
			display: flex;
			width: 80%;
			margin: 0 10%;
			border-radius: 20upx 20upx 0 0;
			background-color: #f7f7f7;
			height: 80upx;
			line-height: 80upx;
			font-size: $font-base;
			color: #bbb;
			.item {
				flex: 1;
				text-align: center;
				line-height: 80upx;
			}
			.on {
				background-color: #fff;
				font-weight: bold;
				border-radius: 20upx 0 0 0;
			}
			.on:last-child {
				border-radius: 0 20upx 0 0;
			}
		}
	}
}
.wrapper .list1 {
	background-color: #fff;
	.tip {
		font-size: $font-sm;
		width: 90%;
		margin: $spacing-base 5%;
		height: 64upx;
		line-height: 64upx;
		border-radius: 30upx;
		background-color: #fff5e2;
		border: 1px solid #ffeac1;
		color: #c8a86b;
		text-align: center;
	}
	.list {
		display: flex;
		align-items: center;
		padding: 20upx 36upx;
		background: #fff;
		position: relative;
		.wrapper {
			display: flex;
			flex-direction: column;
			flex: 1;
			.address-box {
				display: flex;
				align-items: center;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.u-box {
				color: $font-color-light;
				font-size: $font-sm;
			}
		}
		.change-num {
			font-size: $font-lg + 4upx;
			color: $font-color-base;
		}
		.change-num-add {
			color: #16ac57;
		}
		.change-num-reduce {
			color: $base-color;
		}
	}
}
.wrapper .list2 {
	/*background-color: #F76260;*/
}
.wrapper .list2 .item {
	background-image: linear-gradient(to right, #fff7e7 0%, #fffdf9 100%);
	width: 90%;
	margin: $spacing-base 5%;
	height: 120upx;
	line-height: 120upx;
	position: relative;
	border-radius: 20upx;
	padding: 0 20upx;
	display: flex;
}
.wrapper .list2 .item .pictrue {
	width: 60upx;
	height: 100upx;
	margin: 20upx 0;
	image {
		width: 80%;
		height: 80%;
	}
}
.wrapper .list2 .item .name {
	flex: 1;
	font-size: $font-sm;
	font-weight: bold;
	color: #c8a86b;
	margin: 0 20upx;
}
.wrapper .list2 .item .earn {
	font-size: $font-sm;
	color: #c8a86b;
	border: 2upx solid #c8a86b;
	text-align: center;
	height: 48upx;
	margin: 36upx 0;
	width: 120upx;
	border-radius: 10upx;
}
</style>
