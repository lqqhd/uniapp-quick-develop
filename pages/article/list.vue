<template>
	<view class="page">
		<view class="top">
			<hx-navbar ref="hxnb" :config="config" @searchClick="searchConfirm"/>

			<!-- 导航 -->
			<view class="navbar" :class="showNavFloat ? 'floatbar' : ''">
				<view class="menu" v-if="category.length > 0">
					<view class="category">
						<scroll-view :scroll-x="true" :scroll-with-animation="true" :scroll-into-view="scroll_category_id" @scroll="navFloatShow()">
							<view
								class="item"
								v-for="(item, index) in category"
								:key="index"
								:class="category_id == item.id ? 'current' : ''"
								:id="'category_id-' + index"
								:style="'width:' + (category.length <= 4 ? 100 / category.length + '%' : '')"
								@tap="categoryChange(item.id, index)"
							>
								<view class="text">
									<text>{{ item.name }}</text>
									<!-- <image src="/static/images/bg_tab.png"></image> -->
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="list" @tap="menuShow(!showMenu)">
						<uni-icons type="bars" style="font-size: 28px;padding-bottom: 10px;"/>
					</view>
				</view>
			</view>
		</view>
		<view class="content" :style="{height:contentHeight+'px'}">
			<view class="menu-block fade-in" v-show="showMenu">
				<view class="list">
					<text
						class="item"
						v-for="(item, index) in category"
						:key="index"
						:class="category_id == item.id ? 'current' : ''"
						:id="'category_id-' + (index + 1)"
						@tap="categoryChange(item.id, index)"
					>
						{{ item.name }}
					</text>
				</view>
			</view>
			<scroller @init="initScroller" @down="refreshData" @up="getData" :up="optUp" @scroll="navFloatShow(scroller)" :fixed="false">
				<swiper v-if="slider.length > 0" class="swiper" :indicator-dots="true" :autoplay="true" :circular="true">
					<swiper-item v-for="(item, index) in slider" :key="index">
						<navigator class="item" hover-class="none" :url="'/pages/article/detail?id=' + item.id">
							<image :lazy-load="true" :src="item.image" mode="aspectFill"></image>
							<view class="title">
								<text>{{ item.title }}</text>
							</view>
						</navigator>
					</swiper-item>
				</swiper>
				<articleList :list="list" />
			</scroller>
		</view>
		<pageLoading v-if="showPageLoading"></pageLoading>
	</view>
</template>

