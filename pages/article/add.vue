<template>
	<view class="root-container">
		<!-- :rules="rules" -->
		<uni-forms v-model="formData" ref="form" validate-trigger="bind" @submit="submit" err-show-type="undertext" @validate="validate">
			<uni-group title="基本信息">
						<uni-forms-item name="title" label="文章标题">
					<input type="text" v-model="formData.title" class="uni-input-border" placeholder="请输入文章标题" @input="binddata('title',$event.detail.value)">
				</uni-forms-item>
						<uni-forms-item name="author" label="作者">
					<input type="text" v-model="formData.author" class="uni-input-border" placeholder="请输入作者" @input="binddata('author',$event.detail.value)">
				</uni-forms-item>
						<uni-forms-item name="columnId" label="文章所属栏目id">
					<input type="text" v-model="formData.columnId" class="uni-input-border" placeholder="请输入文章所属栏目id" @input="binddata('columnId',$event.detail.value)">
				</uni-forms-item>
						<uni-forms-item name="sort" label="排序 数值越小 排序越前">
					<input type="text" v-model="formData.sort" class="uni-input-border" placeholder="请输入排序 数值越小 排序越前" @input="binddata('sort',$event.detail.value)">
				</uni-forms-item>
						<uni-forms-item name="isRelease" label="是否发布 0 发布 1 不发布  默认0 ">
					<input type="text" v-model="formData.isRelease" class="uni-input-border" placeholder="请输入是否发布 0 发布 1 不发布  默认0 " @input="binddata('isRelease',$event.detail.value)">
				</uni-forms-item>
						<uni-forms-item name="seoKeywords" label="seo关键字">
					<input type="text" v-model="formData.seoKeywords" class="uni-input-border" placeholder="请输入seo关键字" @input="binddata('seoKeywords',$event.detail.value)">
				</uni-forms-item>
						<uni-forms-item name="seoDesc" label="see描述">
					<input type="text" v-model="formData.seoDesc" class="uni-input-border" placeholder="请输入see描述" @input="binddata('seoDesc',$event.detail.value)">
				</uni-forms-item>
						<uni-forms-item name="desc" label="文章描述">
					<input type="text" v-model="formData.desc" class="uni-input-border" placeholder="请输入文章描述" @input="binddata('desc',$event.detail.value)">
				</uni-forms-item>
						<uni-forms-item name="image" label="缩略图">
					<input type="text" v-model="formData.image" class="uni-input-border" placeholder="请输入缩略图" @input="binddata('image',$event.detail.value)">
				</uni-forms-item>
						<uni-forms-item name="delFlag" label="删除标记 0 未删除 1 删除">
					<input type="text" v-model="formData.delFlag" class="uni-input-border" placeholder="请输入删除标记 0 未删除 1 删除" @input="binddata('delFlag',$event.detail.value)">
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
import {getDicts} from '@/api/system';
import rfPickRegions from '@/components/rf-pick-regions';
	export default {
		components: {
			rfPickRegions
		},
		data() {
			return {
				addressData: {
					provinceId: '',
					cityId: '',
					countryId: ''
				},
				formData: {
		id: '',
		title: '',
		author: '',
		columnId: '',
		sort: '',
		isRelease: '',
		seoKeywords: '',
		seoDesc: '',
		desc: '',
		image: '',
		delFlag: '',
		createTime: '',
		modifyTime: '',
		delTime: '',
				},
				rules: {
					name: {
						rules: [{
							required: true,
							errorMessage: '请输入用户名',
						}, {
							minLength: 2,
							maxLength: 15,
							errorMessage: '姓名长度在 {minLength} 到 {maxLength} 个字符',
						}]
					}
				}
			}
		},
		async onLoad() {
			uni.showLoading()
			uni.hideLoading()
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {

			// 获取选择的地区
			handleGetRegions(e) {
				console.log(e)
				this.formData.provinceId = e.provinceId;
				this.formData.cityId = e.cityId;
				this.formData.districtId = e.countryId;
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
				let res = await this.$http.apiCall('post', '/article/add', JSON.stringify(this.formData));
				if(res === 1){
					uni.showToast({
						title: `提交成功`,
						icon: 'none'
					})
					this.$mRouter.redirectTo({ route: '/pages/article/list' });
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
