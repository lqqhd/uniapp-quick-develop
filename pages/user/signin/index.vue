<template>
	<view class="container">
		<tui-navigation-bar :isOpcity="false" @init="initNavigation" title="签到" color="#fff" transparent>
			<view class="tui-header__back" :style="{ top: top + 'px' }" @tap.stop="back">
				<image :src="webURL+'icon_back_3x.png'" class="tui-back__img"></image>
			</view>
		</tui-navigation-bar>
		<view class="tui-bg__box" :class="['tui-theme__' + theme]">
			<view class="tui-sign__record" :style="{ marginTop: height + 'px' }" @tap="themeChange">
				<view class="tui-record__item">
					<view class="tui-record__title">你已连续签到</view>
					<view class="tui-record__num">
						<text class="tui-num__size">{{signNum}}</text>
						天
					</view>
				</view>
				<view class="tui-record__item">
					<view class="tui-record__title">你的最高纪录</view>
					<view class="tui-record__num">
						<text class="tui-num__size">{{maxSignNum}}</text>
						天
					</view>
				</view>
			</view>
			<view class="tui-sign__navbar">
				<view class="tui-flex-center" @tap="switchTab(0)">
					<image :src="webURL + 'sign_img_calendar.png'" class="tui-navbar__img"></image>
				</view>
				<view class="tui-flex-center" @tap="switchTab(1)">
					<image :src="webURL + 'sign_img_ranking.png'" class="tui-navbar__img"></image>
				</view>
			</view>
			<image :style="{ transform: `translate3d(${current == 0 ? x1 : x2}px,0,0)` }" :src="webURL + 'sign_img_triangle.png'"
			 class="tui-tab__triangle"></image>
		</view>

		<view class="tui-content__box">
			<view class="tui-calendar__box" v-show="current == 0">
				<view class="tui-calendar__hrader">
					<view class="tui-arrow__box" @tap="monthChange(0)" v-show="swiperIndex>0">
						<image :src="webURL + 'sign_img_leftarrow.png'" class="tui-arrow__img"></image>
					</view>
					<view class="tui-calendar__title">{{ showTitle }}</view>
					<view class="tui-arrow__box tui-arrow__right" @tap="monthChange(1)" v-show="swiperIndex<2">
						<image :src="webURL + 'sign_img_goto.png'" class="tui-arrow__img"></image>
					</view>
				</view>
				<view class="tui-date__header tui-flex__between">
					<view class="tui-date">日</view>
					<view class="tui-date">一</view>
					<view class="tui-date">二</view>
					<view class="tui-date">三</view>
					<view class="tui-date">四</view>
					<view class="tui-date">五</view>
					<view class="tui-date">六</view>
				</view>
				<swiper class="tui-calendar__swiper" :style="{ height: calendarH + 'px' }" @change="change" :current="swiperIndex">
					<swiper-item v-for="(calendar, index) in calendarList" :key="index">
						<scroll-view scroll-y :style="{ height: calendarH + 'px' }">
							<view class="tui-date__content tui-pseudo__after tui-flex__between" :class="{'tui-pseudo__before':index===0}">
								<view class="tui-date__box tui-pseudo " :class="{ 'tui-date__today': calendar.year == year && calendar.month == month && item.date == day }"
								 v-for="(item, subIndex) in calendar.data" :key="subIndex" :style="{ minHeight: calendarH / 6 + 'px' }" @tap="detail(item.gift,item.point)">
									<view class="tui-date__num" v-if="item.date">{{ item.date }}</view>
									<image :src="webURL + 'signed_in_img.png'" class="tui-check__img" v-if="item.signed"></image>
									<image :src="item.gift | getGiftImg(webURL)" class="tui-gift__img" v-if="item.gift && !item.signed"></image>
