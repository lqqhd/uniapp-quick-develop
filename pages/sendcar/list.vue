<template>
	<view class="container product-list">
		<view class="rf-header-box">
			<view class="rf-header" :style="{width:width+'px',height:height+'px'}">
				<view class="rf-back" :style="{marginTop:arrowTop+'px'}" @tap="back">
					<text class="iconfont iconzuo"></text>
				</view>
				<view class="input-box" :style="{marginTop:inputTop+'px'}">
					<input
						v-model="keyword"
						@confirm="search"
						placeholder="请输入关键字"
						placeholder-style="font-size: 24upx; color:#ccc;"
						type="text" />
					<text class="icon iconfont iconsousuo2" @tap.stop="search"></text>
				</view>
			</view>
		</view>
		<uni-header-selecter :menuTop="inputTop+height+30" :filterData="filterData" :defaultSelected ="defaultSelected"  :updateMenuName="true" @confirm="confirm" dataFormat="Object"></uni-header-selecter>
<!--		<view class="rf-header-screen" :style="{top:80+'px'}">-->
<!--			<view class="rf-screen-bottom">-->
<!--				<block v-for="(item,index) in attrArr" :key="index">-->
<!--					<view class="rf-bottom-item rf-icon-ml" :class="[item.isActive ? `bg-${themeColor.name} rf-btmItem-active` : 'rf-btmItem-normal',attrIndex==index?'rf-btmItem-tap':'']" :data-index="index" @tap="btnDropChange">-->
<!--						<view class="rf-bottom-text" :class="[attrIndex==index?'rf-active':'']">{{item.isActive?item.selectedName:item.name}}</view>-->
<!--						<text class="iconfont" :class="attrIndex==index?'iconshang':'iconxia'" :size="14" :color="attrIndex==index || item.isActive?'$base-color':'#444'" rf-icon-class="rf-ml" v-if="item.list.length>0"></text>-->
<!--					</view>-->
<!--				</block>-->
<!--			</view>-->
<!--		</view>-->
		<view class="product-list-wrapper">
				<jxb-equipment-list isSendcar :bottom="0" :list="productList" :isList="isList" :style="{paddingTop: dropScreenH+10 + 'upx' }"></jxb-equipment-list>
		</view>
		<rf-load-more
			:status="loadingType"
			v-if="productList.length > 0"
		></rf-load-more>
		<rf-empty
			:info="errorInfo || '该分类暂无商品'"
			v-if="productList.length === 0 && !loading"
		></rf-empty>

		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<rf-float-img></rf-float-img>
	</view>
