<template>
	<view class="root-container">
		<hx-navbar :config="{title: '新增设备培训'}"/>
		<!-- :rules="rules" -->
		<uni-forms v-model="formData" ref="form" validate-trigger="bind" @submit="submit" err-show-type="undertext" @validate="validate">
			<uni-group title="基本信息">
				<uni-forms-item name="equipmentType" label="意向机械类型" required>
					<uni-right-selecter :filterData="equipmentTypeOptions" :defaultSelected="equipmentTypeDefaultSelected" title="意向机械类型" @confirm="equipmentTypeChange"></uni-right-selecter>
				</uni-forms-item>
				<uni-forms-item label="城市" required>
					<!--地址三级联动-->
					<uni-right-selecter :filterData="provinceIdFilterData" :defaultSelected="provinceIdDefaultSelected" title="城市" @confirm="provinceIdConfirm"></uni-right-selecter>
				</uni-forms-item>
				<uni-forms-item name="name" label="称呼" required>
					<input type="text" v-model="formData.name" class="uni-input-border" placeholder="请输入称呼" @input="binddata('name',$event.detail.value)">
				</uni-forms-item>
				<uni-forms-item name="phone" label="联系电话" required>
					<input type="text" v-model="formData.phone" class="uni-input-border" placeholder="请输入联系电话" @input="binddata('phone',$event.detail.value)">
				</uni-forms-item>

				<uni-forms-item name="remark" label="备注" >
					<textarea type="text" v-model="formData.remark" class="uni-textarea-border" placeholder="请输入备注"
							  @input="binddata('remark',$event.detail.value)"></textarea>
				</uni-forms-item>

			</uni-group>
			<!-- 直接使用组件自带submit、reset 方法，小程序不生效 -->
			<!-- <button class="button" form-type="submit">Submit</button>
				<button class="button" form-type="reset">Reset</button> -->
			<view class="bottom-action">
				<button class="button" @click="resetForm">重置</button>
				<button class="button" @click="submitForm('form')">提交</button>
			</view>
		</uni-forms>
	</view>
</template>

<script>
import {getDicts,getSimpleRegions} from '@/api/system';
import rfPickRegions from '@/components/rf-pick-regions';
import sunUiUpimg from '@/components/sunui-upimg/sunui-upimg.vue';
	export default {
		components: {
			rfPickRegions,
			'sunui-upimg': sunUiUpimg
		},
		data() {
			return {
			equipmentTypeOptions:[],
			equipmentTypeDefaultSelected: [],
			provinceIdFilterData: [],
			provinceIdDefaultSelected: [],
			formData: {
					id: '',
					customerId: '',
					name: '',
					equipmentType: '',
					phone: '',
					provinceId: '',
					cityId: '',
					districtId: '',
					auditStatus: '',
					viewNum: '',
					remark: '',
					delFlag: '',
					createTime: '',
				},
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入称呼',
						}]
					},
					equipmentType: {
						rules: [{
							required: true,
							errorMessage: '请输入意向机械类型',
						}]
					},
					phone: {
						rules: [{
							required: true,
							errorMessage: '请输入联系电话',
						}]
					},
					provinceId: {
						rules: [{
							required: true,
							errorMessage: '请输入城市',
						}]
					},
				}
			}
		},
		async onLoad() {
			uni.showLoading()
	let equipmentTypeData = await getDicts("req_equipment_type");
	let equipmentTypeJson = {
		"name":'请选择',
		"type": 'hierarchy',
		"submenu": equipmentTypeData
	}
	this.equipmentTypeOptions = [
			equipmentTypeJson
	];
	let provinceIds = await getSimpleRegions();
	let provinceIdJson = {
		"name": '请选择',
		"type": 'hierarchy',
		"submenu": provinceIds
	}
	this.provinceIdFilterData = [
		provinceIdJson
	];
			uni.hideLoading()
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
			let userInfo = uni.getStorageSync('userInfo');
			this.formData.phone = userInfo.mobile;
			let provinceIdRegion = this.jxb.getNearestRegion();
			if(provinceIdRegion){
				this.provinceIdDefaultSelected = [
					[provinceIdRegion.provinceIndex,provinceIdRegion.cityIndex,provinceIdRegion.districtIndex]
				]
				this.formData.provinceId = provinceIdRegion.provinceId;
				this.formData.cityId = provinceIdRegion.cityId;
				this.formData.districtId = provinceIdRegion.districtId;
			}
		},
		methods: {
				equipmentTypeChange(data) {
					this.formData.equipmentType = data.value[0][0];
					console.log("equipmentTypeChange返回值="+JSON.stringify(data));
				},
				// 获取选择的地区
				provinceIdConfirm(e) {
					this.formData.provinceId = e.value[0][0];
					this.formData.cityId = e.value[0][1];
					this.formData.districtId = e.value[0][2];
				},
				createTimeDateChange: function(e) {
					this.formData.createTime = e.detail.value
				},

			/**
			 * 触发校验
			 * @param {Object} event
			 */
			validate(event) {
				// TODO 返回校验结果
				console.log('触发校验：', event);
			},

			/**
			 * 表单提交
			 * @param {Object} event
			 */
			async submit(event) {
				const {
					errors,
					value
				} = event.detail
				if (errors) {
					console.log(value);
					console.error('验证失败', errors);
					return
				}
				let res = await this.$http.apiCall('post', '/peixun/peixun/add', JSON.stringify(this.formData));
				if(res === 1){
					uni.showModal({
						title: '提交成功',
						content: '设备培训经理会尽快联系您！请您保持电话通畅',
						confirmText: '确定',
						showCancel:false,
						success: async function (res) {
							if (res.confirm) {
								_this.$mRouter.reLaunch({ route: '/pages/index/index' });
							}
						}
					});
					console.log("表单的值:", value);
				}
			},

			/**
			 * 手动提交
			 * @param {Object} form
			 */
			submitForm(form) {
				this.$refs[form].submit()
			},

			/**
			 * 手动重置表单
			 */
			resetForm() {
				this.$refs.form.resetFields()
			},
			/**
			 * 部分表单校验
			 * @param {Object} form
			 */
			validateField(form) {
				this.$refs[form].validateField(['name', 'email'], (errors) => {
					console.log(errors);
					if (errors) {
						uni.showToast({
							title: '验证成功'
						})
					}
				})
			},

			/**
			 * 清除表单校验
			 * @param {Object} form
			 * @param {Object} name
			 */
			clearValidate(form, name) {
				if (!name) name = []
				this.$refs[form].clearValidate(name)
			}
		}
	}
