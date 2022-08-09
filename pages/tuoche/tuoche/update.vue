<template>
	<view>
		<hx-navbar :config="{title: '新增拖车'}"/>
		<!-- :rules="rules" -->
		<uni-forms v-model="formData" ref="form" validate-trigger="bind" @submit="submit" err-show-type="undertext" @validate="validate">
			<uni-group title="基本信息">
				<uni-forms-item name="name" label="称呼" required>
					<input type="text" v-model="formData.name" class="uni-input-border" placeholder="请输入称呼" @input="binddata('name',$event.detail.value)">
				</uni-forms-item>
				<uni-forms-item name="carInfo" label="拖车信息" required>
					<input type="text" v-model="formData.carInfo" class="uni-input-border" placeholder="请输入拖车信息，11.7米平板车，15米爬梯车" @input="binddata('carInfo',$event.detail.value)">
				</uni-forms-item>
				<uni-forms-item name="images" label="车辆图片" required>
					<view style="width: 100%">
						<sunui-upimg @change="getimagesImageInfo" ref="imagesUpimg"></sunui-upimg>
					</view>
				</uni-forms-item>
				<uni-forms-item label="服务地区" required>
					<!--地址三级联动-->
					<uni-right-selecter :filterData="provinceIdFilterData" :defaultSelected="provinceIdDefaultSelected" title="省份ID" @confirm="provinceIdConfirm"></uni-right-selecter>
				</uni-forms-item>
				<uni-forms-item name="area" label="区域范围" >
					<input type="text" v-model="formData.area" class="uni-input-border" placeholder="请输入区域范围" @input="binddata('area',$event.detail.value)">
				</uni-forms-item>
				<uni-forms-item name="serviceTime" label="服务时间" required>
					<jkb-checkbox ref="serviceTimeOptions" @change="serviceTimeChange" style="width: 100%"></jkb-checkbox>
				</uni-forms-item>
				<uni-forms-item name="serviceContent" label="服务内容" required>
					<textarea type="text" v-model="formData.serviceContent" class="uni-textarea-border" placeholder="请输入服务内容"
										@input="binddata('serviceContent',$event.detail.value)"></textarea>
				</uni-forms-item>

				<uni-forms-item name="phone" label="联系电话" required>
					<input type="text" v-model="formData.phone" class="uni-input-border" placeholder="请输入联系电话" @input="binddata('phone',$event.detail.value)">
				</uni-forms-item>


			</uni-group>
			<!-- 直接使用组件自带submit、reset 方法，小程序不生效 -->
			<!-- <button class="button" form-type="submit">Submit</button>
				<button class="button" form-type="reset">Reset</button> -->
			<view class="bottom-action">
				<button class="button" @click="remove">删除</button>
				<button class="button" @click="submitForm('form')">提交修改</button>
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
			provinceIdFilterData: [],
			provinceIdDefaultSelected: [],
			formData: {
				id: '',
				customerId: '',
				name: '',
				carInfo: '',
				serviceTime: '',
				serviceContent: '',
				area: '',
				url: '',
				images: '',
				phone: '',
				viewNum: '',
				provinceId: '',
				cityId: '',
				districtId: '',
				auditStatus: '',
				star: '',
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
				carInfo: {
				rules: [{
					required: true,
					errorMessage: '请输入拖车信息',
				}]
			},
				serviceTime: {
				rules: [{
					required: true,
					errorMessage: '请输入服务时间',
				}]
			},
				serviceContent: {
				rules: [{
					required: true,
					errorMessage: '请输入服务内容',
				}]
			},
				images: {
				rules: [{
					required: true,
					errorMessage: '请输入设备图片',
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
					errorMessage: '请输入省份ID',
				}]
			},
			}
		}
	},
	async onLoad(options) {
		uni.showLoading()
		this.id = options.id;
		this.getDetail(options.id);
		let tmpData1,tmpData2;
		let serviceTimeData = await getDicts("tuoche_fwsj");
		this.$refs.serviceTimeOptions.set({
			type:'radio',
			index:-1,
			column:3,
			list:serviceTimeData
		});
	let images = this.formData.images;
	if(images){
		let imgArr = images.split(",");
		let bf = [];
		let uc = [];
		for (let i = 0; i < imgArr.length; i++) {
			let img = {
				path:imgArr[i]
			}
			bf.push(img)
			uc.push(imgArr[i]);
		}
		// 这里放置服务器预览图片链接地址
		this.$refs.imagesUpimg.upload_before_list = bf;
		this.$refs.imagesUpimg.upload_cache_list = uc;
	}
	let provinceIds = await getSimpleRegions();
	let provinceIdJson = {
		"name": '请选择',
		"type": 'hierarchy',
		"submenu": provinceIds
	}
	this.provinceIdFilterData = [
			provinceIdJson
	];

	let provinceIdIndex = this.formData.regionIndex;
	this.provinceIdDefaultSelected = [provinceIdIndex];

		uni.hideLoading()
	},
	onReady() {
		this.$refs.form.setRules(this.rules)
				let userInfo = uni.getStorageSync('userInfo');
				this.formData.phone = userInfo.mobile;
	},
	methods: {
		// 获取示例详情
		async getDetail(id) {
			let res = await this.$http.apiCall('get', '/tuoche/tuoche/getById', {id:id});
			this.loading = false;
			if(res.name){
				uni.setNavigationBarTitle({
					title: res.name
				});
			}
			this.formData = res;
		},
		serviceTimeChange(data){
			if(data){
				this.formData.serviceTime = data.value
			}
			console.log(data);
		},
		// 上传图片或者删除图片返回信息
		getimagesImageInfo(e) {
			console.log('返回图片信息：',e);
			if(e && e.length > 0){
				this.formData.url = e[0];
				this.formData.images = e.join(",");
			}else{
				this.formData.url = "";
				this.formData.images = "";
			}
			console.log('返回图片信息->缩略图：',this.formData.url);
			console.log('返回图片信息->图像串：',this.formData.images);
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
			let res = await this.$http.apiCall('post', '/tuoche/tuoche/update', JSON.stringify(this.formData));
			if(res === 1){
				uni.showToast({
					title: `提交成功`,
					icon: 'none'
				})
				this.$mRouter.redirectTo({ route: '/pages/tuoche/tuoche/list?isMy=true' });
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

		async remove() {
			let _this = this;
			uni.showModal({
				title: '提示',
				content: '确定要删除本数据吗？',
				success: async function (res) {
					if (res.confirm) {
						let res = await _this.$http.apiCall('get', '/tuoche/tuoche/delete', {id:_this.formData.id});
						if(res === 1){
							_this.$mRouter.redirectTo({ route: '/pages/tuoche/tuoche/list?isMy=true' });
						}
					}
				}
			});
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