</template>
<script>
	import rfTopDrawer from '@/components/rf-top-drawer';
	import jxbEquipmentList from '@/components/jxb-equipment-list';
	import rfLoadMore from '@/components/rf-load-more/rf-load-more';
	import { productDetail, productList, productCate, brandIndex } from '@/api/equipment';
	import { mapMutations } from 'vuex';
	import rfPickRegionsAll from '@/components/rf-pick-regions-all';
	import rfFloatImg from '@/components/rf-float-img';
	/* eslint-disable */
	export default {
		components: {
			jxbEquipmentList,
			rfLoadMore,
			rfTopDrawer,
			rfPickRegionsAll,
			rfFloatImg
		},
		filters: {
			filterTotalSales (val) {
				if (val > 10000) {
					val = `${(val / 10000).toFixed(2)}w`;
				}
				return val;
			}
		},
		data() {
			return {
				indexArr:'',
				valueArr:'',
				defaultSelected:[],
				filterData:[],
				addressData: {
					provinceId: '',
					cityId: '',
					countryId: ''
				},
			  keyword: '',
			  errorInfo: '',
				loadingType: 'more',
				pageNum :0,
				loading: true,
				specClass: 'none',
				productDetail: {},
				searchKey: "", //搜索关键词
				width: 200, //header宽度
				height: 64, //header高度
				inputTop: 0, //搜索框距离顶部距离
				arrowTop: 0, //箭头距离顶部距离
				dropScreenH: 0, //下拉筛选框距顶部距离
				attrData: [],
				attrIndex: -1,
				dropScreenShow: false,
				scrollTop: 0,
				tabIndex: 0, //顶部筛选索引
				isList: true, //是否以列表展示  | 列表或大图
				drawer: false,
				drawerH: 0, //抽屉内部scrollview高度
				selectedName: "挖掘机",
				selectH: 0,
				attrArr: [{
					name: "全部",
					selectedName: "全部",
					isActive: false,
					params: {},
					list: []
				}, {
					name: "新品",
					selectedName: "新品",
					isActive: false,
					params: { is_new: 1 },
					list: []
				}, {
					name: "推荐",
					selectedName: "推荐",
					isActive: false,
					params: { is_recommend: 1 },
					list: []
				}, {
					name: "热门",
					selectedName: "热门",
					isActive: false,
					params: { is_hot: 1 },
					list: []
				}],
				productList: [
				],
				pageIndex: 1,
				productCateList: [],
				brandList: [],
				minPrice: '',
				maxPrice: '',
				productParams: {}
			}
		},
		onLoad(options) {
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif
			uni.getSystemInfo({
				success: (res) => {
					this.width = obj.left || res.windowWidth;
					this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
					this.inputTop = obj.top ? (obj.top + (obj.height - 30) / 2) : (res.statusBarHeight + 7);
					this.arrowTop = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
					this.searchKey = options.searchKey || "";
					//略小，避免误差带来的影响
					this.dropScreenH = this.height * 750 / res.windowWidth + 80;
					this.drawerH = res.windowHeight - uni.upx2px(100) - this.height
				}
			});
			this.initData(options);
		},
		// 下拉刷新
		onPullDownRefresh() {
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
      ...mapMutations(['setCartNum']),
			// 初始化数据
			initData(options) {
				this.getProductCate();
			  let params = {};
				if (options.param) {
				  params = { ...params, ...JSON.parse(options.param) }
				}
				if (options.keyword) {
					this.keyword = options.keyword;
					params.name = options.keyword;
				}
				this.productParams = params;
				this.getProductList();
			},
			// 获取选择的地区
			handleGetRegions(e) {
				console.log(e)
				this.addressData.provinceId = e.provinceId;
				this.addressData.cityId = e.cityId;
				this.addressData.countryId = e.countryId;

				this.productParams.provinceId = e.provinceId;
				this.productParams.cityId = e.cityId;
				this.productParams.countryId = e.countryId;
				this.search();
			},
			//接收菜单结果事件
			confirm(e){
				this.indexArr = e.index;
				this.valueArr = e.value;
				//机型-品牌
				if(this.isNotNull(e.value[0][0])){
					this.productParams.firstCateId = e.value[0][0];
				}else{
					delete this.productParams.firstCateId;
				}
				if(this.isNotNull(e.value[0][1])){
					this.productParams.secondCateId = e.value[0][1];
				}else{
					delete this.productParams.secondCateId;
				}
				//价格，格式：20-30
				if(this.isNotNull(e.value[1][0][0])){
					this.productParams.minPrice = e.value[1][0][0].split("-")[0];
					this.productParams.maxPrice = e.value[1][0][0].split("-")[1];
				}else{
					delete this.productParams.minPrice;
					delete this.productParams.maxPrice;
				}
				//排序
				this.productParams.orderBys = e.value[2][0]?e.value[2][0]:0;
				//设备来源
				if(this.isNotNull(e.value[3][0][0])){
					this.productParams.source = e.value[3][0][0];
				}else{
					delete this.productParams.source;
				}
				//表显小时数
				if(e.value[3][1][0]){
					this.productParams.minUsedHours = e.value[3][1][0].split("-")[0];
					this.productParams.maxUsedHours = e.value[3][1][0].split("-")[1];
				}else{
					this.productParams.minUsedHours = 0;
					this.productParams.maxUsedHours = 999999;
				}
				//发布时间
				if(this.isNotNull(e.value[3][2][0])){
					this.productParams.publishDays = e.value[3][2][0];
				}else{
					delete this.productParams.publishDays;
				}
				this.search();
			},
			isNotNull(e){
				return e !== null && e !== "" && e !== undefined;
			},
			// 获取产品详情
			async getProductDetail(row) {
				await this.$http.get(`${productDetail}`, {params:{id: row.id}}).then(async r => {
						this.productDetail = r;
						this.productDetail.sku_name = row.sku_name;
						this.specClass = 'show';
					});
			},
			px(num) {
				return uni.upx2px(num) + "px"
			},
			btnDropChange(e) {
				let index = parseInt(e.currentTarget.dataset.index, 10);
				let arr = JSON.parse(JSON.stringify(this.attrArr[index].list));
				if (arr.length === 0) {
					this.$set(this.attrArr[index], "isActive", !this.attrArr[index].isActive)
				  if (this.attrArr[index].isActive && index === 0) {
				    this.attrArr[1].isActive = false;
				    this.attrArr[2].isActive = false;
				    this.attrArr[3].isActive = false;
				  }
					if (this.attrArr[1].isActive || this.attrArr[2].isActive || this.attrArr[3].isActive) {
				    this.attrArr[0].isActive = false;
				  }
				} else {
					this.attrData = arr;
					this.attrIndex = index;
					this.dropScreenShow = true;
					this.$set(this.attrArr[index], "isActive", false);
					this.scrollTop = 1;
					this.$nextTick(() => {
						this.scrollTop = 0
					});
				}
				let params = {
					type:2
				};
				if (this.attrArr[0].isActive) {
					params = {};
				} else {
					params.name = this.keyword;
				}
				this.attrArr.forEach(item => {
					if (item.isActive) {
						params = {...params, ...item.params }
					}
				});
				this.pageNum = 0;
				this.productList = [];
				this.loading = true;
				this.productParams = params;
				this.getProductList();
			},
			closeDrawer() {
				this.drawer = false;
			  const params = {};
			  if (this.maxPrice) {
			    params.maxPrice = this.maxPrice;
			  }
			  if (this.minPrice) {
			    params.minPrice = this.minPrice;
			  }
			  const brandArr = [];
			  this.brandList.forEach(item => {
				  if (item.isActive) {
					    brandArr.push(item.id);
					  }
			  });
			  if (brandArr.join(',')) {
			    params.brandIds = brandArr.join(',');
			  }
			  const cateArr = [];
			  this.productCateList.forEach(item => {
				  if (item.isActive) {
					    cateArr.push(item.id);
					  }
			  });
			  if (cateArr.join(',')) {
			    params.typeIds = cateArr.join(',');
			  }
				this.pageNum = 0;
				this.productList = [];
				this.loading = true;
				this.productParams = params;
				this.getProductList();
			},
			// 获取商品分类列表
			async getProductCate() {
				await this.$http.get(`${productCate}`).then(r => {
					this.productCateList = r;
					let data = [{
							"name":'机型品牌',
							"type": 'hierarchy',
							"submenu": this.productCateList
						},{
							"name": "价格",
							"type": 'radio',
							"submenu": [{
								"name": "  ",
								"type": 'radio',
								"submenu": [
									{
									"name": "不限",
									"value": "0-10000"
									},
									{
											"name": "0-10万",
											"value": "0-10"
									},
									{
										"name": "10-20万",
										"value": "10-20"
									},
									{
										"name": "20-30万",
										"value": "20-30"
									},
									{
										"name": "30-40万",
										"value": "30-40"
									},
									{
										"name": "40-60万",
										"value": "40-60"
									},
									{
										"name": "60-100万",
										"value": "60-100"
									},
									{
										"name": "100万以上",
										"value": "100-10000"
									}
								]
							}]},{
							"name":'排序',
							"type": 'hierarchy',
							"submenu": [
								{
									"name": "综合排序",
									"value": 0
								},
								{
									"name": "按价格从低到高",
									"value": 1
								},
								{
									"name": "按价格从高到低",
									"value": 2
								},
								{
									"name": "按表显小时从低到高",
									"value": 3
								},
								{
									"name": "按出厂年限从近到远",
									"value": 4
								},
								{
									"name": "按最新发布时间",
									"value": 5
								}
							]
						},
						{
							"name":'筛选',
							"type": 'radio',
							"submenu": [{
								"name": "设备来源",
								"submenu": [
									{
										"name": "个人发布",
										"value": "0"
									},
									{
										"name": "平台车源",
										"value": "1"
									},
									{
										"name": "自营认证",
										"value": "2"
									}
								]
							},
								{
									"name": "表显小时数",
									"submenu": [
										{
											"name": "不限",
											"value": "0-1000000"
										},
										{
											"name": "0-2000",
											"value": "0-2000"
										},
										{
											"name": "2000-5000",
											"value": "2000-5000"
										},
										{
											"name": "5000-8000",
											"value": "5000-8000"
										},
										{
											"name": "8000以上",
											"value": "8000-1000000"
										}
									]
								},
								{
									"name": "发布时间",
									"submenu": [
										{
											"name": "不限",
											"value": 10000
										},
										{
											"name": "今天",
											"value": 0
										},
										{
											"name": "7天以内",
											"value": 7
										},
										{
											"name": "1个月内",
											"value": 30
										},
										{
											"name": "3个月内",
											"value": 90
										},
										{
											"name": "6个月内",
											"value": 180
										},
										{
											"name": "9个月内",
											"value": 270
										},
										{
											"name": "1年以内",
											"value": 365
										}
									]
								}
							]
						}
					]
					//初始化筛选数据
					this.filterData = data;

				});
			},
			// 获取商品品牌列表
			async getBrandList() {
				await this.$http
					.get(`${brandIndex}`)
					.then(r => {
					  this.brandList = r;
					});
			},
			back() {
				if (this.drawer) {
					this.closeDrawer()
				} else {
					this.$mRouter.back();
				}
			},
			search() {
			  this.pageNum = 0;
			  this.productList = [];
			  this.loading = true;
			  if(this.keyword){
					this.productParams.name = this.keyword;
				}else{
			  	delete this.productParams.name;
				}
			  this.getProductList();
			},
			// 获取商品列表
			async getProductList(type) {
			console.log('获取商品列表')
				await this.$http.get(`${productList}`, {params:{
						...this.productParams,
						pageNum: this.pageNum,
						type:2
					}}).then(async r => {
						console.log(r)
						this.loading = false;
						if (type === 'refresh') {
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
			// 跳转详情
			navTo(route) {
				this.$mRouter.push({ route });
			}
		},
	}
</script>
<style lang="scss">
	page {
		background: $page-color-base;
	}
	.region{
		display: flex;
		margin-top:12px;
		margin-left: 8px;
	}
	.region:after {
		display: inline-block;
		font-family: unibtn;
		content: "\e601";
		margin-left: 2px;
		-webkit-transform: rotate(-90deg) scale(.8);
		transform: rotate(-90deg) scale(.8);
	}
	.rf-attr-item {
		width: 30%;
		height: 64upx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4upx;
		box-sizing: border-box;
		border-radius: 32upx;
		margin-right: 5%;
		margin-bottom: 5%;
	}
	.rf-attr-item:nth-of-type(3n) {
		margin-right: 0%;
	}
	.product-list {
		padding-bottom: env(safe-area-inset-bottom);
		/* 隐藏scroll-view滚动条*/
		::-webkit-scrollbar {
			width: 0;
			height: 0;
			color: transparent;
		}
		.rf-header-box {
			width: 100%;
			background: $color-white;
			position: fixed;
			z-index: 1000;
			left: 0;
			top: 0;
			.rf-header {
				display: flex;
				align-items: flex-start;
				.rf-back {
					margin-left: 8upx;
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
			}
			.input-box {
				flex:1;
				font-size: $font-sm;
				box-sizing: border-box;
				color: #999;
				display: flex;
				align-items: center;
				overflow: hidden;
				height: 60upx;
				background-color: $page-color-base;
				border-radius: 30upx;
				position: relative;
				margin: 0 20upx 0 10upx;
				.iconsousuo2 {
					z-index: 100;
					display: flex;
					align-items: center;
					position: absolute;
					top: 0;
					right: 0;
					width: 60upx;
					height: 60upx;
					font-size: $font-lg + 4upx;
					color: $font-color-dark;
				}
				input {
					width: 100%;
					padding-left: 28upx;
					height: 28upx;
					color: $font-color-base;
					font-size: 28upx;
				}
			}
		}
		/*screen*/
		.rf-header-screen {
			width: 100%;
			background: $color-white;
			position: fixed;
			z-index: 99;
			.rf-screen-top,
			.rf-screen-bottom {
				border: none;
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28upx;
				color: #333;
			}
			.rf-screen-top {
				height: 88upx;
				line-height: 88upx;
				position: relative;
				background: $color-white;
			}
			.rf-screen-bottom {
				height: 100upx;
				padding: 0 30upx;
				box-sizing: border-box;
				font-size: 24upx;
				align-items: center;
				overflow: hidden;
			}
			.rf-bottom-text {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.rf-bottom-item {
				flex: 1;
				width: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 0 12upx;
				box-sizing: border-box;
				margin-right: 20upx;
				white-space: nowrap;
				height: 60upx;
				border-radius: 40upx;
			}
			.rf-bottom-item:last-child {
				margin-right: 0;
			}
			.rf-bold {
				font-weight: bold;
			}
			.rf-active {
				color: $base-color;
			}
			.rf-icon-ml .rf-icon-class {
				margin-left: 6upx;
			}
			.rf-ml {
				margin-left: 6upx;
			}
			.rf-seizeaseat-20 {
				height: 20upx;
			}
			.rf-seizeaseat-30 {
				height: 30upx;
			}
			.rf-icon-middle .rf-icon-class {
				vertical-align: middle;
			}
			.rf-middle {
				vertical-align: middle;
			}
		}
		/*screen*/
		.rf-btmItem-active {
			border-radius: 32upx;
			font-weight: bold;
			position: relative;
		}
		.rf-btmItem-normal {
			border: 1upx solid rgba(0, 0, 0, 0.12);
			position: relative;
		}
		.rf-btmItem-active::after {
			content: "";
			position: absolute;
			width: 100%;
			height: 100%;
			border-radius: 40upx;
			left: 0;
			top: 0;
		}
		.rf-btmItem-tap {
			position: relative;
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}
		.rf-btmItem-tap::after {
			content: "";
			position: absolute;
			width: 100%;
			height: 22upx;
			background: #f7f7f7;
			left: 0;
			top: 58upx;
		}
		.product-list-wrapper {
			/*#ifdef MP*/
			padding-top: 220rpx;
		  /*#endif*/
		}
	}
</style>
