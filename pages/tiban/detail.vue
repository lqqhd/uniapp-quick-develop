<template>
	<view class="container">
		<view class="row">
			<view class="left">
				<image class="image" :src="formData.avatar"></image>
			</view>
			<view class="mid">
				<view class="title">
					<text>{{ formData.title }}</text><text class="btn">{{ formData.enquipmentType }}</text>
				</view>
				<view>
					<view style="color: red;font-weight: bold;font-size: 16px">{{ formData.salary }}/天</view>
				</view>
			</view>
		</view>

		<view style="padding: 10px;">
			<map v-if="showMap" class="map" id="map1" ref="map1" :controls="controls" :scale="scale" :longitude="location.longitude"
					 :latitude="location.latitude" :show-location="showLocation" :enable-3D="enable3D" :rotate="rotate" :skew="skew"
					 :show-compass="showCompass" :enable-overlooking="enableOverlooking" :enable-zoom="enableZoom"
					 :enable-scroll="enableScroll" :enable-rotate="enableRotate" :enable-satellite="enableSatellite"
					 :enable-traffic="enableTraffic" :markers="markers" :polyline="polyline" :circles="circles" :polygons="polygons"
					 :include-points="includePoints"></map>
		</view>
		<view style="display: flex;justify-content: space-between">
			<view style="flex:1">
				<view class="detail-meta">
					<text class="field-title">工地位置：</text>
					<text class="field-time">{{ formData.gps?formData.gps:formData.regionNames }}</text>
				</view>
				<view class="detail-meta">
					<text class="field-title">距离查看：距离我的位置为</text>
					<text class="field-time">{{ formData.distance |formatNum}}KM</text>
				</view>
				<view class="detail-meta" v-if="formData.createTime">
					<text class="field-title">发布时间：</text>
					<text class="field-time">{{ formData.createTime }}</text>
				</view>
			</view>
			<view>
				<view class="btn" @tap="openMap" style="height: 50px;width: 50px;border-radius: 25px;margin-right: 15px">
					<view style="display: flex;"><uni-icons v-if="false" color="#fff" type="paperplane-filled" size="15"/><view style="font-size: 13px;">导航</view></view>
				</view>

			</view>
		</view>


		<view style="height: 10px;margin-top: 10px;background-color: #f8f8f8"></view>

		<view style="margin: 20px 15px 20px 15px">
			<view style="display: flex;margin-bottom: 18px">
				<view class="info-column">
					<image src="https://yzimg.jikebang.com/gczh/imgs/jxb/sblx.png" class="image"></image>
					<view class="column">
						<view class="name">{{ formData.startTime |timeFormat}}</view>
						<view style="color: #999;font-size: 13px;font-size: 13px">替班时间</view>
					</view>
				</view>
				<view class="info-column">
					<image src="https://yzimg.jikebang.com/gczh/imgs/jxb/sglx.png" class="image"></image>
					<view class="column">
						<view class="name">{{ formData.workType }}</view>
						<view style="color: #999;font-size: 13px">施工类型</view>
					</view>
				</view>
			</view>
			<view style="display: flex;margin-bottom: 18px">
				<view class="info-column">
					<image src="https://yzimg.jikebang.com/gczh/imgs/jxb/jsfs.png" class="image"></image>
					<view class="column">
						<view class="name">{{ formData.settType }}</view>
						<view style="color: #999;font-size: 13px">结算方式</view>
					</view>
				</view>
				<view class="info-column">
					<image src="https://yzimg.jikebang.com/gczh/imgs/jxb/sbts.png" class="image"></image>
					<view class="column">
						<view class="name">{{ formData.workTime }}</view>
						<view style="color: #999;font-size: 13px">上班时间</view>
					</view>
				</view>
			</view>
			<view style="display: flex;margin-bottom: 18px">
				<view class="info-column">
					<image src="https://yzimg.jikebang.com/gczh/imgs/jxb/gzsj.png" class="image"></image>
					<view class="column">
						<view class="name">{{ formData.workHours }}</view>
						<view style="color: #999;font-size: 13px">工作时间</view>
					</view>
				</view>
				<view class="info-column">
					<image src="https://yzimg.jikebang.com/gczh/imgs/jxb/tbts.png" class="image"></image>
					<view class="column">
						<view class="name">{{ formData.workDays }}天</view>
						<view style="color: #999;font-size: 13px">替班天数</view>
					</view>
				</view>
			</view>

		</view>

		<view style="height: 10px;background-color: #f8f8f8"></view>

		<view class="section-title">其他要求</view>
		<view style="margin: 0 15px 20px 15px">{{ formData.remark || '无'}}</view>

		<view style="height: 10px;background-color: #f8f8f8"></view>

		<view style="margin: 20px 15px;">
			<view style="margin-top: 10px"><tui-icon name="about" color="#0081ff" style="margin-right: 5px" :size="14"></tui-icon><text style="margin-left: 5px">温馨提示：</text></view>
			<view style="font-size: 13px;color: #888">1.联系我时，请说在工程找活儿看到的！</view>
			<view style="font-size: 13px;color: #888">2.如遇无效、虚假、诈骗信息，请立即举报！</view>
			<view style="font-size: 13px;color: #888">3.可通过电话和消息沟通，尽可能了解详细的替班情况。</view>
		</view>

		<uni-bottom-nav  :options="favorite?options2:options1" :fill="true" :button-group="buttonGroup" @click="onClick" @buttonClick="buttonClick"/>

		<view style="height: 100px"></view>

		<rf-empty
			info="暂无详情"
			v-if="!formData && !loading"
		></rf-empty>
		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>

	</view>
