<template>
	<view class="rf-index">
		<!--搜索导航栏-->
		<!--#ifdef APP-PLUS-->
		<rf-search-bar @search="navToSearch" title="扫一扫" icon="iconsaomiao" :placeholder="hotSearchDefault"/>
		<!--#endif-->
		<!--顶部导航栏-->
		<scroll-view scroll-x class="index-cate" :style="{top: customBar +'px'}" v-if="isOpenIndexCate && categoryList.length > 0">
			<view v-for="(item, index) in categoryList" :key="index" class="index-cate-item" :class="tabCurrentIndex === index ? `text-${themeColor.name} active` : ''" @tap.stop="tabClick(index, item.id)">
				{{ item.name }}
			</view>
		</scroll-view>

		<view :class="isOpenIndexCate && categoryList.length > 0 ? 'main-wrapper' : ''">
			<block v-if="currentCate === 0">
				<!-- 顶部轮播图 -->
				<view class="swiper">
					<view class="swiper-box">
						<rf-swipe-dot :info="index_top" mode="nav" :current="current" field="name">
							<swiper @change="handleDotChange" autoplay="true">
								<swiper-item v-for="(item, index) in index_top" @tap="indexTopToDetailPage(item)" :key="index">
									<view class="swiper-item">
										<image :src="item.pic" mode="aspectFill" />
									</view>
								</swiper-item>
							</swiper>
						</rf-swipe-dot>
					</view>
				</view>
				<!-- 分类列表 -->
				<swiper
						:indicator-active-color="themeColor.color"
						indicator-color="#666"
						:indicator-dots="markingList.length > 10"
						:style="{height: markingList.length <= 5 ? '200rpx' : '560rpx'}"
						class="category-list-wrapper"
						v-if="markingList.length > 0">
						<swiper-item class="category-list">
							<view class="category" v-for="(sItem, sIndex) in markingList" :key="sIndex" @tap.stop="navToByStoreId(sItem.url)">
								<view class="img">
									<image :src="sItem.icon"></image>
								</view>
								<view class="text in1line">{{ sItem.title}}</view>
							</view>
						</swiper-item>
					</swiper>
				<!-- 首页子导航-非微信小程序 -->
				<!--#ifndef MP-WEIXIN-->
				<view class="sublist">
					<view
						class="box"
						v-for="tItem in subMenuList"
						:key="tItem.title"
						@tap.stop="navToByStoreId(tItem.url)"
						:style="{ background: tItem.color }"
					>
						<view style="display: flex">
							<image :src="tItem.icon" mode="widthFix"></image>
							<view class="text">{{ tItem.title }}</view>
						</view>
					</view>
				</view>
				<!--#endif-->
				<!-- 首页子导航-微信小程序 -->
				<!--#ifdef MP-WEIXIN-->
				<view class="sublist">
					<view v-if="tItem.url.indexOf('more') === -1"
						class="box"
						v-for="tItem in subMenuList"
						:key="tItem.title"
						@tap.stop="navToByStoreId(tItem.url)"
						:style="{ background: tItem.color }"
					>
						<view style="display: flex">
							<image :src="tItem.icon" mode="widthFix"></image>
							<view class="text">{{ tItem.title }}</view>
						</view>
					</view>

					<!--直接联系客服区-->
					<view class="pannel-header" style="padding-bottom:0px;padding-top:0px;width: 100%;display: flex">
						<button type="primary" open-type="contact" style="color:#888;flex: 1;font-size: 28rpx;height: 86rpx;line-height: 86rpx;background:#fff;margin-right: 20rpx">
							联系客服
						</button>
						<button type="primary" open-type="feedback" style="color:#888;flex: 1;font-size: 28rpx;height: 86rpx;line-height: 86rpx;background:#fff">
							意见反馈
						</button>
					</view>

				</view>
				<!--#endif-->
				<!--新闻通知-->
				<rf-swiper-slide v-if="noticeList.length > 0" :list="noticeList" class="rf-skeleton" @navTo="navToNotice">
					<view slot="header" class="swiper-slide-header">
						<text class="iconfont icongonggao" :class="'text-'+themeColor.name"></text>
					</view>
				</rf-swiper-slide>
				<view v-if="log" style="margin: 20px">
					{{log}}
				</view>
				<!-- 爆款推荐 -->
				<view class="hot-recommend">
					<view class="left">
						<image class="hot-recommend-image" @tap="navToByStoreId(hotRecommendList[0].url)" :src="hotRecommendList[0].icon"></image>
					</view>
					<view class="right">
						<image class="hot-recommend-image" @tap.stop="navToByStoreId(hotRecommendList[1].url)" :src="hotRecommendList[1].icon"></image>
						<image class="hot-recommend-image" @tap.stop="navToByStoreId(hotRecommendList[2].url)" :src="hotRecommendList[2].icon"></image>
					</view>
				</view>
				<view class="hot-recommend" style="padding-top: 0">
					<view class="left">
						<image class="hot-recommend-image" @tap="navToByStoreId(hotRecommendList[3].url)" :src="hotRecommendList[3].icon"></image>
					</view>
					<view class="right">
						<image class="hot-recommend-image" @tap.stop="navToByStoreId(hotRecommendList[4].url)" :src="hotRecommendList[4].icon"></image>
						<image class="hot-recommend-image" @tap.stop="navToByStoreId(hotRecommendList[5].url)" :src="hotRecommendList[5].icon"></image>
					</view>
				</view>
				<view class="hot-recommend">
					<view class="right" style="height: 200upx;">
						<image class="hot-recommend-image" style="height: 200upx;" @tap.stop="navToByStoreId(hotRecommendList[6].url)" :src="hotRecommendList[6].icon"></image>
					</view>
				</view>
				<!--论坛发帖-->
				<view style="text-align: center;margin-top: 10px;margin-bottom: 20px">
					<text style="text-align: center;font-weight: bold;font-size: 18px">论坛发帖</text>
				</view>
				<view class="list" style="padding: 0 10px;width: 100%">
					<view
						class="article-box"
						v-for="tItem in articleList"
						:key="tItem.title"
						@tap.stop="navToArticel(tItem.id)"
					>
						<block>
							<image :src="tItem.image"></image>
							<view class="article-nav">
								<view class="article-nav-item">{{ tItem.title }}</view></view>
						</block>
					</view>
				</view>
				<view style="height: 10px;background: #f8f8f8;"></view>
				<!--热门商品-->
				<view style="text-align: center;margin-top: 10px;margin-bottom: 20px">
					<text style="text-align: center;font-weight: bold;font-size: 18px">热门机型</text>
				</view>
				<view class="list">
					<view
						class="box"
						v-for="tItem in hotList"
						:key="tItem.title"
						@tap.stop="navToEqupmentList(tItem.url)"
					>
						<block>
							<image :src="tItem.icon"></image>
							<view class="text">{{ tItem.title }}</view>
						</block>

					</view>
				</view>
				<view style="height: 10px;background: #f8f8f8;"></view>
				<view class="navbar" style="margin-bottom: 10px;box-shadow: 0 0 white;">
					<view class="nav-item" :class="{ current: filterIndex === 0 }" @click="productTabClick(0)">最新设备</view>
					<view class="nav-item" :class="{ current: filterIndex === 1 }" @click="productTabClick(1)">平台车源</view>
					<view class="nav-item" :class="{ current: filterIndex === 2 }" @click="productTabClick(2)">个人车源</view>
				</view>
				<jxb-equipment-list :bottom="0" :list="productList" isList></jxb-equipment-list>
				<rf-load-more
					class="load-more"
					:status="loadingType"
					v-if="productList.length > 0"
				></rf-load-more>
				<!--网站备案号-->
				<!--#ifdef H5-->
				<view class="copyright" v-if="config.web_site_icp">
					{{ config.copyright_desc }}
					<a href="http://www.beian.miit.gov.cn">{{ config.web_site_icp }}</a>
				</view>
				<!-- #endif -->
			</block>
			<view v-else class="index-cate-product-list">
				<rf-product-list :bottom="bottom" :list="categoryProductList"></rf-product-list>
				<rf-load-more
					:status="loadingType"
					v-if="categoryProductList.length > 0"
				></rf-load-more>
				<rf-empty
					:bottom="bottom"
					:info="'暂无该分类产品~'"
					v-if="categoryProductList.length === 0 && !productLoading"
				></rf-empty>
			</view>
		</view>
		<tui-modal :show="gpsModal" @click="agreeGps" :button="modalButton" title="权限申请" content="获取您的定位，以便为您推荐周边职位、机手或设备"></tui-modal>
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<rf-back-home></rf-back-home>
		<rf-back-top :scrollTop="scrollTop"></rf-back-top>
		<!--提示升级界面-->
		<!--#ifdef APP-PLUS-->
		<zy-update theme="green" :h5preview="true" :oldversion="version" :appstoreflag="true" :updateurl="update_url" autocheckupdate></zy-update>
		<!--#endif-->

	</view>
