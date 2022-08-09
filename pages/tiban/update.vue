<template>
	<view class="root-container">
		<hx-navbar :config="{title: '修改替班'}"/>
		<!-- :rules="rules" -->
		<uni-forms v-model="formData" ref="form" validate-trigger="bind" @submit="submit" err-show-type="undertext"
							 @validate="validate">
			<uni-group title="基本信息">
				<uni-forms-item name="title" required label="替班标题">
					<input type="text" v-model="formData.title" class="uni-input-border" placeholder="建议输入设备具体型号"
								 @input="binddata('title',$event.detail.value)">
				</uni-forms-item>
				<uni-forms-item name="enquipmentType" required label="设备类型">
					<uni-right-selecter :filterData="equipmentTypeOptions" :defaultSelected="equipmentTypeDefaultSelected" title="设备类型" @confirm="equipmentTypeChange"></uni-right-selecter>
				</uni-forms-item>
				<uni-forms-item name="provinceId" required label="工地区域">
					<uni-right-selecter :filterData="regionFilterData" :defaultSelected="regionDefaultSelected" title="所在地" @confirm="regionConfirm"></uni-right-selecter>
				</uni-forms-item>
				<uni-forms-item name="gps" label="工地位置">
					<input type="text" v-model="formData.gps" class="uni-input-border" placeholder="请输入或选择工地位置" @input="binddata('gps',$event.detail.value)"/>
					<view style="display: flex;align-items: center;padding-left: 5px" @tap="chooseLocation"><tui-icon name="gps" :size="16"></tui-icon></view>
				</uni-forms-item>
				<uni-forms-item name="salary" required label="薪资">
					<input type="number" v-model="formData.salary" class="uni-input-border" placeholder="请输入薪资"
								 @input="binddata('salary',$event.detail.value)">
				</uni-forms-item>
				<uni-forms-item name="startTime" required label="替班时间">
					<input type="text" disabled v-model="formData.startTime" class="uni-input-border" placeholder="请选择替班时间" @input="binddata('startTime',$event.detail.value)"/>
					<view style="display: flex;align-items: center;padding-left: 5px" @tap="show"><tui-icon name="time" :size="20"></tui-icon></view>
				</uni-forms-item>
				<uni-forms-item name="workType" required label="施工类型">
					<jkb-checkbox ref="workTypeOptions" @change="workTypeChange" style="width: 100%"></jkb-checkbox>
				</uni-forms-item>
				<uni-forms-item name="workDays" required label="替班天数">
					<input type="number" v-model="formData.workDays" class="uni-input-border" placeholder="请输入替班天数"
								 @input="binddata('workDays',$event.detail.value)">
				</uni-forms-item>
				<uni-forms-item name="workTime" required label="上班时间">
					<jkb-checkbox ref="workTimeOptions" @change="workTimeChange" style="width: 100%"></jkb-checkbox>
				</uni-forms-item>
				<uni-forms-item name="workHours" required label="工作时间">
					<jkb-checkbox ref="workHoursOptions" @change="workHoursChange"></jkb-checkbox>
				</uni-forms-item>
				<uni-forms-item v-show="isElseHours" required name="workHoursElse" label="其他时间">
					<input type="text" v-model="formData.workHoursElse" class="uni-input-border" placeholder="请输入其他工作时间"
								 @input="binddata('workHoursElse',$event.detail.value)">
				</uni-forms-item>
				<uni-forms-item name="settType" required label="结算方式">
					<jkb-checkbox ref="settTypeOptions" @change="settTypeChange"></jkb-checkbox>
				</uni-forms-item>
				<uni-forms-item name="phone" required label="联系电话">
					<input type="text" v-model="formData.phone" class="uni-input-border" placeholder="请输入联系电话"
								 @input="binddata('phone',$event.detail.value)">
				</uni-forms-item>
				<uni-forms-item name="remark" label="其他要求">
					<input type="text" v-model="formData.remark" class="uni-input-border" placeholder="请输入其他要求"
								 @input="binddata('remark',$event.detail.value)">
				</uni-forms-item>

			</uni-group>
			<!-- 直接使用组件自带submit、reset 方法，小程序不生效 -->
			<!-- <button class="button" form-type="submit">Submit</button>
				<button class="button" form-type="reset">Reset</button> -->
			<view class="bottom-action">
				<button class="button" @click="remove">删除</button>
				<button class="button" @click="submitForm('form')">提交</button>
			</view>
		</uni-forms>
		<tui-datetime ref="dateTime" :type="1" :startYear="startYear" :endYear="endYear" cancelColor="#888" color="#5677fc"
									:setDateTime="setDateTime" :unitTop="false" @confirm="change"></tui-datetime>
	</view>