</template>

<script>
import {noticeDetail} from '@/api/sms';
import mapjs from '@/common/openMap.js'
export default {
	data() {
		return {
			showMap:false,
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
					text: '立即联系',
					backgroundColor: '#007aff',
					color: '#fff'
				}
			],
			location: {
				longitude: 116.3974770000,
				latitude: 39.9086920000
			},
			controls: [{
				id: 1,
				position: {
					left: 5,
					top: 180,
					width: 30,
					height: 30
				},
				iconPath: '/static/logo.png',
				clickable: true
			}],
			showLocation: false,
			scale: 13,
			showCompass: true,
			enable3D: true,
			enableOverlooking: true,
			enableZoom: true,
			enableScroll: true,
			enableRotate: true,
			enableSatellite: false,
			enableTraffic: false,
			polyline: [],
			markers: [],
			polygons: [],
			circles: [],
			includePoints: [],
			rotate: 0,
			skew: 0,
			markersData:[{
				id: 0,
				latitude: 39.9086920000,
				longitude: 116.3974770000,
				title: '',
				zIndex: '1',
				iconPath: 'https://yzimg.jikebang.com/gczh/imgs/jxb/gps.png',
				width: 30,
				height: 30,
				anchor: {
					x: 0.5,
					y: 1
				}
			}]
		};
	},
	filters: {
		timeFormat(val){
			if(val && val.length > 10){
				val = val.substr(5,11)
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
		this.id = options.id;
		this.location.longitude = options.longitude;
		this.location.latitude = options.latitude;
		this.showMap = true;
		await this.getDetail(options.id);
		this.favorite = await this.hasAttention();
	},
	onShareAppMessage() {
		return {
			title: this.banner.title,
			path: `/pages/index/notice/detail?id=${this.id}`
		};
	},
	onReady() {
		this.map = uni.createMapContext("map1", this);
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
			return await this.$http.apiCall('get', '/hasAttention', {id: this.formData.id,type:'8'});
		},
		// 收藏设备
		async handleCollectCreate() {
			let params = {
				id: this.formData.id,
				type:'8',
				image:this.formData.url,
				title:'替班'+' ' + this.formData.enquipmentType,
				navUrl:'/pages/tiban/detail?id='+this.formData.id
			}
			await this.$http.get('/addattention', {params:params}).then(async res => {
				this.favorite = true;
				this.$mHelper.toast('收藏成功');
			});
		},
		// 取消收藏设备
		async handleCollectDel() {
			let _this = this;
			await this.$http.get('/cancelattention', {params:{id: this.formData.id,type:'8'}}).then(async res => {
				this.favorite = false;
				this.$mHelper.toast('取消收藏成功');
			});
		},
		openMap(){
			var options = {
				/* origin:{  //导航起点坐标和名称,如果不传则起点为当前位置
					latitude:39.92848272,
					longitude:116.39560823,
					name:"起点"
				}, */
				destination:{  //导航终点点坐标和名称
					latitude:this.location.latitude,
					longitude:this.location.longitude,
					name:"终点"
				},
				mode:"drive"  //导航方式 公交：bus驾车：drive（默认）,步行：walk,骑行：bike
			}
			mapjs.openMap(options,"gcj02")
		},
		// 获取示例详情
		async getDetail(id) {
			let queryParams = {
				pageNum:0,
				id:id
			}
			let gps = uni.getStorageSync("gps");
			console.log("获取的GPS位置信息为："+JSON.stringify(gps));
			queryParams.longitude = gps.lng;
			queryParams.latitude = gps.lat;
			let resData = await this.$http.apiCall('get', '/tiban/tiban/queryList', queryParams);
			let res = resData.list[0]
			this.loading = false;
			if (res.name) {
				uni.setNavigationBarTitle({
					title: res.name
				});
			}
			this.formData = res;
			this.location.longitude = res.longitude;
			this.location.latitude = res.latitude;

			//marker
			this.markersData[0].longitude = res.longitude;
			this.markersData[0].latitude = res.latitude;
			this.markers = this.markersData;
			this.showMap = true;

			if(res.workHours === '其他'){
				this.formData.workHours = this.formData.workHoursElse;
			}

		},
		onClick(e) {
			if(e.index === 0){
				this.$mRouter.push({route: '/pages/set/feedback/feedback'});
			}else{
				this.toFavorite()
			}
		},
		buttonClick(e) {
			let _this = this;
			uni.showModal({
				title: '提示',
				content: '点击拨打，立即联系：'+this.formData.phone,
				confirmText:'拨打',
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
.section-title{
	margin: 15px 15px 10px 15px;
	font-weight: bold;
	font-size: 18px;
}
.info-column{
	flex:1;
	display: flex;
	justify-content:flex-start;
	padding-left: 30px;
	.image{
		width: 13vw;
		height: 13vw;
		margin-right: 10px
	}
	.column{
		padding: 5px 0;
		display: flex;
		flex-direction:column;
		justify-content: space-between;
		.name{
			font-weight: bold;
			font-size: 16px
		}
	}
}
.container {
	background: #fff;
	padding-bottom: 80px;
	.banner {
		overflow: hidden;
		position: relative;
		background-color: #fff;

		.banner-img {
			height: 300upx;
			width: 100%;
		}

		.banner-title {
			overflow: hidden;
			position: absolute;
			bottom: 0;
			width: 100%;
			font-size: 32upx;
			color: white;
			z-index: 11;
			background-color: rgba(0, 0, 0, 0.25);
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
		padding: 0upx 30upx 10upx 30upx;
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
.row {
	padding: 20upx 0;
	background: white;
	width: 100%;
	display: flex;
	overflow: hidden;
	z-index: 4;

	.left {
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
			display: flex;
			font-weight: bold;
			font-size: 16px;
		}
	}
}
.btn{
	height: auto;
	border-radius: 8px;
	margin-left: 10px;
	font-weight: lighter;
	font-size: 10px;
}

.map {
	width: 100%;
	height: 200px;
	background-color: #f0f0f0;
}
</style>