<script>
import scroller from '@/components/scroller/scroller.vue';
import articleList from '@/components/article/list.vue';
import pageLoading from '@/components/loading/pageLoading.vue';
import iconfont from '@/components/iconfont/iconfont.vue';
export default {
	components: {
		articleList,
		pageLoading,
		scroller,
		iconfont
	},
	data() {
		return {
			config:{
				back: true,
				color: '#555',
				search: {
					value:'',
					placeholder: '请输入搜索内容',
					disabled: false
				}
			},
			queryParams: {},
			scroller: {},
			optUp: { auto: true, onScroll: true, page: { size: 10 }, empty: { tip: '暂无文章~' } },
			category_id: 2,
			category_index: 1,
			scroll_category_id: 'scroll_category_id_0',
			currentSliderIndex: 0,
			category: [],
			showMenu: false,
			slider: [],
			list: [],
			showNoData: false,
			showPageLoading: false,
			showNavFloat: false,
			navBarHeight: '',
			contentHeight:'',
			isMy:false
		};
	},
	onShow() {
		// this.$initPageTitle(); //初始化页面标题



	},
	onShareAppMessage() {
		return {
			path: '/pages/article/index',
			success: function(e) {},
			title: '工程找活儿'
		};
	},
	onLoad(options) {
		if(options && options.isMy){
			this.isMy = true;
		}

		/*导航栏高度*/
		this.navBarHeight = uni.getSystemInfoSync().statusBarHeight + 44 + 40;
		this.contentHeight = uni.getSystemInfoSync().screenHeight - this.navBarHeight
		this.getCategory();
	},
	onPullDownRefresh() {
		uni.showLoading({
			title: '刷新中'
		});
		this.loadData();
	},
	methods: {
		searchConfirm(data){
			this.$mRouter.push({
				route: `/pages/index/search/search`
			});
		},
		/*初始化滚动*/
		initScroller(scroller) {
			this.scroller = scroller;
		},
		back() {
			this.$mRouter.switchTab({ route: '/pages/index/index' });
		},
		/*刷新数据*/
		refreshData() {
			uni.showLoading({
				title: '刷新中'
			});
			this.scroller.resetUpScroll();
		},

		/*加载数据*/
		loadData() {
			this.slider = [];
			this.list = [];
			this.currentSliderIndex = 0;
			this.scroller.resetUpScroll();
			this.getData();
		},

		/*获取子类别数据*/
		async getCategory() {
			let res = await this.$http.apiCall('get', '/article/firstColumn', {});
			this.category = res;
			if (this.category_index > -1) {
				let nextIndex = this.category_index - 1;
				nextIndex = nextIndex <= 0 ? 0 : nextIndex;
				this.scroll_category_id = `category_id-${nextIndex}`; //动画滚动,滚动至中心位置
			}
		},

		/*获取数据*/
		async getData() {
			this.queryParams.pageNum = this.scroller.num - 1
			this.queryParams.columnId = this.category_id
			let url = '/article/list';
			if(this.isMy){
				url = '/article/myList';
				delete this.queryParams.provinceId;
				delete this.queryParams.cityId;
			}
			if(this.queryParams.provinceId === undefined || this.queryParams.provinceId === ""){
				delete this.queryParams.provinceId;
			}
			if(this.queryParams.cityId === undefined || this.queryParams.cityId === ""){
				delete this.queryParams.cityId;
			}
			let res = await this.$http.apiCall('get',url , this.queryParams);

			if (this.scroller.num === 1) {
				this.list = [];
			}
			this.list = this.list.concat(res.list);
			if (this.slider.length === 0) {
				this.slider = this.list.slice(0,5);
			}
			this.scroller.endByPage(res.list.length, res.totalPages);
			this.showPageLoading = false;
			uni.stopPullDownRefresh();
			uni.hideLoading();
		},

		/*切换导航*/
		categoryChange(category_id, index) {
			this.showMenu = false;
			this.category_index = index;
			this.category_id = category_id;
			var nextIndex = index - 1;
			nextIndex = nextIndex <= 0 ? 0 : nextIndex;
			this.scroll_category_id = `category_id-${nextIndex}`; //动画滚动,滚动至中心位置
			this.loadData();
		},

		/*广告切换*/
		sliderChange: function(e) {
			this.currentSliderIndex = e.detail.current;
		},

		/*滚动时导航栏浮动*/
		navFloatShow(scroller) {
			if (scroller) {
				if (scroller.scrollTop > 60) {
					if (!this.showNavFloat) {
						this.showNavFloat = true;
					}
				} else {
					if (this.showNavFloat) {
						this.showNavFloat = false;
					}
				}
			}
		},
		/*菜单框展示*/
		menuShow(value) {
			this.showMenu = value;
		},
		/*隐藏导航浮动*/
		navFloatHide() {
			this.showNavFloat = false;
		}
	}
};
</script>

<style scoped lang="scss">
page {
	height: 100%;
}
.rf-back {
	margin-left: 8rpx;
	height: 32px !important;
	width: 32px !important;
	display: flex;
	justify-content: center;
	align-items: center;
	.iconzuo {
		font-size: $font-lg + 4upx;
		font-weight: 500;
		color: $font-color-dark;
	}
}
.page {
	background: white;
	height: 100%;
}
.content {
	width: 100%;
}

