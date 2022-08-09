import {http} from '@/utils/request/service';

// 根据字典类型查询字典数据信息
export async function getDicts(dictType) {
	let params = {};
	let url = '/system/dict/data/type/' + dictType;
	return await http.apiCall('get', url, params);
}

// 根据字典类型查询字典数据信息
export async function getRegions() {
	let nowDay = new Date().getDate();
	let regionDay = uni.getStorageSync("regionDay");
	if(nowDay === regionDay){
		return uni.getStorageSync("regionData");
	}else{
		let res = await http.apiCall('get', '/queryRegionMenu', {});
		uni.setStorageSync("regionData",res);
		uni.setStorageSync("regionDay",nowDay);
		return res
	}
}

// 根据字典类型查询字典数据信息
export async function getSimpleRegions() {
	let nowDay = new Date().getDate();
	let regionDay = uni.getStorageSync("regionSimpleDay");
	if(nowDay === regionDay){
		return uni.getStorageSync("simpleRegionData");
	}else{
		let res = await http.apiCall('get', '/querySimpleRegionMenu', {});
		uni.setStorageSync("simpleRegionData",res);
		uni.setStorageSync("regionSimpleDay",nowDay);
		return res
	}
}