</template>
<script>
/**
 * @des 微商城首页
 *
 * @author stav stavyan@qq.com
 * @date 2020-01-08 14:14
 * @copyright 2019
 */
import {
	indexList
} from '@/api/product';
import { productList} from '@/api/equipment';
import {
	bannerList,
	homeRecommendSubject,
	homeRecommendProduct,
	homeBrand,noticeList,typeList,
	homeNewProduct} from '@/api/sms';
import rfSwipeDot from '@/components/rf-swipe-dot';
import rfFloorIndex from '@/components/rf-floor-index';
import rfFloorPIndex from '@/components/rf-floor-p-index';
import rfSearchBar from '@/components/rf-search-bar';
import rfSwiperSlide from '@/components/rf-swiper-slide';
import rfProductList from '@/components/rf-product-list';
import jxbEquipmentList from '@/components/jxb-equipment-list';
import ZyUpdate from '@/components/zy-upgrade/zy-upgrade.vue'
import { mapMutations } from 'vuex';
export default {
	components: {
		rfFloorIndex,rfFloorPIndex,
		rfSwipeDot,
		rfProductList,
		rfSearchBar,
		rfSwiperSlide,
		jxbEquipmentList,
		ZyUpdate
	},
	data() {
		return {
			hideFunction:"0",
			update_url:'',
			version:'1.0.0',
			sort: 'hot',
			filterIndex: 0,//产品tab索引
			current: 0, // 轮播图index
			carouselList: {}, // 广告图
			index_hot: [], // 广告图
			index_new: [], // 广告图
			index_recommend: [], // 广告图
			index_top: [], // 顶部轮播图
			hotProductList: [], // 热门商品列表
			brandList:[],
			articleList:[],//文章列表
			recommendProductList: [], // 推荐商品列表
			guessYouLikeProductList: [], // 猜您喜欢商品列表
			newProductList: [], // 新品上市商品列表
			productCateList: [], // 商品栏目
			markingList: [],
			subMenuList: this.$mConstDataConfig.subMenuList,
			hotList: this.$mConstDataConfig.hotList,
			config: {}, // 商户配置
			noticeList: [], // 公告列表
			share: {},
			loading: true,
			scrollTop: 0,
			kefuShow: true,
			loadingType: 'more',
			hotSearchDefault: '请输入关键字',
			newsBg: this.$mAssetsPath.newsBg,
			errorImage: this.$mAssetsPath.errorImage,
			appName: this.$mSettingConfig.appName,
			tabCurrentIndex: 0,
			categoryList: [], // 分类列表
			categoryProductList: [], // 分类列表
			pageNum :0,
			currentCate: 0,
      hotRecommendList: this.$mConstDataConfig.hotRecommendList,
			productLoading: true,
			customBar: this.CustomBar,
			isOpenIndexCate: this.$mSettingConfig.isOpenIndexCate,
			moneySymbol: this.moneySymbol,
			productList:[],
			productParams: {},
			log:'',
			gpsModal:false,
			showPhoneModal:false,
			modalButton:[
				{
					text: '取消',
					type: 'gray',
					plain: true //是否空心
				},
				{
					text: '允许',
					type: 'primary',
					plain: false
				}]

		};
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onShow() {
		// 初始化购物车数量
		this.setCartNum(uni.getStorageSync('cartNum'));
	},
	onLoad() {

		// #ifdef APP-PLUS
		// eslint-disable-next-line
		let type = 1;
		if (plus.os.name === 'iOS') {
			type = 2;
		}
		this.version = `${plus.runtime.version}`;
		this.update_url = 'https://web.jxbcn.com/api-web/system/version/check?code=' +`${plus.runtime.version}` + '&type='+type;
		// #endif
		//判断第一次，弹出定位权限申请
		if(!uni.getStorageSync("firstGpsModalHasShow")){
			this.gpsModal = true;
		}

		uni.setTabBarStyle({
			selectedColor: this.themeColor.color,
			borderStyle: 'white'
		});
		this.themeColor.tabList && this.themeColor.tabList.forEach((selectedIconPath, index) => {
			uni.setTabBarItem({
				index,
				selectedIconPath
			});
		});
		this.initData();
	},
	computed: {
		// 计算倒计时时间
		second() {
			return function(val) {
				return Math.floor(15 * 60 - (new Date() / 1000 - val));
			};
		},
		bottom () {
			let bottom = 0;
			/*  #ifdef H5  */
      bottom = 90;
			/*  #endif */
			return bottom;
		},
		swipeCateList() {
			const list = this.brandList;
			let result = [];
			for (let i = 0, len = list.length; i < len; i += 10) {
				result.push(list.slice(i, i + 10));
			}
			console.log(result)
			return result;
		}
	},
	onShareAppMessage() {
    let shareParams = { title: this.share.share_title || `欢迎来到${this.appName}`, path: '/pages/index/index' };
    return shareParams;
	},
	filters: {
		filterDiscountPrice(val) {
			const price = val.product && (val.product.price * val.discount) / 100;
			switch (val.decimal_reservation_number) {
				case 0:
					return (Math.floor(price * 100) / 100).toFixed(2);
				case 1:
					return (Math.floor(price * 100) / 100).toFixed(0);
				case 2:
					return (Math.floor(price * 100) / 100).toFixed(1);
				default:
					return (Math.floor(price * 100) / 100).toFixed(2);
			}
		},
		filterTotalSales(val) {
			if (val > 10000) {
				val = `${(val / 10000).toFixed(2)}w`;
			}
			return val;
		}
	},
	// 下拉刷新
	onPullDownRefresh() {
		let dbLog = uni.getStorageSync("log");
		this.log = dbLog;
		this.pageNum = 0;
		this.productList.length = 0;
		this.getProductList('refresh', {});
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingType === 'nomore') return;
		this.pageNum++
		this.getProductList();
	},
	methods: {

		agreeGps(e){
			let index = e.index;
			if (index === 0) {
			} else {
				this.jxb.getNearestRegion();
				this.jxb.getGps();
			}
			this.gpsModal = false;
			uni.setStorageSync("firstGpsModalHasShow","1");
		},
		//筛选点击
		productTabClick(index) {
			this.pageNum = 0;
			this.filterIndex = index
			if (index === 0) {
				this.productParams.orderBys=5
				this.productParams.source = "";
				delete this.productParams.source;
			} else if (index === 1) {
				this.productParams.source = 1;
			} else {
				this.productParams.source = 0;
			}
			this.getProductList('refresh')
			// uni.pageScrollTo({
			// 	duration: 300,
			// 	scrollTop: 0
			// });
		},
		// 顶部tab点击
		tabClick(index, id) {
			this.currentCate = id;
			this.tabCurrentIndex = index;
			if (id === 0) return;
			this.loading = true;
			this.pageNum = 0;
			this.productLoading = true;
			this.categoryProductList = [];
			this.getProductList();
		},
		// 获取产品列表
		async getProductList(type) {
			await this.$http.get(`${productList}`, {params:{
				...this.productParams,
				pageNum: this.pageNum
			}}).then(async r => {
				console.log(r)
				this.loading = false;
				if (type === 'refresh') {
					this.productList = [];
					uni.stopPullDownRefresh();
				}
				console.log(r)
				if(r.list){
					this.loadingType = r.list.length === 10 ? 'more' : 'nomore';
					this.productList = [...this.productList, ...r.list];
				}
			}).catch(err => {
				this.errorInfo = err;
				this.loading = false;
				if (type === 'refresh') {
					uni.stopPullDownRefresh();
				}
			});
		},
		...mapMutations(['setCartNum']),
		// 监听轮播图切换
		handleDotChange(e) {
			this.current = e.detail.current;
		},
		// 数据初始化
		async initData() {
			this.getSysConfig();
			// 设置购物车数量角标
			this.getBannerList();
			this.getnoticeList();
			this.getTypeList();
		//	this.getBrandList();
			this.loading = false;
			this.getHotProductList();
			this.getRecommendProductList();
		//	this.getIndexList();
		// 	this.getNewProductList();
			this.getProductList();
			// this.initCartItemCount();
			this.getArticleList();



		},
		// 设置购物车数量角标
		async initCartItemCount() {
			if (
				this.$mStore.getters.hasLogin &&
				parseInt(uni.getStorageSync('cartNum'), 10) > 0
			) {
				uni.setTabBarBadge({
					index: this.$mConstDataConfig.cartIndex,
					text: uni.getStorageSync('cartNum').toString()
				});
			} else {
				uni.removeStorageSync('cartNum');
				uni.removeTabBarBadge({ index: this.$mConstDataConfig.cartIndex });
			}
		},
		// 通用跳转
		navToNotice(id) {
			this.$mRouter.push({ route: `/pages/index/notice/detail?id=${id}` });
		},
		// 通用跳转
		navTo(route) {
			this.$mRouter.push({ route });
		},
		// 通用跳转Tab
		navToEqupmentList(id) {
			uni.setStorageSync('firstCateId',id);
			this.$mRouter.push({ route: `/list` });

		},
		// 通用跳转Tab
		navToTab(route) {
			uni.switchTab({
				url: route
			});
		},
		navToByStoreId(route) {
			if(route.indexOf("tab") !== -1 ){
				this.navToTab(route);
			}else if(route.indexOf("more") !== -1 ){
				uni.showToast({
					title: `功能正在加紧开发中，敬请期待！`,
					icon: 'none'
				})
			}else{
				this.navTo(route);
			}
		},
		// 跳转至分类模块
		navToCategory(id) {
			if (this.$mSettingConfig.appCateType === '2') {
        uni.setStorageSync('indexToCateId', id);
        this.$mRouter.reLaunch({ route: '/pages/category/category' });
			} else {
        this.navTo(`/pages/product/list?cate_id=${id}`);
			}
		},
		// 通用跳转
		navToArticel(id) {
			this.navTo(`/pages/article/detail?id=${id}`);
		},
		// 通用跳转
		navToSearch() {
			this.$mRouter.push({
				route: `/pages/index/search/search?data=${JSON.stringify(this.search)}`
			});
		},
		// 跳至广告图指定页面
		indexTopToDetailPage(item) {
			var url = item.url
    	 	this.navTo(url);
		//	this.$mHelper.handleBannerNavTo(item.jump_type, item.jump_link, item.id);
		},
		// 获取主页数据
		async getIndexList(type) {
			await this.$http
				.get(`${indexList}`, {})
				.then(async r => {
					uni.setNavigationBarTitle({ title: this.appName });
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					// 首页参数赋值
					this.initIndexData(r);
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		// 首页参数赋值
		initIndexData(data) {
			this.noticeList = data.announce || [];
			this.productCateList = data.cate;
			this.categoryList = [{ id: 0, title: '首页' }, ...this.productCateList];
		//	this.carouselList = data.adv;

			//this.search = data.search;
			this.share = data.share;
			uni.setStorageSync('search', this.search);
			this.hotSearchDefault = data.search.hot_search_default || '请输入关键字';
			uni.setStorage({
				key: 'hotSearchDefault',
				data: data.search.hot_search_default
			});
		//	this.hotProductList = data.product_hot;

			//this.recommendProductList = data.product_recommend;
			this.guessYouLikeProductList = data.guess_you_like;
			this.newProductList = data.product_new;
			this.config = data.config;
			this.$mHelper.handleWxH5Share(this.share.share_title || this.appName, this.share.share_desc || `欢迎来到${this.appName}商城`, this.share.share_link || this.$mConfig.hostUrl, this.share.share_cover || this.$mSettingConfig.appLogo);
		},
		// 公告列表
		async getSysConfig() {
			let res = await this.$http.apiCall('get', '/system/config/list', {});
			console.log("获取的系统配置："+JSON.stringify(res))
			if(res){
				this.$mHelper.saveSysConfig(res);
				this.hideFunction = this.$mHelper.getSysConfg("hide_function");
			}
			if(this.hideFunction === "1"){
				for (let i = 0; i < this.$mConstDataConfig.markingList.length; i++) {
					let item = this.$mConstDataConfig.markingList[i];
					if(item.title.indexOf("招聘") === -1 && item.title.indexOf("求职") === -1){
						this.markingList.push(item)
					}
				}
			}else{
				this.markingList = this.$mConstDataConfig.markingList;
			}
		},
		// 推荐品牌
		async getBrandList() {
			await this.$http.get(`${homeBrand}`,{params:{storeId:0}}).then(r => {
				this.brandList = r;
			});
		},
		//获取首页论坛文章列表
		async getArticleList() {
			await this.$http.get(`/article/home`,{}).then(res => {
				this.articleList = res;
			});
		},
    // 属性类别
		async getTypeList() {
			await this.$http.get(`${typeList}`).then(r => {
				this.productCateList = r;
				this.categoryList = [{ id: 0, name: '首页' }, ...this.productCateList];
			});
		},
		// 轮播图列表 1 轮播图 2 新品推荐广告 3 人气推荐广告 4热门推荐广告 5 分类广告
		async getBannerList() {
			await this.$http.get(`${bannerList}`,{params:{storeId:0}}).then(r => {
				r.forEach((item, index) => {
					if (item.orderCount === 1) {
							this.index_top.push(item)
					}else if (item.orderCount === 2) {
						this.index_new.push(item)
					}else if (item.orderCount === 3) {
						this.index_recommend.push(item)
					}else if (item.orderCount === 4) {
						this.index_hot.push(item)
					}
				})
			});
		},

    // 公告列表
    async getnoticeList() {
			let res = await this.$http.apiCall('get', '/notice/list', {});
			if(res){
				this.noticeList = res;
			}
		},
		// 热门商品列表
		async getHotProductList() {
			await this.$http.get(`${homeNewProduct}`,{params:{storeId:0}}).then(r => {
				this.hotProductList = r;
			});
		},
    // 推荐商品列表
		async getRecommendProductList() {
			await this.$http.get(`${homeRecommendProduct}`,{params:{storeId:0}}).then(r => {
				this.recommendProductList = r;
			});
		},

    // 猜您喜欢商品列表
		async getNewProductList(type) {
			console.log('获取商品列表')
			await this.$http
				.get(`${productList}`, {params:{
					...this.productParams,
					pageNum: this.pageNum
				}})
				.then(async r => {
				console.log(r)
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
					console.log(r)
					if(r.list){
						this.loadingType = r.list.length === 10 ? 'more' : 'nomore';
						this.guessYouLikeProductList = [...this.guessYouLikeProductList, ...r.list];
					}

				})
				.catch(err => {
					this.errorInfo = err;
					this.loading = false;
					if (type === 'refresh') {
						uni.stopPullDownRefresh();
					}
				});
		},
		// 跳转至商品详情页
		navToDetailPage(data) {
			const { id } = data;
			if (!id) return;
			this.$mRouter.push({ route: `/pages/product/product?id=${id}` });
		},
		// 跳转至分类页
		toCategory() {
			this.$mRouter.switchTab({ route: '/pages/category/category' });
		}
	}
};
</script>
<style lang="scss">
page {
	background-color: $page-color-base;
}
.rf-index {
	background-color: $color-white;
	/*爆款拼团*/
	.wrapper {
		border-radius: 10upx;
		.h-list {
			background-color: $page-color-base;
			white-space: nowrap;
			padding: 0 $spacing-sm;
			.h-item {
				margin: $spacing-sm $spacing-sm $spacing-sm 0;
				display: inline-block;
				background-color: $color-white;
				font-size: $font-sm;
				width: 280upx;
				border-radius: 6upx;
				.h-item-img {
					display: inline-block;
					width: 280upx;
					height: 300upx;
					border-top-left-radius: 12upx;
					border-top-right-radius: 12upx;
					border-bottom: 1upx solid rgba(0, 0, 0, 0.01);
				}
				.title {
					width: 280upx;
					white-space : normal;
					height: 60upx;
					line-height: 30upx;
					font-size: $font-sm;
					padding: 0 $spacing-sm;
					margin: $spacing-sm 0;
				}
				.last-line {
					padding: 0 $spacing-sm $spacing-base;
					margin-bottom: 5upx;
					display: flex;
					justify-content: space-between;
					align-items: center; /* 垂直居中 */
					.red {
						font-size: $font-sm;
						margin-right: 4upx;
					}
				}
				.price {
					font-size: $font-base - 2upx;
					line-height: 1;
					.m-price {
						margin-left: 8upx;
						color: $font-color-light;
						font-size: $font-sm;
						text-decoration: line-through;
					}
				}
			}
		}
	}
	/*轮播图*/
	.swiper {
		width: 100%;
		margin-bottom: 20upx;
		display: flex;
		justify-content: center;
		.swiper-box {
			width: 92%;
			height: 40vw;
			overflow: hidden;
			border-radius: 15upx;
			box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			//兼容ios，微信小程序
			position: relative;
			z-index: 1;
			swiper {
				width: 100%;
				height: 40vw;
				swiper-item {
					image {
						width: 100%;
						height: 40vw;
					}
				}
			}
		}
	}
  /* 爆款推荐 */
  .hot-recommend {
		background-color: $color-white;
    display: flex;
    padding: $spacing-base $spacing-lg 0;
    .hot-recommend-image {
      width: 100%;
      height: 100%;
    }
    .left {
      flex: 3;
      height: 290upx;
      margin-right: 15upx;
    }
    .right {
      flex: 4;
      .hot-recommend-image {
        height: 140upx;
      }
    }
  }
	/*轮播图2*/
	.swiper-item-text {
		position: absolute;
		bottom: 16upx;
		left: 30upx;
		height: 48upx;
		line-height: 48upx;
		background: rgba(0, 0, 0, 0.2);
		width: 90%;
		color: $color-white;
		border-bottom-left-radius: 12upx;
		padding-left: 20upx;
	}
	/*新闻通知*/
	.swiper-slide-header {
		.picfont {
			font-size: $font-lg + 8upx;
			font-weight: 600;
		}
	}
	/*分类列表*/
	.category-list-wrapper {
		.category-list {
			width: 100%;
			padding: $spacing-base;
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.category {
				margin-top: 10upx;
				width: calc(20% - 20upx);
				height: 132upx;
				display: flex;
				text-align: center;
				flex-wrap: wrap;
				.img {
					width: 100%;
					display: flex;
					justify-content: center;
					image {
						width: 12vw;
						height: 12vw;
						border-radius: 50%;
					}
				}
				.text {
					margin-top: 16upx;
					width: 100%;
					display: flex;
					justify-content: center;
					font-size: 24upx;
					color: #3c3c3c;
				}
			}
		}
	}
	/*版权显示*/
	.copyright {
		margin: 10upx 0;
		width: 100%;
		text-align: center;
		color: #666;

		a {
			display: block;
			color: #666;
			text-decoration: none;
		}
	}
	/*限时抢购*/
	.order-item {
		display: flex;
		flex-direction: column;
		background: #fff;
		padding: 0 30upx;
		margin-bottom: 20upx;

		.goods-box-single {
			display: flex;
			padding: 40upx 10upx 10upx;
			height: 330upx;
			border-radius: 12upx;
			margin-top: 20upx;
			box-shadow: 2px 2px 10px rgba(66, 135, 193, 0.2); // 阴影
			border-bottom: 1px solid rgba(0, 0, 0, 0.05); // 边框
			position: relative;

			.goods-img {
				display: block;
				border-radius: 12upx;
				width: 190upx;
				height: 200upx;
			}

			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding: 0 30upx 0 24upx;
				overflow: hidden;

				.title {
					font-weight: bold;
					line-height: 1.2;
					margin: 10upx 0;
				}

				.attr-box {
					line-height: 1.2;
					margin-bottom: 8upx;
					margin-left: 10upx;
				}

				.last-line {
					margin-top: 3upx;
					display: flex;
					justify-content: space-between;
					align-items: center; /* 垂直居中 */
					.red {
						margin-right: 4upx;
					}
				}

				.price {
					font-size: $font-lg;
					line-height: 1;
					.m-price {
						margin-left: 8upx;
						color: $font-color-light;
						font-size: $font-sm;
						text-decoration: line-through;
					}
				}

				.triangle-wrapper {
					position: absolute;
					overflow: hidden;
					top: 0;
					right: 0;
					border-radius: 12upx;

					.triangle {
						color: #5eba8f;
						width: 0;
						height: 0;
						border-top: 120upx solid;
						opacity: 0.8;
						border-left: 120upx solid transparent;
					}

					.triangle-content {
						position: absolute;
						top: 28upx;
						right: 0;
						transform: rotate(45deg);
						font-size: $font-sm - 2upx;
						color: #fff;
					}
				}
			}
		}

		.action-box {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			height: 90upx;
			position: relative;

			.discount-time {
				font-size: $font-sm;
				color: $uni-color-success;
				margin-right: 20upx;
			}
		}
	}
	.index-cate {
		white-space: nowrap;
		z-index: 10;
		background-color: $color-white;
		/*#ifndef MP*/
		position: fixed;
		/*#endif*/
		margin-bottom: $spacing-sm;
		.index-cate-item {
			display: inline-block;
			height: 75upx;
			line-height: 75upx;
			margin: 0 15upx;
			text-align: center;
			width: 120upx;
			font-size: $font-base;
		}
		.active {
			font-weight: 500;
			border-bottom: 2px solid;
		}
	}
	.main-wrapper {
		margin-top: 85upx;
		/*#ifdef MP*/
		margin-top: 0;
		/*#endif*/
	}
	.index-cate-product-list {
		padding-top: $spacing-sm;
		background-color: $page-color-base;
		.no-data {
			margin: 48upx 0;
			color: $font-color-light;
			display: flex;
			justify-content: center;
			align-items: center;
			.picfont {
				margin-right: 20upx;
			font-size: $font-lg + 16upx;
			}
		}
	}
}
.sublist {
	padding: 0 10px;
	margin-top: $spacing-base;
	margin-bottom: $spacing-base;
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	.box {
		border-radius: 30px;
		width: calc(100vw / 3.2);
		height: 40px;
		margin-bottom: $spacing-lg;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		image {
			width: 20px;
		}
		.text {
			width: 100%;
			display: flex;
			justify-content: center;
			font-size: 24upx;
		}
	}
}
.list {
	margin-top: $spacing-base;
	margin-bottom: $spacing-base;
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	.box {
		width: calc(100vw / 3);
		margin-bottom: $spacing-lg;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		image {
			width: 64%;
			height: calc(100vw / 3 * 0.64);
		}
		.text {
			margin-top: 8upx;
			width: 100%;
			display: flex;
			justify-content: center;
			font-size: 26upx;
		}
		.category-tag {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: $spacing-sm;
			font-size: $font-sm + 2upx;
			margin-right: $spacing-base;
			color: $font-color-dark;
			background-color: $page-color-base;
			border-radius: 6upx;
		}
	}
	.article-box {
		width: calc((100vw - 20px) / 3);
		margin-bottom: $spacing-lg;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		padding: 0 5px;
		position: relative;
		image {
			border-radius:6px;
			width: 100%;
			height: calc(100vw / 3 * 0.7);
		}
		.text {
			margin-top: 8upx;
			width: 100%;
			display: flex;
			justify-content: center;
			font-size: 26upx;
		}
		.category-tag {
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: $spacing-sm;
			font-size: $font-sm + 2upx;
			margin-right: $spacing-base;
			color: $font-color-dark;
			background-color: $page-color-base;
			border-radius: 6upx;
		}
	}
}
.article-nav {
	width: calc((100vw - 50px) / 3);
	position: absolute;
	bottom: 0;
	height: 40rpx;
	justify-content: flex-start;
	background: rgba(0, 0, 0, 0.4);
	box-sizing: box-sizing;
	overflow: hidden;
	border-radius: 0 0 6px 6px;
}

.article-nav-item {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 22rpx;
	color: #fff;
	box-sizing: box-sizing;
	margin: 4rpx 12rpx;
}
// navBar样式
.navbar {
	display: flex;
	height: 40px;
	padding: 0 5px;
	background: #fff;
	box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
	position: relative;
	z-index: 0;
	.nav-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;
		font-size: 15px;
		position: relative;
		&.current {
			color: #0081ff;
			font-weight: bold;
			&:after {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
				width: 44px;
				height: 0;
				border-bottom: 2px solid;
			}
		}
	}
}

</style>
