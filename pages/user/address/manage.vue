<template>
	<view class="address-manage rf-row-wrapper">
		<view class="row b-b">
			<text class="tit">联系人</text>
			<input
				class="input"
				type="text"
				v-model="addressData.name"
				@blur="handlenameChange"
				placeholder="收货人姓名"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row b-b">
			<text class="tit">手机号</text>
			<input
				class="input"

				v-model="addressData.mobile"
				@blur="handleMobileChange"
				placeholder="收货人手机号码"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row b-b">
			<text class="tit">选择地址</text>
			<!--地址三级联动-->
			<rf-pick-regions
				:addressData="addressData"
				@getRegions="handleGetRegions"
			>
			</rf-pick-regions>
		</view>
		<view class="row b-b">
			<text class="tit">详细地址</text>
			<input
				class="input"
				type="text"
				v-model="addressData.detailAddress"
				@blur="bindAddressDetailsChange"
				placeholder="请输入详细地址"
				placeholder-class="placeholder"
			/>
		</view>
		<view class="row default-row">
			<text class="tit">设为默认</text>
			<switch
				:checked="addressData.isDefault==1 ? true : false"
				:color="themeColor.color"
				@change="switchChange"
			/>
		</view>
		<button
			class="add-btn"
			:class="'bg-' + themeColor.name"
			:disabled="btnLoading"
			:loading="btnLoading"
			@tap="confirm"
		>
			提交
		</button>

		<!--加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>

<script>
/**
 * @des 收货地址列表
 *
 * @author stav stavyan@qq.com
 * @date 2020-03-10 18:00
 * @copyright 2019
 */
import { addressCreate, addressUpdate, addressDetail } from '@/api/userInfo';
import rfPickRegions from '@/components/rf-pick-regions';
export default {
	components: {
		rfPickRegions
	},
	data() {
		return {
			addressData: {
				name: '',
				mobile: '',
				detailAddress: '',
				address_name: '请选择地址',
				address: '',
				isDefault: false,
				provinceId: '',
				cityId: '',
				countryId: ''
			},
			btnLoading: false,
			multiArray: [[], [], []],
			multiIndex: [0, 0, 0],
			loading: true
		};
	},
	onLoad(options) {
		this.initData(options);
	},
	methods: {
		// 获取选择的地区
		handleGetRegions(e) {
			this.addressData.address = e.address;
			this.addressData.provinceId = e.provinceId;
			this.addressData.cityId = e.cityId;
			this.addressData.countryId = e.countryId;
		},
		// 数据初始化
		async initData(options) {
			let title = '新增收货地址';
			if (options.type === 'edit') {
				title = '编辑收货地址';
				await this.getAddressDetail(options.id);
			} else {
				setTimeout(() => {
					this.loading = false;
				}, 1 * 1000);
			}
			this.manageType = options.type;
			uni.setNavigationBarTitle({
				title
			});
		},
		// 获取收货地址
		async getAddressDetail(id) {
			await this.$http
				.get(`${addressDetail}`, {params:{
					id
				}})
				.then(async r => {
					this.addressData = await r;
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
		handlenameChange(e) {
			this.addressData.name = e.detail.value;
		},
		bindAddressDetailsChange(e) {
			this.addressData.detailAddress = e.detail.value;
		},
		handleMobileChange(e) {
			this.addressData.mobile = e.detail.value;
		},
		switchChange(e) {
			this.addressData.isDefault = e.detail.value;
		},
		// 提交
		confirm() {
			let data = this.addressData;
			if (!data.name) {
				this.$mHelper.toast('请填写收货人姓名');
				return;
			}
			if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(data.mobile)) {
				this.$mHelper.toast('请输入正确的手机号码');
				return;
			}
			this.btnLoading = true;
			if (this.manageType === 'edit') {
				this.handleAddressUpdate(data);
			} else {
				this.handleAddressCreate(data);
			}
		},
		async handleAddressUpdate(data) {
			await this.$http
				.put(`${addressUpdate}`, {
				id:data.id,
					name: data.name,
					mobile: data.mobile,
					detailAddress: data.detailAddress,
					isDefault: data.isDefault ? 1 : 0,
					provinceId: data.provinceId,
					cityId: data.cityId,
					countryId: data.countryId,
					address: data.address
				})
				.then(() => {
					this.btnLoading = false;
					this.$mHelper.toast('收货地址修改成功！');
					this.$mRouter.back();
				})
				.catch(() => {
					this.btnLoading = false;
				});
		},
		async handleAddressCreate(data) {
			await this.$http
				.post(`${addressCreate}`, {
					name: data.name,
					mobile: data.mobile,
					detailAddress: data.detailAddress,
					address: data.address,
					isDefault: data.isDefault ? 1 : 0,
					provinceId: data.provinceId,
					cityId: data.cityId,
					countryId: data.countryId
				})
				.then(() => {
					this.btnLoading = false;
					this.$mHelper.toast('收货地址修改成功！');
					this.$mRouter.back();
				})
				.catch(() => {
					this.btnLoading = false;
				});
		}
	}
};
</script>

<style lang="scss">
page {
	background: $page-color-base;
}
.address-manage {
	padding-top: 16upx;
}
</style>