<!--									<image :src="webURL + 'sign_btn_buqian.png'" class="tui-gift__img" v-if="calendar.year == year && calendar.month == month && item.date == day - 1 && item.signInDays == 0 && !item.gift"></image>-->
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
			<view class="tui-ranking__box" v-show="current == 1" :style="{ height: rankingH + 'px' }">
				<scroll-view scroll-y :style="{ height: rankingH + 'px' }">
					<view class="tui-ranking__content">
						<view class="tui-ranking__title">
							<image :src="webURL + 'sign_img_medal.png'" class="tui-medal__img"></image>
							<text>连续签到天数前10名：</text>
						</view>
						<view class="tui-ranking__item" :class="{ 'tui-ranking__bg': index % 2 !== 0 }" v-for="(item, index) in userList"
						 :key="index">
							<image :src="index | getRankingImg(webURL)" class="tui-ranking__img" v-if="index < 3"></image>
							<view class="tui-ranking__num" v-else>{{ index + 1 }}</view>
							<image :src="item.imgUrl" class="tui-avatar__img"></image>
							<view class="tui-sign__username">{{ item.name }}</view>
							<view class="tui-sign__days">{{ item.days }}天</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="tui-btn__sign" hover-class="tui-btn-sign__hover" :hover-stay-time="150" @tap="btnSign" v-if="!signed">签到</view>
		<tui-loading v-if="loading"></tui-loading>
	</view>
</template>

