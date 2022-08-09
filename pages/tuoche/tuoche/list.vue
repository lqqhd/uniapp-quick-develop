<template>
	<view class="collection">
		<uni-header-selecter v-show="!isMy" :filterData="filterData" :defaultSelected="defaultSelected"
												 :updateMenuName="true" @confirm="confirm" dataFormat="Object"></uni-header-selecter>
		<view :style="{paddingTop: isMy?0:44 + 'px'}">
			<view class="row" v-for="(item, index) in dataList" :key="index" @tap.stop="navTo(item.id)">
				<view class="left">
					<image class="image" :src="item.url"></image>
				</view>
				<view class="mid">
					<view class="title in2line">{{ item.name }}</view>
					<view class="data">
						<view class="item">
							<tui-icon name="about" :size="14" class="icon-right"/>
							拖车信息：
							<text class="cnt">{{ item.carInfo }}</text>
						</view>
						<view class="item">
							<tui-icon name="clock" :size="14" class="icon-right"/>
							服务时间：
							<text class="cnt">{{ item.serviceTime }}</text>
						</view>
						<view class="item">
							<tui-icon name="gps" :size="14" class="icon-right"/>
							服务地区：
							<text class="cnt">{{ item.regionNames }}</text>
						</view>
						<view class="item" v-if="item.area">
							<text class="cnt">{{ item.area }}（区域范围）</text>
						</view>
						<view class="item">
							<tui-rate :current="item.star" active="#ff7900" @change="" :size="20"></tui-rate>
						</view>
					</view>
					<view class="bottom">
						<view></view>
						<text v-if="item.phone" @tap.stop="makePhoneCall(item.phone)" class="btn">拨打电话</text>
					</view>
				</view>
			</view>
		</view>

		<rf-load-more :status="loadingType" v-if="dataList.length > 0"/>
		<rf-empty :info="'未查询到数据~'" v-if="dataList.length === 0 && !loading"/>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
		<uni-fab ref="fab" @fabClick="addClick"/>
	</view>
</template>

<script>
/**
 * @des 拖车
 *
 * @author liyongsheng lqqhd@126.com
 * @date 2021-03-02
 * @copyright 2020
 */
import {getDicts, getRegions} from '@/api/system';
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import dayjs from '@/common/dayjs';
import rfPickRegionsAll from '@/components/rf-pick-regions-all';

