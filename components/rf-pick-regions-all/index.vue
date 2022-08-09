<template>
	<!--	<picker mode="multiSelector"-->
	<!--	        :value="multiIndex"-->
	<!--	        :range="multiArray"-->
	<!--	        @change="handleValueChange"-->
	<!--	        @columnchange="handleColumnChange">-->
	<!--		<slot></slot>-->
	<!--	</picker>-->
	<picker
		mode="multiSelector"
		@columnchange="bindMultiPickerColumnChange"
		@change="bindChange"
		:value="multiIndex"
		range-key="name"
		:range="multiArray"
	>
		{{ address }}
	</picker>
</template>
<script>
/* eslint-disable */
import {provinceList, cityList, regionList} from '@/api/basic';

export default {
	props: {
		// defaultRegions: {
		//     type: Array,
		// }
		defaultLevel: {
			type: Number,
			default: 3
		},
		addressData: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {
			multiArray: [],
			multiIndex: [0, 0, 0],
			multiStr: '',
			address:'全国'
		};
	},
	mounted() {
		// this.$mHelper.log(this.addressData);
		this.getProvinceList();
	},
	methods: {
		async getProvinceList() {
			let provinceIndex = 0;
			let cityIndex = 0;
			let areaIndex = 0;
			let province_name = null;
			let city_name = null;
			let area_name = null;
			await this.$http.get(`${provinceList}`).then(async r => {
				let allCountry={
					id:0,
					name:"全国"
				}
				let p = [allCountry].concat(r);
				this.multiArray[0] = p;
				console.log("获取的省份列表内容："+this.addressData)
				if (this.addressData.provinceId) {
					r.forEach((item, index) => {
						if (parseInt(item.id, 10) === parseInt(this.addressData.provinceId, 10)) {
							console.log(this.addressData.provinceId)
							provinceIndex = index;
							this.addressData.provinceId = item.id;
							province_name = item.name;
						}
					});
				} else {
					this.addressData.provinceId = this.multiArray[0][0].id;
					province_name = this.multiArray[0][0].name;
					// this.$mHelper.log(this.addressData.provinceId);
				}
				await this.$http.get(`${cityList}`, {params:{provinceId: this.addressData.provinceId}}).then(async r => {
						this.multiArray[1] = r;
						if (this.addressData.cityId) {
							r.forEach((item, index) => {
								if (parseInt(item.id, 10) == parseInt(this.addressData.cityId, 10)) {
									cityIndex = index;
									this.addressData.cityId = item.id;
									city_name = item.name;
								}
							});
						} else {
							if(this.multiArray[1][0] != undefined && this.multiArray[1][0].id !== undefined){
								this.addressData.cityId = this.multiArray[1][0].id;
								city_name = this.multiArray[1][0].name;
							}else{
								this.addressData.cityId = 0
							}
						}
						await this.$http.get(`${regionList}`, {parmas:{
							cityId: this.addressData.cityId
						}}).then(r => {
							this.multiArray[2] = r;
							if (this.addressData.countryId) {
								r.forEach((item, index) => {
									if (parseInt(item.id, 10) == parseInt(this.addressData.countryId, 10)) {
										areaIndex = index;
										this.addressData.countryId = item.id;
										area_name = item.name;
									}
								});
							} else {
								if(this.multiArray[2][0] !== undefined  && this.multiArray[2][0].id !== undefined){
									this.addressData.countryId = this.multiArray[2][0].id;
									area_name = this.multiArray[2][0].name;
								}else{
									this.addressData.countryId = 0
								}
							}
							this.multiIndex = [provinceIndex, cityIndex, areaIndex];
							this.multiStr = `${province_name}`;
							this.$emit('getRegions', this.addressData);
						});
					});
			});
		},
		async bindMultiPickerColumnChange(e) {
			this.multiIndex[e.detail.column] = e.detail.value;
			let provinceIndex = 0;
			let cityIndex = 0;
			let areaIndex = 0;
			let province_name = null;
			let city_name = null;
			let area_name = null;
			switch (e.detail.column) {
				case 0: //拖动第1列
					if (this.multiIndex[0] === this.multiIndex[0]) {
						this.addressData.provinceId = this.multiArray[0][e.detail.value].id;
						province_name = this.multiArray[0][e.detail.value].name;
						await this.$http.get(`${cityList}`, {params:{provinceId: this.multiArray[0][e.detail.value].id}}).then(async r => {
							if(r.length > 0){
								let allProvince={
									id:0,
									name:"全省"
								}
								let p = [allProvince].concat(r);
								this.multiArray[1] = p;
							}else{
								this.multiArray[1] = [];
							}

							this.addressData.cityId = 0;
							city_name = "";
							this.multiArray[2] = [];
							this.multiStr = province_name;
							this.multiIndex = [this.multiIndex[0], 0, 0];
						});
					}
					break;
				case 1: //拖动第2列
					if (this.multiIndex[0] === this.multiIndex[0]) {
						if (this.multiIndex[1] === this.multiIndex[1]) {
							this.addressData.provinceId = this.multiArray[0][this.multiIndex[0]].id;
							province_name = this.multiArray[0][this.multiIndex[0]].name;
							this.addressData.cityId = this.multiArray[1][e.detail.value].id;
							city_name = this.multiArray[1][e.detail.value].name;
							cityIndex = e.detail.value;
							await this.$http.get(`${regionList}`, {params:{cityId: this.multiArray[1][e.detail.value].id}}).then(r => {
								if(r.length > 0){
									let allRegion={
										id:0,
										name:"全市"
									}
									let p = [allRegion].concat(r);
									this.multiArray[2] = p;

									this.addressData.countryId = 0;
									area_name = "";
									this.multiIndex = [this.multiIndex[0], cityIndex, 0];
									this.multiStr = `${city_name}`;

								}else{
									this.multiArray[2] = [];

									this.addressData.countryId = 0;
									area_name = "";
									this.multiIndex = [this.multiIndex[0], 0, 0];
									this.multiStr = `${province_name}`;
								}


								});
						}
					}
					break;
				case 2: //拖动第3列
					if (this.multiIndex[0] === this.multiIndex[0]) {
						if (this.multiIndex[1] === this.multiIndex[1]) {
							if (this.multiIndex[2] === this.multiIndex[2]) {
								this.addressData.provinceId = this.multiArray[0][
									this.multiIndex[0]
									].id;
								province_name = this.multiArray[0][this.multiIndex[0]]
									.name;
								this.addressData.cityId = this.multiArray[1][
									this.multiIndex[1]
									].id;
								city_name = this.multiArray[1][this.multiIndex[1]].name;
								this.addressData.countryId = this.multiArray[2][
									e.detail.value
									].id;
								area_name = this.multiArray[2][e.detail.value].name;
								areaIndex = e.detail.value;
								this.multiIndex = [
									this.multiIndex[0],
									this.multiIndex[1],
									areaIndex
								];
								if(areaIndex == 0){
									this.multiStr = `${city_name}`;
								}else{
									this.multiStr = `${area_name}`;
								}

							}
						}
					}
					break;
			}
			this.addressData.address = this.multiStr
		},
		async bindChange(e) {
			this.address = this.addressData.address;
			this.$emit('getRegions', this.addressData);
		}
	}
};
</script>