</template>

<script>
import {getDicts,getSimpleRegions} from '@/api/system';
import rfPickRegions from '@/components/rf-pick-regions';

export default {
	components: {
		rfPickRegions
	},
	data() {
		return {
			setDateTime:'',
			endYear:2021,
			startYear:2020,
			isElseHours:false,
			regionDefaultSelected: [],
			equipmentTypeDefaultSelected: [],
			equipmentTypeOptions:[],
			regionFilterData: [],
			formData: {
				workHoursElse:'',
				phone:'',
				id: '',
				customerId: '',
				title: '',
				enquipmentType: '',
				salary: '',
				workType: '',
				workDays: '',
				workTime: '',
				workHours: '',
				startTime: '',
				settType: '',
				viewNum: '',
				provinceId: '',
				cityId: '',
				districtId: '',
				status: '',
				auditStatus: '',
				gps: '',
				longitude: '',
				latitude: '',
				remark: '',
				delFlag: '',
				createTime: ''
			},
			rules: {
				title: {
					rules: [{
						required: true,
						errorMessage: '请输入替班标题',
					}, {
						minLength: 2,
						maxLength: 50,
						errorMessage: '替班标题长度在 {minLength} 到 {maxLength} 个字符',
					}]
				},
				phone: {
					rules: [{
						required: true,
						errorMessage: '请输入联系方式',
					}, {
						minLength: 2,
						maxLength: 15,
						errorMessage: '联系方式长度在 {minLength} 到 {maxLength} 个字符',
					}]
				},
				salary: {
					rules: [{
						required: true,
						errorMessage: '请输入薪资',
					}]
				},
				enquipmentType: {
					rules: [{
						required: true,
						errorMessage: '请选择设备类型',
					}]
				},
				provinceId: {
					rules: [{
						required: true,
						errorMessage: '请选择工地位置',
					}]
				},
				workType: {
					rules: [{
						required: true,
						errorMessage: '请选择施工类型',
					}]
				},
				workDays: {
					rules: [{
						required: true,
						errorMessage: '请输入替班天数',
					}]
				},
				workTime: {
					rules: [{
						required: true,
						errorMessage: '请选择上班时间',
					}]
				},
				workHours: {
					rules: [{
						required: true,
						errorMessage: '请选择工作时间',
					}]
				},
				settType: {
					rules: [{
						required: true,
						errorMessage: '请选择结算方式',
					}]
				}
			}
		}
	},
	async onLoad(options) {
		this.id = options.id;
		this.getDetail(options.id);
		this.getLocationInfo();
		uni.showLoading()
		let equipmentTypeData = await getDicts("equipment_type");
		let equipmentTypeJson = {
			"name":'请选择',
			"type": 'hierarchy',
			"submenu": equipmentTypeData
		}
		this.equipmentTypeOptions = [
			equipmentTypeJson
		];

		let eTypeIdx = this.$mHelper.getOptionIndex(equipmentTypeData,this.formData.enquipmentType);
		this.equipmentTypeDefaultSelected = [[eTypeIdx]];

		let workTypeData = await getDicts("tb_sglx");
		this.$refs.workTypeOptions.set({
			type: 'radio',
			index: this.$mHelper.getOptionIndex(workTypeData,this.formData.workType),
			column: 3,
			list: workTypeData
		});
		let workTimeData = await getDicts("tb_sbsj");
		this.$refs.workTimeOptions.set({
			type: 'radio',
			index: this.$mHelper.getOptionIndex(workTimeData,this.formData.workTime),
			column: 3,
			list: workTimeData
		});
		let workHoursData = await getDicts("tb_gzsj");
		this.$refs.workHoursOptions.set({
			type: 'radio',
			index: this.$mHelper.getOptionIndex(workHoursData,this.formData.workHours),
			column: 3,
			list: workHoursData
		});
		let settTypeData = await getDicts("tb_jzfs");
		this.$refs.settTypeOptions.set({
			type: 'radio',
			index: this.$mHelper.getOptionIndex(settTypeData,this.formData.settType),
			column: 3,
			list: settTypeData
		});

		let regions = await getSimpleRegions();
		let regionJson = {
			"name": '请选择',
			"type": 'hierarchy',
			"submenu": regions
		}
		this.regionFilterData = [
			regionJson
		];

		let regionIndex = this.formData.regionIndex;
		this.regionDefaultSelected = [regionIndex];

		if(this.formData.workHours === 'qt'){
			this.isElseHours = true;
		}
		uni.hideLoading()
	},
	onReady() {
		this.$refs.form.setRules(this.rules)

		let userInfo = uni.getStorageSync('userInfo');
		this.formData.phone = userInfo.mobile;
	},
	methods: {
		show: function(type) {
			this.setDateTime = '';
			this.startYear = new Date().getFullYear();
			this.endYear = new Date().getFullYear() + 1;
			this.$refs.dateTime.show();
		},
		change: function(e) {
			console.log(e);
			this.formData.startTime = e.result;
		},
		chooseLocation: function () {
			uni.chooseLocation({
				success: (res) => {
					this.formData.longitude = res.longitude;
					this.formData.latitude = res.latitude;
					this.formData.gps = res.address;
				}
			})
		},
		async remove() {
			let _this = this;
			uni.showModal({
				title: '提示',
				content: '确定要删除本数据吗？',
				success: async function (res) {
					if (res.confirm) {
						let res = await _this.$http.apiCall('get', '/tiban/tiban/delete', {id: _this.formData.id});
						if (res === 1) {
							_this.$mRouter.redirectTo({route: '/pages/tiban/list?isMy=true'});
						}
					}
				}
			});
		},
		// 获取示例详情
		async getDetail(id) {
			let res = await this.$http.apiCall('get', '/tiban/tiban/getById', {id:id});
			this.loading = false;
			if(res.name){
				uni.setNavigationBarTitle({
					title: res.name
				});
			}
			this.formData = res;
		},
		async	getLocationInfo() {
			console.log('getLocationInfo')
			var _this = this;
			uni.getLocation({
				type: 'wgs84',
				success(res) {
					console.log(res)
					_this.formData.latitude = res.latitude.toString();
					_this.formData.longitude = res.longitude.toString();
					uni.request({
						header: {
							"Content-Type": "application/text"
						},
						url: 'http://apis.map.qq.com/ws/geocoder/v1/?location=' + _this.formData.latitude + ',' + _this.formData.longitude + '&key=' + _this.$mConfig.qqMapKey,
						success(re) {
							console.log("中文位置")
							console.log(re)
							_this.formData.gps = re.data.result.address;
							if (re.statusCode === 200) {
								console.log("获取中文街道地理位置成功")
							} else {
								console.log("获取信息失败，请重试！")
							}
						}
					});
				}
			});
		},
		equipmentTypeChange(data) {
			this.formData.enquipmentType = data.value[0][0];
		},
		workTypeChange(data) {
			if (data) {
				this.formData.workType = data.value
			}
			console.log(data);
		},
		workTimeChange(data) {
			if (data) {
				this.formData.workTime = data.value
			}
			console.log(data);
		},
		workHoursChange(data) {
			if (data) {
				this.formData.workHours = data.value
				if(data.value === 'qt'){
					this.isElseHours = true;
					this.rules["workHoursElse"] = {
						rules: [{
							required: true,
							errorMessage: '请输入其他时间',
						}]
					};
				}else{
					this.isElseHours = false;
					delete this.rules.workHoursElse;
				}
			}
			console.log(data);
		},
		settTypeChange(data) {
			if (data) {
				this.formData.settType = data.value
			}
			console.log(data);
		},
		statusChange(data) {
			if (data) {
				this.formData.status = data.value
			}
			console.log(data);
		},
		auditStatusChange(data) {
			if (data) {
				this.formData.auditStatus = data.value
			}
			console.log(data);
		},

		regionConfirm(e) {
			this.formData.provinceId = e.value[0][0];
			this.formData.cityId = e.value[0][1];
			this.formData.districtId = e.value[0][2];
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
			let res = await this.$http.apiCall('post', '/tiban/tiban/update', JSON.stringify(this.formData));
			if (res === 1) {
				uni.showToast({
					title: `提交成功`,
					icon: 'none'
				})
				this.$mRouter.redirectTo({route: '/pages/tiban/list?isMy=true'});
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
.root-container {
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