export default {
	components: {
		rfLoadMore,
		rfPickRegionsAll
	},
	data() {
		return {
			indexArr: '',
			valueArr: '',
			defaultSelected: [],
			filterData: [],
			searchKey: "", //搜索关键词
			menuTop: 70, //header高度
			queryParams: {},
			dataList: [],
			pageNum: 0,
			loadingType: 'more',
			loading: true,
			hasLogin: false,
			isMy: false
		};
	},
	filters: {
		time(val) {
			return dayjs(val).format('YYYY-MM-DD HH:mm');
		}
	},
	onLoad(options) {
		if (options && options.isMy) {
			this.isMy = true;
		}
		this.hasLogin = this.$mStore.getters.hasLogin;
		this.initData();
	},
	// 下拉刷新
	onPullDownRefresh() {
		this.pageNum = 0;
		this.dataList = [];
		this.loading = true;
		this.getDataList('refresh');
	},
	// 加载更多
	onReachBottom() {
		if (this.loadingType === 'nomore') return;
		this.pageNum++
		this.getDataList();
	},
	methods: {
		// 统一跳转接口,拦截未登录路由
		navToRight(route) {
			if (!route) return;
			if (!this.hasLogin) {
				console.log(this.hasLogin)
				uni.removeStorageSync('backToPage');
				this.$mRouter.push({route: '/pages/public/logintype'});
			} else {
				this.$mRouter.push({route});
			}
		},
		addClick() {
			this.navToRight('/pages/tuoche/tuoche/add');
		},
		makePhoneCall(phone) {
			uni.showModal({
				title: '提示',
				content: '点击拨打，立即联系：' + phone,
				confirmText: '拨打',
				success: async function (res) {
					if (res.confirm) {
						uni.makePhoneCall({
							phoneNumber: phone,
							success: () => {
								console.log("成功拨打电话")
							}
						})
					}
				}
			});
		},
		// 数据初始化
		async initData() {
			let regions = await getRegions();
			let regionJson = {
				"name": '全国',
				"type": 'hierarchy',
				"submenu": regions
			}
			let sortJson = {
				"name": '排序',
				"type": 'hierarchy',
				"submenu": [
					{
						"name": "综合排序",
						"value": 0
					},
					{
						"name": "按时间升序",
						"value": 1
					},
					{
						"name": "按时间降序",
						"value": 2
					}
				]
			}

			let serviceTimeData = await getDicts("tuoche_fwsj");
			serviceTimeData.unshift({name: "不限", value: ""})
			let serviceTimeJson = {
				"name": '服务时间',
				"type": 'hierarchy',
				"submenu": serviceTimeData
			}

			//初始化筛选数据
			this.filterData = [
				regionJson,
				serviceTimeJson,
				{
					"name": '筛选',
					"type": 'radio',
					"submenu": [{
						"name": "排序",
						"submenu": [
							{
								"name": "综合排序",
								"value": 0
							},
							{
								"name": "按时间升序",
								"value": 1
							},
							{
								"name": "按时间降序",
								"value": 2
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
			];

			let nRegion = this.jxb.getNearestRegion4list();
			console.log("获取的查询区域：" + JSON.stringify(nRegion))
			this.defaultSelected = [
				[nRegion.provinceIndex + 1, nRegion.cityIndex + 1, null],
				[null],
				[null],
				[null]
			]
			this.queryParams.provinceId = nRegion.provinceId;
			this.queryParams.cityId = nRegion.cityId;

			this.getDataList();
		},
		// 获取列表
		async getDataList(type) {
			this.queryParams.pageNum = this.pageNum
			let url = '/tuoche/tuoche/queryList';
			if (this.isMy) {
				url = '/tuoche/tuoche/queryMyList'
				delete this.queryParams.provinceId;
				delete this.queryParams.cityId;
			}
			let res = await this.$http.apiCall('get', url, this.queryParams);
			this.loading = false;
			if (type === 'refresh') {
				uni.stopPullDownRefresh();
			}
			if (res.list) {
				this.loadingType = res.list.length === 10 ? 'more' : 'nomore';
				this.dataList = [...this.dataList, ...res.list];
			}
		},
		navTo(id) {
			let route = `/pages/tuoche/tuoche/detail?id=${id}`;
			if (this.isMy) {
				route = `/pages/tuoche/tuoche/update?id=${id}`;
			}
			this.$mRouter.push({route});
		},
		search() {
			this.pageNum = 0;
			this.dataList = [];
			this.loading = true;
			if (this.searchKey) {
				this.queryParams.name = this.searchKey;
			} else {
				delete this.queryParams.name;
			}
			this.getDataList();
		},
		//接收菜单结果事件
		confirm(e) {
			this.indexArr = e.index;
			this.valueArr = e.value;
			//省份
			if (this.isNotNull(e.value[0][0])) {
				this.queryParams.provinceId = e.value[0][0];
			} else {
				delete this.queryParams.provinceId;
			}
			if (this.isNotNull(e.value[0][1])) {
				this.queryParams.cityId = e.value[0][1];
			} else {
				delete this.queryParams.cityId;
			}

			//服务时间
			this.queryParams.serviceTime = e.value[1][0] ? e.value[1][0] : 0;

			//排序
			if(this.isNotNull(e.value[2][0][0])){
				this.queryParams.orderBys = e.value[2][0][0];
			}else{
				delete this.queryParams.orderBys;
			}

			//发布时间
			if(this.isNotNull(e.value[2][1][0])){
				this.queryParams.publishDays = e.value[2][1][0];
			}else{
				delete this.queryParams.publishDays;
			}
			this.search();
		},
		isNotNull(e) {
			return e !== null && e !== "" && e !== undefined;
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: $page-color-base;
}

.cnt {
	color: #333;
}

.collection {
	.row {
		padding: 20upx 0;
		background: white;
		width: 100%;
		margin: 20upx auto;
		box-shadow: 0upx 5upx 20upx rgba(0, 0, 0, 0.1);
		display: flex;
		overflow: hidden;
		z-index: 4;

		.left {
			width: 25vw;
			height: 25vw;
			margin-left: 20upx;
			margin-right: 10upx;
			position: relative;
			text-align: center;

			.image {
				border-radius: 5px;
				width: 25vw;
				height: 25vw;
			}
		}

		.mid {
			width: 100%;
			margin: 0 20upx 0 20upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.title {
				font-weight: bold;
				font-size: $font-base;
			}

			.data {
				width: 100%;
				align-items: center;
				margin: 10upx 0 5upx;
				font-size: $font-base;
				color: $font-color-base;

				.item {
					flex: 1;
					font-size: 14px;
					color: #aaa;
					margin-bottom: 4px;

					.icon-right {
						margin-right: 3px !important;
					}
				}

				.iconfont {
					color: $font-color-light;
					margin-right: 10upx;
				}

				.status {
					padding: 6upx 20upx;
					opacity: 0.8;
					color: $color-white;
					font-size: $font-sm;
					border-radius: 6upx;
				}
			}

			.bottom {
				line-height: 1.2;
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: $font-sm;
				color: $font-color-light;

				.price {
					font-size: $font-lg;
				}
			}
		}
	}
}

</style>