<script>
import { memberInfo } from '@/api/userInfo';
	//数据只为演示，并非真实操作，请根据实际情况对接数据
	export default {
		data() {
			return {
				webURL: 'https://yzimg.jikebang.com/gczh/imgs/signin/',
				height: 20,
				top: 12,
				statusBarHeight: 12,
				winWidth: 600,
				current: 0,
				x1: 0,
				x2: 0,
				theme: 'day', //主题：day|night 白天|夜晚
				calendarH: 380,
				rankingH: 420,
				userList: [],
				year: 2020,
				month: 7,
				day: 7,
				showTitle: '2020年07月',
				//日历数据
				calendarList: [],
				signed: true,
				swiperIndex: 1,
				loading: false,
				signList:[],
				signNum:0,
				maxSignNum:0,
				giftDays:0,
				giftPoint:0,
				nextGiftDate:[]
			};
		},
		async onLoad(options) {

			//获取签到规则
			let ruleRes = await this.$http.apiCall('post', '/querypointsignrule', {});
			if(ruleRes){
				this.giftDays = ruleRes.day;
				this.giftPoint = ruleRes.point;
			}

			//获取签到规则
			let memberRes = await this.$http.apiCall('post', '/queryTop10SignMember', {});
			if(memberRes){
				memberRes.forEach((item,index,array)=>{
					this.userList.push({
						name:item.nickname,
						imgUrl: item.image,
						days: item.maxSignNum
					})
				})
			}

			//获取用户信息
			this.getMemberInfo();

			//获取是否今天已签到
			let res = await this.$http.apiCall('post', '/istodaysign', {});
			if(res && res === 1){
				this.signed = false;
			}else{
				this.signed = true;
			}

			//获取签到记录，只获取最近两个月的记录
			let signListRes = await this.$http.apiCall('post', '/customersignlist', {pageNum:0,pageSize:65});
			if(signListRes){
				this.signList = signListRes.list;
			}

			const today = new Date();
			const hours = today.getHours();
			if (hours >= 18 || hours < 6) {
				this.theme = 'night';
			}
			//初始化日历数据  近3个月 (数据可后端传回)
			this.year = today.getFullYear();
			this.month = today.getMonth() + 1;
			this.day = today.getDate();

			//计算未来两个月内获取签到完成的日期列表
			let todayStr = this.$mHelper.formatDate(this.year,this.month,this.day);
			let startDate = today;
			let idx = this.signList.length < this.giftDays ?this.signList.length: this.giftDays;
			for (let i = 0; i < idx; i++) {
				let yestday = this.dayjs(startDate).add(-1, 'days').format('YYYY-MM-DD');
				if(this.signList[i].signData === yestday){
					startDate = this.dayjs(startDate).add(-1, 'days');
				}
			}

			for (let i = 1; i < 10; i++) {
				let nextGiftDae = this.dayjs(startDate).add(i*7, 'days').format('YYYY-MM-DD');
				this.nextGiftDate.push(nextGiftDae);
			}

			this.showTitle = `${this.year}年${this.formatNum(this.month)}月`;
			this.calendarList = [{}, this.getCalendarData(this.year, this.month, 1), {}];

			setTimeout(() => {
				let sys = uni.getSystemInfoSync();
				this.winWidth = sys.windowWidth;
				const w = uni.upx2px(32) / 2;
				this.x1 = this.winWidth / 4 - w;
				this.x2 = (this.winWidth * 3) / 4 - w;
				let h = 440;
				// #ifdef H5
				h = 400;
				// #endif
				this.calendarH = sys.windowHeight - uni.upx2px(h + 100 + 64);
				this.rankingH = sys.windowHeight - uni.upx2px(h);
			}, 66);


		},
		filters: {
			getRankingImg(index, webURL) {
				index = index || 0;
				let img = '';
				if (index < 3) {
					img = webURL + ['sign_img_first.png', 'sign_img_second.png', 'sign_img_third.png'][index];
				}
				return img;
			},
			getGiftImg(gift, webURL) {
				gift = gift || 0;
				return webURL + ['', 'sign_img_gift.png', 'sign_img_double.png','sign_img_open.png'][gift];
			}
		},
		methods: {
			initNavigation(e) {
				this.height = e.height;
				this.top = e.top;
				this.statusBarHeight = e.statusBarHeight;
			},
			back() {
				let pages = getCurrentPages();
				if (pages.length > 1) {
					uni.navigateBack();
				} else {
					uni.switchTab({
						url: '/pages/tabbar/index/index'
					});
				}
			},
			switchTab(index) {
				this.current = index;
			},
			//此处只为做演示，实际开发应按照时间切换
			themeChange() {
				this.theme = this.theme === 'day' ? 'night' : 'day';
			},
			formatNum: function(num) {
				return num < 10 ? '0' + num : num + '';
			},
			//一个月有多少天
			getMonthDay(year, month) {
				let days = new Date(year, month, 0).getDate();
				return days;
			},
			getWeekday(year, month) {
				let date = new Date(`${year}/${month}/01 00:00:00`);
				return date.getDay();
			},
			change: function(e) {
				let current = e.detail.current;
				let year = this.year;
				let month = this.month;
				this.swiperIndex = current;
				setTimeout(() => {
					if (current == 0) {
						month = month - 1;
						year = month < 1 ? year - 1 : year;
						month = month < 1 ? 12 : month;
						if (!this.calendarList[0].data) {
							// this.loading=true;
							this.$set(this.calendarList, 0, this.getCalendarData(year, month, 0))
						}
					} else if (current == 2) {
						month = month + 1;
						year = month > 12 ? year + 1 : year;
						month = month > 12 ? 1 : month;
						if (!this.calendarList[2].data) {
							// this.loading=true;
							this.$set(this.calendarList, 2, this.getCalendarData(year, month, 2))
						}
					}
					this.showTitle = `${year}年${this.formatNum(month)}月`;
					// this.loading=false;
				}, 300)
			},
			getCalendarData(year, month, index) {
				this.days = this.getMonthDay(year, month);
				//前补位
				let frontItemNum = this.getWeekday(year, month);
				//后补位
				let behindItemNum = 42 - this.days - frontItemNum;
				let data = [];
				for (let f = 0; f < frontItemNum; f++) {
					data.push({});
				}

				for (let i = 0; i < this.days; i++) {
					//根据实际情况调整即可
					//连续签到天数
					let signInDays = 0;

					//是否已签到
					let signed = false;
					let today = this.$mHelper.formatDate(year,month,i+1);
					let daySignd = this.signList.find(item => {
						return item.signData === today;
					});
					if(daySignd){
						signed = true;
					}

					//到达签到天数的礼品标志
					//gift:0-无奖励，1-礼品 2-积分翻倍 3-礼品已赠送
					let gift = 0;
					let getPoint = 0;
					let giftOpend = this.signList.find(item => {
						return item.signData === today && item.point >= this.giftPoint;
					});
					if(giftOpend){
						gift = 3;
						signed = false;
						getPoint = giftOpend.point;
					}

					let nextDate = this.nextGiftDate.find(item => {
						return item === today;
					});
					if(nextDate){
						gift = 1;
						signed = false;
					}

					data.push({
						date: i + 1,
						signInDays: signInDays,
						gift: gift,
						signed: signed,
						point:getPoint
					});
				}
				for (let b = 0; b < behindItemNum; b++) {
					data.push({});
				}

				return {
					year: year,
					month: month,
					frontItemNum: frontItemNum,
					behindItemNum: behindItemNum,
					data: data
				};
			},
			monthChange(index) {
				if (index === 0) {
					this.swiperIndex = this.swiperIndex - 1
				} else {
					this.swiperIndex = this.swiperIndex + 1
				}
			},
			detail(gift,point) {
				if (gift === 1) {
					let title = '每连续签到'+this.giftDays+'天即可赠送'+this.giftPoint+'积分！'
					this.tui.modal('礼品',title, false, (res) => {}, "#fa523e")
				}else if(gift === 3){
					let title = '恭喜您本次获赠'+point+'积分！'
					this.tui.modal('获奖提示',title, false, (res) => {}, "#fa523e")
				}
				// else if (gift == 2) {
				// 	this.tui.modal('积分双倍', '每连续签到21天即可领取双倍积分奖励', false, (res) => {}, "#fa523e")
				// }
				// if (missedSign) {
				// 	this.tui.modal('补签', '您本月的补签机会已用完', false, (res) => {}, "#fa523e")
				// }

			},
			//"1：成功 -1：没有开启签到活动 -2：今天已签到"
			async btnSign() {
					let res = await this.$http.apiCall('post', '/signin', {});
					if(res){
						if(res === 1){
							this.tui.toast('签到成功');
							let frontItemNum = this.getWeekday(this.year, this.month);
							let item = this.calendarList[1];
							item.data[this.day - 1 + frontItemNum].signed = true;
							this.signed = true;
							await this.getMemberInfo();
						}else if(res === -1){
							this.tui.toast('没有开启签到活动');
						}else if(res === -2){
							this.tui.toast('今天已签到');
						}
					}
			},
			// 获取用户信息
			async getMemberInfo() {
				await this.$http.get(memberInfo).then(async res => {
						this.signNum = res.signNum;
						this.maxSignNum = res.maxSignNum;
					})
			},
		}
	};
