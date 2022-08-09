import {http} from '@/utils/request/service';

// 根据字典类型查询字典数据信息
export async function getDicts(params) {
	return await http.apiCall('get', '/sample/sample/list', params);
}

// 根据字典类型查询字典数据信息
export async function getRegions() {
	let params = {};
	let url = '/queryRegionMenu';
	return await http.apiCall('get', url, params);
}

