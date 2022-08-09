<template>
	<view class="collection">
		<uni-header-selecter v-show="!isMy" :filterData="filterData" :defaultSelected="defaultSelected"
												 :updateMenuName="true" @confirm="confirm" dataFormat="Object"></uni-header-selecter>
		<view :style="{paddingTop: isMy?0:44 + 'px'}">
			<view class="row" v-for="(item, index) in dataList" :key="index" @tap="navTo(item)">
				<view class="left">
					<image class="image" :src="item.avatar"></image>
				</view>
				<view class="mid">
					<view style="display: flex;justify-content: flex-start;margin-bottom: 6px;align-items: center">
						<view class="title in2line">{{item.title }}</view>
						<tui-tag shape="circleRight" margin="0 0 0 10rpx" type="light-blue" size="10px" height="20px" @click="show">{{item.enquipmentType}}</tui-tag>
					</view>
					<view class="data">
						<view class="item">
							<tui-icon name="gps" :size="14"></tui-icon>
							<text style="margin: 0 30px 0 3px">{{item.regionNames|regionFormat}}</text>
							<text v-if="item.distance">距您：<text style="color: red;margin-right: 5px">{{ item.distance |formatNum}}</text>公里</text>
						</view>
						<view class="item">
							<tui-icon name="clock" :size="14" ></tui-icon><text style="margin: 0 30px 0 3px">发布时间：{{ item.createTime  }}</text>
						</view>
					</view>

					<view class="bottom">
						<view style="color: red;font-weight: bold">{{ item.salary }}/天</view>
						<view style="flex: 1"></view>
						<text v-if="!isMy&&item.status === '待接单'" @tap.stop="makePhoneCall(item.phone)" class="btn" >立即联系</text>
						<text v-if="isMy&&item.status === '待接单'" @tap.stop="finish(item.id)" class="btn" >已接单</text>
					</view>
				</view>
				<image v-if="item.status === '已接单'" mode="aspectFit" style="position: absolute;right: 20px;height: 120px;width: 120px;margin-top: -10px;" src="https://yzimg.jikebang.com/gczh/imgs/yjd.png"/>
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
 * @des 替班
 *
 * @author liyongsheng lqqhd@126.com
 * @date 2020-11-12
 * @copyright 2020
 */
import {getDicts, getRegions} from '@/api/system';
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
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
			isMy:false
		};
	},
	filters: {
		timeFormat(val){
			if(val && val.length > 10){
				val = val.substr(0,10)
			}
			return val;
		},
		formatNum(val){
			if(val){
				return val.toFixed(0);
			}
			return val;
		},
		regionFormat(val){
			if(val && val.lastIndexOf("-") > -1){
				return val.substring(val.lastIndexOf("-")+1);
			}
			return val;
		}
	},
	async onLoad(options) {
		if(options && options.isMy){
			this.isMy = true;
		}
		this.hasLogin = this.$mStore.getters.hasLogin;
		let gps = uni.getStorageSync("gps");
		console.log("获取的GPS位置信息为："+JSON.stringify(gps));
		this.queryParams.longitude = gps.lng;
		this.queryParams.latitude = gps.lat;
		console.log("获取的GPS位置信息为后设置的参数："+JSON.stringify(this.queryParams));
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
		makePhoneCall(phone) {
			uni.showModal({
				title: '提示',
				content: '点击拨打，立即联系：'+phone,
				confirmText:'拨打',
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
		finish(id) {
			let _this = this;
			uni.showModal({
				title: '确认已接单吗？',
				confirmText:'确认',
				success: async function (res) {
					if (res.confirm) {
						let res = await _this.$http.apiCall('get', '/tiban/tiban/finish', {id: id});
						if (res === 1) {
							_this.$mRouter.redirectTo({route: '/pages/tiban/list?isMy=true'});
						}
					}
				}
			});
		},
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
			this.navToRight('/pages/tiban/add');
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
						"name": "按发布时间",
						"value": 2
					},
					{
						"name": "按薪资最高",
						"value": 3
					},
					{
						"name": "按替班天数",
						"value": 4
					},
					{
						"name": "按距离最近",
						"value": 5
					}
				]
			}

			let enquipmentTypeData = await getDicts("equipment_type");
			enquipmentTypeData.unshift({name: "全部机型", value: ""})
			let enquipmentTypeJson = {
				"name": '设备类型',
				"type": 'hierarchy',
				"submenu": enquipmentTypeData
			}

			//初始化筛选数据
			this.filterData = [
				regionJson,
				enquipmentTypeJson,
				sortJson
			];

			let nRegion = this.jxb.getNearestRegion4list();
			this.defaultSelected = [
				[nRegion.provinceIndex+1,nRegion.cityIndex + 1,null],
				[null],
				[null]
			]
			this.queryParams.provinceId = nRegion.provinceId;
			this.queryParams.cityId = nRegion.cityId;
			this.search();
		},
		// 获取列表
		async getDataList(type) {
			this.queryParams.pageNum = this.pageNum
			console.log("替班请求参数："+JSON.stringify(this.queryParams))
			let url = '/tiban/tiban/queryList';
			if(this.isMy){
				url = '/tiban/tiban/queryMyList'
				delete this.queryParams.provinceId;
				delete this.queryParams.cityId;
			}
			if(this.queryParams.provinceId === undefined){
				delete this.queryParams.provinceId;
			}
			if(this.queryParams.cityId === undefined){
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
		navTo(item) {
			let route = `/pages/tiban/detail?id=${item.id}&longitude=${item.longitude}&latitude=${item.latitude}`;
			if(this.isMy){
				route = `/pages/tiban/update?id=${id}`;
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
			//设备类型
			this.queryParams.enquipmentType = e.value[1][0] ? e.value[1][0] : 0;

			//排序
			this.queryParams.orderBys = e.value[2][0] ? e.value[2][0] : 0;


			//发布时间
			// if(this.isNotNull(e.value[3][0][0])){
			// 	this.queryParams.publishDays = e.value[3][0][0];
			// }else{
			// 	delete this.queryParams.publishDays;
			// }
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
.btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 140upx;
	height: 50upx;
	color: #fff;
	font-size: 24upx;
	background-color: #0081ff;
	border-radius: 5upx;
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
				border-radius: 50%;
				width: 15vw;
				height: 15vw;
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
					.icon-right{
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