</script>

<style>
	page,
	.container {
		min-height: 100%;
		background-color: #ffffff;
	}

	.tui-header__back {
		position: absolute;
		left: 12rpx;
	}

	.tui-back__img {
		width: 60rpx;
		height: 60rpx;
	}

	.tui-bg__box {
		width: 100%;
		/* #ifndef H5 */
		height: 440rpx;
		/* #endif */
		/* #ifdef H5 */
		height: 400rpx;
		/* #endif */
		padding-left: 30rpx;
		padding-right: 30rpx;
		box-sizing: border-box;
		position: relative;
	}

	.tui-theme__day {
		background: linear-gradient(to bottom, #1a8ad5, #9be6e9);
	}

	.tui-theme__night {
		background: linear-gradient(to bottom, #27223e, #5b3863);
	}

	.tui-sign__record {
		width: 100%;
		height: 160rpx;
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 40rpx;
		display: flex;
		align-items: center;
	}

	.tui-record__item {
		flex: 1;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		font-size: 28rpx;
		position: relative;
	}

	.tui-record__item:first-child::after {
		content: '';
		position: absolute;
		width: 1rpx;
		height: 76%;
		right: 0;
		top: 12%;
		background-color: rgba(0, 0, 0, 0.2);
		transform: scaleX(0.5);
		transform-origin: 100% 0;
	}

	.tui-record__title {
		color: rgba(255, 255, 255, 0.7);
	}

	.tui-record__num {
		color: #ffffff;
		padding-top: 8rpx;
	}

	.tui-num__size {
		font-size: 64rpx;
		line-height: 64rpx;
		padding-right: 8rpx;
	}

	.tui-sign__navbar {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: absolute;
		left: 0;
		bottom: 40rpx;
	}

	.tui-navbar__img {
		width: 54rpx;
		height: 54rpx;
	}

	.tui-flex-center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-tab__triangle {
		width: 38rpx;
		height: 20rpx;
		position: absolute;
		left: 0;
		bottom: 0;
		transition: 0.2s;
	}

	.tui-flex__between {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-calendar__hrader {
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		position: relative;
		display: flex;
		align-items: center;
	}

	.tui-arrow__right {
		margin-left: auto;
	}

	.tui-calendar__title {
		color: #bbb;
		font-size: 32rpx;
		line-height: 32rpx;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	.tui-arrow__box {
		padding: 20rpx 20rpx 20rpx 0;
	}

	.tui-arrow__box:last-child {
		padding-right: 0 !important;
		padding-left: 20rpx;
	}

	.tui-arrow__img {
		width: 16rpx;
		height: 31rpx;
	}

	.tui-date__header {
		width: 100%;
		height: 64rpx;
		color: #bbb;
	}

	.tui-date {
		flex: 1;
		flex-shrink: 0;
		text-align: center;
		font-size: 28rpx;
		line-height: 28rpx;
	}

	.tui-date__content {
		flex-wrap: wrap;
		position: relative;
	}

	.tui-pseudo::before,
	.tui-pseudo__before::before {
		content: ' ';
		position: absolute;
		width: 1px;
		height: 100%;
		-webkit-transform: scaleX(0.5);
		transform: scaleX(0.5);
		z-index: 2;
		pointer-events: none;
	}

	.tui-pseudo::after,
	.tui-pseudo__after::after {
		content: ' ';
		position: absolute;
		right: 0;
		left: 0;
		width: 100%;
		height: 1px;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		z-index: 2;
		pointer-events: none;
	}

	.tui-date__content::before {
		bottom: 0;
		left: 0;
		border-left: 1px solid #eaeef1;
		transform-origin: 0 0;
	}

	.tui-date__content::after {
		bottom: 0;
		border-bottom: 1px solid #eaeef1;
		transform-origin: 0 100%;
	}

	.tui-date__box {
		width: 14.2857%;
		height: 146rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		flex-shrink: 0;
		position: relative;
		padding: 20rpx 0;
		box-sizing: border-box;
	}

	.tui-date__box::before {
		top: 0;
		right: 0;
		border-right: 1px solid #eaeef1;
		transform-origin: 100% 0;
	}

	.tui-date__box::after {
		top: 0;
		border-top: 1px solid #eaeef1;
		transform-origin: 0 0;
	}

	.tui-date__today {
		background-color: #fff7e9;
	}

	.tui-date__num {
		font-size: 26rpx;
		color: #bbb;
	}

	.tui-gift__img {
		width: 52rpx;
		height: 52rpx;
		flex-shrink: 0;
	}

	.tui-check__img {
		width: 34rpx;
		height: 25rpx;
		flex-shrink: 0;
	}

	.tui-ranking__content {
		padding: 40rpx 0 30rpx;
		box-sizing: border-box;
	}

	.tui-ranking__title {
		width: 100%;
		display: flex;
		align-items: center;
		color: #bbb;
		font-size: 28rpx;
		padding: 20rpx 30rpx;
		box-sizing: border-box;
	}

	.tui-medal__img {
		width: 27rpx;
		height: 35rpx;
		margin-right: 12rpx;
	}

	.tui-ranking__item {
		width: 100%;
		padding: 30rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-ranking__img {
		width: 48rpx;
		height: 48rpx;
		margin-right: 30rpx;
		flex-shrink: 0;
	}

	.tui-ranking__num {
		width: 44rpx;
		text-align: center;
		font-size: 32rpx;
		color: #bbb;
		margin-right: 30rpx;
		flex-shrink: 0;
	}

	.tui-avatar__img {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.tui-sign__username {
		width: 360rpx;
		font-size: 30rpx;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.tui-sign__days {
		font-size: 26rpx;
		margin-left: auto;
		color: #f8683c;
	}

	.tui-ranking__bg {
		background-color: #f8f8f8;
	}

	.tui-btn__sign {
		width: 340rpx;
		height: 72rpx;
		border-radius: 72rpx;
		position: fixed;
		left: 50%;
		bottom: 60rpx;
		transform: translateX(-50%);
		z-index: 3;
		color: #fff;
		background: linear-gradient(to right, #ff9d4b, #fa523e);
		box-shadow: 0 10rpx 14rpx 0 rgba(250, 82, 62, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-btn-sign__hover {
		background: linear-gradient(to right, #e48642, #e14b38);
	}
	.container {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}
</style>