/*头部*/
.top {

	/* 顶部navbar */
	.navbar {
		/*分类*/
		.menu {
			position: relative;
			height: 80rpx;
			white-space: nowrap;
			padding: 15rpx 0 6rpx;
			z-index: 10;
			display: flex;
			align-items: center;
			justify-content: space-between;
			/*分类*/
			.category {
				width: 650rpx;
				margin-left: 30rpx;
				white-space: nowrap;
				position: relative;
				scroll-view {
					width: auto;
					.item {
						position: relative;
						display: inline-block;
						margin: 0 31rpx 0;
						height: 80rpx;
						text-align: left;
						padding-top: 7rpx;
						//line-height: 80rpx;
						&:first-child {
							margin-left: 10rpx;
						}
						&:after {
							content: '';
							width: 0;
							height: 0;
							position: absolute;
							left: 50%;
							bottom: 0;
							transform: translateX(-50%);
							transition: 0.3s;
						}
						.text {
							position: relative;
							width: auto;
							height: auto;
							line-height: auto;
							display: inline-block;
							text {
								font-size: 36rpx;
								font-weight: bold;
								color: #555;
							}
							image {
								position: absolute;
								top: 16rpx;
								right: -14rpx;
								width: 50rpx;
								height: 50rpx;
								display: none;
							}
						}
					}
					.current {
						&:after {
							width: 50%;
						}
						.text {
							text {
								font-size: 40rpx;
								font-weight: bold;
								color: #262626;
							}
							image {
								display: block;
							}
							border-bottom: 6rpx solid #8cc7b5;
						}
					}
				}
			}
			.list {
				width: 70rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				//box-shadow: -4rpx 0 0 #e9ebee;
				//box-shadow: -2px 0 0 #262626;
				/deep/ .icon {
					font-size: 36rpx;
					margin-top: -6rpx;
				}
			}
		}
	}
}
.menu-block {
	position: absolute;
	left: 0;
	background: #fff;
	border-bottom: 1rpx solid #f5f5f5;
	padding: 20rpx 0 50rpx;
	z-index: 100;
	//box-shadow: 0 15rpx 10rpx -15rpx #e9ebee;
	.list {
		padding-left: 10rpx;
		text {
			background: #f5f7fa;
			border-radius: 8rpx;
			font-size: 32rpx;
			margin: 12rpx 20rpx;
			display: inline-block;
			height: 72rpx;
			width: 144rpx;
			line-height: 72rpx;
			text-align: center;
		}
		.current {
			color: #fff;
			background: #8cc7b5;
			//font-size: 32rpx;
		}
	}
}

.scroll {
	height: 100%;
}

/*幻灯片广告 */
.swiper {
	height: 350rpx;
	margin: 14rpx 24rpx 0;
	image {
		height: 350rpx;
		width: 100%;
		border-radius: 15rpx;
		//box-shadow: 0 0 12px #dddee1;
	}
	.current {
		width: 97%;
		height: 350rpx;
		margin: 1.5% 1.5%;
		transition: all 0.2s ease-in 0s;
	}
	.item {
		position: relative;
		.title {
			position: absolute;
			left: 0;
			bottom: 0;
			display: flex;
			justify-content: center;
			width: 100%;
			text {
				margin: 7% 6%;
				display: flex;
				align-items: center;
				//background-image: linear-gradient(to right, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
				//background-image: linear-gradient(90deg,rgba(255, 181, 19,.8),rgba(255, 181, 19,.2));
				color: #fff;
				display: -webkit-box;
				text-overflow: ellipsis;
				word-break: break-all;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				font-size: 34rpx;
				padding: 14rpx 20rpx;
				max-width: 610rpx;
				line-height: 1.3;
				border-radius: 5rpx;
			}
		}
	}
}

/*浮动navbar*/
.floatbar {
	//border-bottom: 1rpx solid #e8e8e8;
	box-shadow: 0px 2px 2px -2px #e8e8e8;
	padding-bottom: 12rpx;
}

/deep/ .no-data {
	margin-top: 200rpx;
}
</style>
