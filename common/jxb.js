import {http} from '@/utils/request/service';
import mHelper from '@/utils/helper';

/**
 * 常用方法封装
 * @author liyongsheng.
 **/

const jxb = {
	log(val) {
		let userLog = false;
		if (userLog) {
			let dbValue = uni.getStorageSync("log");
			uni.setStorageSync("log", (dbValue ? dbValue : "") + "->" + val);
		} else {
			uni.setStorageSync("log", "");
		}
	},
	getNearestRegion4list(){
		let val = mHelper.getSysConfg("region-location");
		if(val && val === '1'){
			return {
				provinceIndex: -1,
				cityIndex: -1,
				provinceId: 0,
				cityId: 0
			};
		}else if(val && val === '2'){
			let regionJson = this.getNearestRegion();
			return {
				provinceIndex: regionJson.provinceIndex,
				cityIndex: -1,
				provinceId: regionJson.provinceId,
				cityId: 0
			};
		}else{
			return this.getNearestRegion();
		}
	},
	getNearestRegion() {
		let _this = this;
		this.log("调用获取最近城市")
		let nowDay = new Date().getDate();
		let nearestRegionDay = uni.getStorageSync("nearestRegionDay");
		if (nowDay === nearestRegionDay) {
			this.log("缓存中有数据，直接返回")
			return uni.getStorageSync("nearestRegion");
		} else {
			this.log("开始调用定位")
			uni.getLocation({
				type: 'wgs84',
				success(res) {
					console.log("获取地址成功：" + res)
					let gps = {"lng": res.longitude, "lat": res.latitude}
					uni.setStorageSync("gps", gps);
					_this.queryNearestRegion(gps)
				},
				fail(res) {
					console.log('获取地址失败：' + res.errMsg);
				}
			});
		}
		return "";
	},
	getRealNearestRegion() {
		let _this = this;
		this.log("实时调用获取最近城市")
		uni.getLocation({
			type: 'wgs84',
			success(res) {
				console.log("获取地址成功：" + res)
				let gps = {"lng": res.longitude, "lat": res.latitude}
				uni.setStorageSync("gps", gps);
				_this.queryNearestRegion(gps)
			},
			fail(res) {
				console.log('获取地址失败：' + res.errMsg);
			}
		});
		return "";
	},
	async queryNearestRegion(gps){
		await http.get(`/queryNearestRegion`, {params: gps}).then(res => {
			let nowDay = new Date().getDate();
			console.log("调用queryNeasestRegion成功，res=" + JSON.stringify(res) + "...");
			uni.setStorageSync("nearestRegion", res);
			uni.setStorageSync("nearestRegionDay", nowDay);
		}).catch(err => {
			console.log("调用queryNeasestRegion失败，err=" + JSON.stringify(err) + "...");
		});
	},
	getGps() {
		let _this = this;
		this.log("系统启动调用获取GPS并缓存")
		this.log("开始调用定位")
		uni.getLocation({
			type: 'wgs84',
			success(res) {
				console.log("获取地址成功：" + res)
				let gps = {"lng": res.longitude, "lat": res.latitude}
				uni.setStorageSync("gps", gps);
			},
			fail(res) {
				console.log('获取地址失败：' + res.errMsg);
			}
		});
		return "";
	}
}

export default jxb