</script>

<style>
	.root-container{
		margin-bottom: 80px;
	}
	/* 头条小程序组件内不能引入字体 */
	/* #ifdef MP-TOUTIAO */
	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url("~@/static/uni.ttf") format("truetype");
	}

	/* #endif */
	/* #ifndef APP-NVUE */
	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
		min-height: 100%;
		height: auto;
	}

	view {
		font-size: 14px;
		line-height: inherit;
	}

	.bottom-action {
		width: 100%;
		position: fixed;
		display: flex;
		justify-content: space-between;
		bottom: 0;
	}

	.example-info {
		padding: 15px;
		color: #3b4144;
		background: #ffffff;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		padding: 0;
		font-size: 14px;
		background-color: #ffffff;
	}

	/* #endif */
	.example {
		padding: 0 15px;
	}

	.example-info {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 15px;
		color: #3b4144;
		background-color: #ffffff;
		font-size: 14px;
		line-height: 20px;
	}

	.example-info-text {
		font-size: 14px;
		line-height: 20px;
		color: #3b4144;
	}

	.example-body {
		flex-direction: column;
		padding: 15px;
		background-color: #ffffff;
	}

	.word-btn-white {
		font-size: 18px;
		color: #FFFFFF;
	}

	.word-btn {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		align-items: center;
		justify-content: center;
		border-radius: 6px;
		height: 48px;
		margin: 15px;
		background-color: #007AFF;
	}

	.word-btn--hover {
		background-color: #4ca2ff;
	}

	.example {
		padding: 0 10px 10px;
	}

	.uni-input-border,
	.uni-textarea-border {
		width: 100%;
		font-size: 14px;
		color: #666;
		border: 1px #e5e5e5 solid;
		border-radius: 5px;
		box-sizing: border-box;
	}

	.uni-input-border {
		padding: 0 10px;
		height: 35px;
	}

	.uni-textarea-border {
		padding: 10px;
		height: 80px;
	}

	.label-box {
		margin-right: 10px;
	}

	.transform-scale {
		transform: scale(0.7);
	}

	.button {
		width: 100%;
		font-size: 15px;
		margin: 10px 10px;
		background: #0081ff;
		color: white;
	}
</style>
