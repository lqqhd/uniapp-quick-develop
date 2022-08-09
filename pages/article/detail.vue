<template>
	<view class="container">
		<view class="content">
			<view class="detail">
				<view class="title">{{ info.title }}</view>
				<view class="info">
					<view class="source-date">
						<text class="source" v-if="info.sourceUrl" @tap="copyText(info.sourceUrl)">{{ info.source }}</text>
						<text class="source" v-else>{{ info.author }}</text>
						<text class="date hidden">{{ info.modifyTime }}</text>
					</view>
					<view class="read">阅读 {{ info.readNum }}</view>
				</view>
				<view class="desc"><rf-parser :html="info.desc"></rf-parser></view>
				<view class="declaration" v-if="info.sourceUrl">
					本文转载至{{ info.source }}，
					<text @tap="copyText(info.sourceUrl)">点此可查看原文链接。</text>
					如有侵权，请联系我们，我们将在最短的时间内处理。
				</view>
			</view>
			<view class="comment">
				<view class="title">
					<text>全部评论</text>
					<text class="count" v-if="info.commentCount > 0">({{ info.commentCount }})</text>
				</view>
				<view class="item" v-for="(item, index) in info.commentList" :key="index">
					<view class="avatar"><image :src="item.userAvatar"></image></view>
					<view class="comment-info">
						<view class="nickname-like">
							<view class="nickname">{{ item.userName }}</view>
							<view class="like">
								<image @tap="commentLike(item.id, index)" v-show="!item.liked" src="https://yzimg.jikebang.com/gczh/imgs/article/icon_like_01.png"></image>
								<image @tap="commentLike(item.id, index)" v-show="item.liked" src="https://yzimg.jikebang.com/gczh/imgs/article/icon_like_01_hover.png"></image>
								<view class="like-count">{{ item.likeCount }}</view>
							</view>
						</view>
						<navigator class="comment-desc" :url="'/pages/comment/commentDetail?id=' + item.id" hover-class="none">{{ item.content }}</navigator>
						<view class="date-reply">
							<navigator class="date" :url="'/pages/comment/commentDetail?id=' + item.id" hover-class="none">{{ item.createTime }}</navigator>
							<navigator class="reply" :url="'/pages/comment/commentDetail?operate=reply' + '&id=' + item.id">回复TA</navigator>
						</view>
						<navigator class="reply-count" v-if="item.replyCount > 0" :url="'/pages/comment/commentDetail?id=' + item.id" hover-class="none">
							全部{{ item.replyCount }}条回复 >
						</navigator>
					</view>
				</view>
				<loading v-if="hasMoreData"></loading>
				<view class="no-comment" v-if="info.commentCount === 0">暂无评论，快来抢占沙发吧~</view>
			</view>
			<view class="float-empty"></view>
			<view class="comment-bar" v-show="!showAddComment && showCommenBar">
				<view class="input" @tap="initAddComment(true)"><text>发表评论</text></view>
				<view class="operate">
					<navigator :url="'comment?article_id=' + id" class="info" hover-class="none">
						<image src="https://yzimg.jikebang.com/gczh/imgs/article/icon_comment_02.png"></image>
						<text class="count" v-if="info.commentCount > 0">{{ info.commentCount }}</text>
					</navigator>
					<view class="like">
						<image @tap="like()" v-show="!info.liked" src="https://yzimg.jikebang.com/gczh/imgs/article/icon_like_02.png"></image>
						<image @tap="like()" v-show="info.liked" src="https://yzimg.jikebang.com/gczh/imgs/article/icon_like_02_hover.png"></image>
					</view>
					<view class="favorite">
						<image @tap="toFavorite()" v-show="!favorite" src="https://yzimg.jikebang.com/gczh/imgs/article/icon_favorite.png"></image>
						<image @tap="toFavorite()" v-show="favorite" src="https://yzimg.jikebang.com/gczh/imgs/article/icon_favorite_hover.png"></image>
					</view>
					<button open-type="share" class="share"><image src="https://yzimg.jikebang.com/gczh/imgs/article/icon_share.png"></image></button>
				</view>
			</view>
			<!-- #ifdef MP -->
			<view class="bg-masker" v-if="showAddComment" @tap="initAddComment(false)"></view>
			<view class="add-comment" v-if="showAddComment">
				<view class="info">
					<view class="input">
						<textarea
							:show-confirm-bar="false"
							:cursor-spacing="20"
							ref="commentContent"
							:maxlength="200"
							:auto-height="true"
							:fixed="true"
							:focus="showAddComment"
							v-model.trim="commentContent"
							placeholder-class="input-bg"
							:placeholder="replyCommentId > 0 ? '回复 ' + replyNickname + '：' : '发表评论'"
						/>
					</view>
					<view class="add">
						<button class="mini-btn" type="primary" size="mini" @click="addCommentOrReply()">{{ replyCommentId > 0 ? '回复' : '发表' }}</button>
					</view>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifndef MP -->
			<uni-popup ref="popup" @change="initAddComment(false)" type="bottom">
				<view class="add-comment">
					<view class="info">
						<view class="input">
							<textarea
								:cursor-spacing="20"
								:show-confirm-bar="false"
								:auto-height="true"
								:fixed="true"
								:maxlength="200"
								:focus="addCommentFocus"
								v-model.trim="commentContent"
								placeholder-class="input-bg"
								:placeholder="replyCommentId > 0 ? '回复 ' + replyNickname + '：' : '发表评论'"
							/>
						</view>
						<view class="add">
							<button class="mini-btn" type="primary" size="mini" @click="addCommentOrReply()">{{ replyCommentId > 0 ? '回复' : '发表' }}</button>
						</view>
					</view>
				</view>
			</uni-popup>
			<!-- #endif -->
			<uni-popup ref="sharePopup" type="share" v-show="false">
				<view class="h5-share">
					<view class="title">分享到</view>
					<view class="share-icon">
						<view @tap="showBrowserShareTips()">
							<image class="wechat" src="https://yzimg.jikebang.com/gczh/imgs/article/icon_wechat.png"></image>
							<text>微信</text>
						</view>
						<view @tap="showBrowserShareTips()">
							<image src="https://yzimg.jikebang.com/gczh/imgs/article/icon_qq.png"></image>
							<text>QQ</text>
						</view>
						<view @tap="openLink('https://service.weibo.com/share/share.php?url=' + currentUrl + '&title=' + info.title + '&pic=' + info.image)">
							<image src="https://yzimg.jikebang.com/gczh/imgs/article/icon_weibo.png"></image>
							<text>新浪微博</text>7
						</view>
						<view
							@tap="openLink('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey??url=' + currentUrl + '&title=' + info.title + '&pics=' + info.image)"
						>
							<image src="https://yzimg.jikebang.com/gczh/imgs/article/icon_qqkj.png"></image>
							<text>QQ空间</text>
						</view>
					</view>
					<view class="share-btn" @tap="closeH5Share">取消</view>
				</view>
			</uni-popup>
			<view @tap="closeShareTip()" class="share-maske" v-show="showShareTip">
				<view class="share-tip">
					<image class="share-tip-info" mode="aspectFit" src="/static/images/share_tip_info.png"></image>
					<image @tap="closeShareTip()" class="share-tip-btn" mode="aspectFit" src="/static/images/share_tip_btn.png"></image>
				</view>
			</view>
			<view @tap="closeBrowserShareTip()" class="share-maske" v-show="showBrowserShareTip">
				<view class="share-tip share-browser-tip">
					<image class="share-tip-info" mode="aspectFit" src="/static/images/share_tip_browser.png"></image>
					<image @tap="closeBrowserShareTip()" class="share-tip-btn" mode="aspectFit" src="/static/images/share_tip_btn.png"></image>
				</view>
			</view>
		</view>
		<pageLoading v-if="showPageLoading"></pageLoading>
	</view>
</template>

<script>
import pageLoading from '@/components/loading/pageLoading.vue';
import loading from '@/components/loading/loading.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: {
		pageLoading,
		loading,
		uniPopup
	},
	data() {
		return {
			id: 0,
			favorite:false,
			info: { comment: { count: 0, list: [] } },
			showAddComment: false,
			showCommenBar: true,
			addCommentFocus: false,
			commentContent: '',
			replyCommentId: 0,
			replyNickname: '',
			pageNum: 1,
			pageSize: 10,
			hasMoreData: false,
			showPageLoading: true,
			currentUrl: '',
			shareUrl: '',
			showShareTip: false,
			showH5Share: false,
			showBrowserShareTip: false,
			hasLogin: false,
			queryParams: {}
		};
	},
	onShow(e) {
		if (this.pageNum > 1) {
			this.pageNum = 1;
			this.getData();
		}

		/*来源是登录时更新*/
		let source = uni.getStorageSync('source');
		if (source == 'login') {
			uni.removeStorageSync('source');
			this.loadData();
		}

		/*当前页面*/
		if (!uni.getStorageSync('source')) {
			uni.setStorageSync('source', 'article/detail');
		}
	},
	async onLoad(e) {
		if (e.id > 0) {
			this.id = e.id;
		}
		// #ifdef H5
		this.currentUrl = encodeURIComponent(window.location.href);
		// #endif
		this.getData();
		this.hasLogin = this.$mStore.getters.hasLogin;
		this.favorite = await this.hasAttention();
	},
	onPullDownRefresh() {
		uni.showLoading({
			title: '刷新中'
		});
		this.pageNum = 0;
		this.getData();
	},
	onReachBottom(e) {
		if (this.hasMoreData) {
			this.getComment();
		}
	},
	/*小程序分享*/
	onShareAppMessage() {
		return {
			path: '/pages/article/detail?id=' + this.info.id,
			success: function(e) {},
			title: this.info.title,
			imageUrl: this.info.image
		};
	},
	methods: {
		/*加载数据*/
		loadData() {
			this.getData();
		},

		/*获取文章详情*/
		async getData() {
			let res = await this.$http.apiCall('get', '/article/detail', {id: this.id});
			this.info = res;
			uni.setNavigationBarTitle({
				title: this.info.title
			});
			// if (res.data.comment.page > this.pageNum) {
			this.hasMoreData = true;
			// } else {
			// 	this.hasMoreData = false;
			// }
			this.pageNum += 1;
			// this.initMPShare(); //公众号分享
			this.showPageLoading = false;
			uni.stopPullDownRefresh();
			uni.hideLoading();
		},

		/*点赞*/
		async like() {
			let likeParams = {
				bizType: '1',
				bizId: this.id
			}
			let url = '/system/likes/add';
			if (this.info.liked == true) {
				url = '/system/likes/del';
			}
			let res = await this.$http.apiCall('post', url, JSON.stringify(likeParams));
			if(res){
				console.log('res');
				this.info.liked = !this.info.liked;
				let msg = this.info.liked ? '点赞成功' : '已取消点赞';
				this.$mHelper.toast(msg, 'success');
			}
		},

		/*评论点赞*/
		async commentLike(commentId, index) {
			let likeParams = {
				bizType: '99',
				bizId: commentId
			}
			let url = '/system/likes/add';
			if (this.info.commentList[index].liked == true) {
				url = '/system/likes/del';
			}
			let res = await this.$http.apiCall('post', url, JSON.stringify(likeParams));
			if (res == 1) {
				if (this.info.commentList[index].liked) {
					this.info.commentList[index].liked = false;
					this.info.commentList[index].likeCount -= 1;
				} else {
					this.info.commentList[index].liked = true;
					this.info.commentList[index].likeCount += 1;
				}
				let msg = this.info.commentList[index].liked ? '点赞成功' : '已取消点赞';
				this.$mHelper.toast(msg);
			} else {
				this.$mHelper.toast(res.msg);
			}
		},
		/*收藏*/
		favorite() {
			this.$app.request({
				url: this.$api.article.favorite,
				data: {
					article_id: this.id
				},
				method: 'POST',
				dataType: 'json',
				success: res => {
					console.log('res');
					if (res.code == 0) {
						this.info.isFavorite = !this.info.isFavorite;
						let msg = this.info.isFavorite ? '收藏成功' : '已取消收藏';
						this.$mHelper.toast(msg, 'success');
					} else {
						this.$mHelper.toast(res.msg, 'warning');
					}
				}
			});
		},

		/*初始化添加评论*/
		initAddComment(isShow) {
			if (isShow && !this.hasLogin) {
				uni.showModal({
					content: '你暂未登陆，是否跳转登录页面？',
					success: (confirmRes) => {
						if (confirmRes.confirm) {
							this.$mRouter.push({route: '/pages/public/logintype'});
						}
					}
				});
			}
			if (isShow && !this.showAddComment) {
				// #ifndef MP
				this.$refs.popup.open()
				// #endif
			}
			this.showAddComment = isShow;
			this.commentContent = '';
			if (this.replyCommentId > 0) {
				this.replyCommentId = 0;
				this.replyNickname = '';
			}
			setTimeout(() => {
				this.addCommentFocus = isShow;
			}, 200);
		},

		/*添加评论或回复*/
		addCommentOrReply() {
			if (this.commentContent == '') {
				this.$mHelper.toast('评论内容不能为空');
				return;
			}
			if (this.replyCommentId > 0) {
				this.addReply();
			} else {
				this.addComment();
			}
		},

		/*添加评论*/
		async addComment() {
			let formData = {
				bizId: this.id,
				bizType: '1',
				content: this.commentContent,
				pageSize: this.pageSize
			}
			let res = await this.$http.apiCall('post', '/system/comment/add', JSON.stringify(formData));
			if (res) {
				this.info.comment = res.data;
				this.showAddComment = false;
				this.commentContent = '';
				this.$mHelper.toast('评论成功');
			} else {
				this.$mHelper.toast(res.msg);
			}
		},

		/*初始化回复*/
		initAddReply(commentId, nickname) {
			this.replyCommentId = commentId;
			this.replyNickname = nickname;
			this.initAddComment(true);
		},

		/*添加回复*/
		async addReply() {
			if (this.commentContent == '') {
				this.$mHelper.toast('回复内容不能为空');
				return;
			}
			let formData = {
				bizId: this.id,
				content: this.commentContent,
				bizType: '1'
			}
			let res = await this.$http.apiCall('post', '/system/comment/add', JSON.stringify(formData));
			if (res) {
				this.info.comment = res.data;
				this.showAddComment = false;
				this.commentContent = '';
				this.$mHelper.toast('评论成功');
			} else {
				this.$mHelper.toast(res.msg);
			}
		},
		/*获取评论*/
		async getComment() {
			this.queryParams.pageNum = this.pageNum
			this.queryParams.bizId = this.id
			this.queryParams.bizType = '1'
			let url = '/system/comment/queryList';
			let res = await this.$http.apiCall('get', url, this.queryParams);
			if (res.list) {
				this.info.commentList = this.info.commentList.concat(res.list);
				// this.info.comment.count = res.list.length;
				if (res.totalPages > this.pageNum) {
					this.hasMoreData = true;
				} else {
					this.hasMoreData = false;
				}
				this.pageNum += 1;
			}
			uni.stopPullDownRefresh();
			uni.hideLoading();
			this.showPageLoading = false;

		},

		/*打开外部链接*/
		openLink(url) {
			console.log(url);
			window.location.href = url;
		},

		/*关闭H5分享*/
		closeH5Share() {
			this.showH5Share = false;
		},

		/*关闭微信分享提示*/
		closeShareTip() {
			this.showShareTip = false;
		},
		/*显示浏览器分享提示*/
		showBrowserShareTips() {
			this.showH5Share = false;
			this.showBrowserShareTip = true;
		},
		/*关闭浏览器分享提示*/
		closeBrowserShareTip() {
			this.showBrowserShareTip = false;
		},

		/*分享*/
		share() {
			// #ifdef H5
			if (util.isWechatOrQQ()) {
				this.showShareTip = true;
			} else {
				this.showH5Share = true;
			}
			// #endif

			this.showShareTip = false;
			this.showH5Share = false;

			console.log('share');

			// #ifdef MP
			uni.showShareMenu();
			// #endif
		},

		/*初始化公众号分享*/
		initMPShare() {
			// #ifdef H5
			let domain = location.href.split('/pages/')[0];
			/*分享链接*/
			let link = domain + '/pages/article/detail?id=' + this.info.id;
			if (this.$app.isWechat()) {
				/*初始化分享*/
				wechatMP.initShare(this, {
					title: this.info.title,
					desc: '',
					link: link,
					imgUrl: this.info.image
				});
			} else {
				this.shareUrl = link;
			}
			// #endif
		},

		/*跳转至评论详情*/
		redirectCommentDetail(id, replyCount) {
			if (replyCount > 0) {
				uni.navigateTo({
					url: '/pages/comment/commentDetail?id=' + id
				});
			}
		},

		/*复制*/
		copyText(text) {
			uni.setClipboardData({
				data: text,
				success: res => {
					this.$mHelper.toast('原文链接已复制', 'success');
				}
			});
		},
		// 收藏
		async toFavorite() {
			if (!this.id) return;
			if (!this.$mStore.getters.hasLogin) {
				await this.$mHelper.backToLogin();
			} else {
				let favorite = await this.hasAttention()
				favorite ? this.handleCollectDel() : this.handleCollectCreate();
			}
		},
		// 查询收藏结果
		async hasAttention() {
			return await this.$http.apiCall('get', '/hasAttention', {id: this.id,type:'1'});
		},
		// 收藏设备
		async handleCollectCreate() {
			let params = {
				id: this.id,
				type:'1',
				image:this.info.url,
				title:''+this.info.title,
				navUrl:'/pages/article/detail?id='+this.id
			}
			await this.$http.get('/addattention', {params:params}).then(async res => {
				this.favorite = true;
				this.$mHelper.toast('收藏成功');
			});
		},
		// 取消收藏设备
		async handleCollectDel() {
			let _this = this;
			await this.$http.get('/cancelattention', {params:{id: this.id,type:'1'}}).then(async res => {
				this.favorite = false;
				this.$mHelper.toast('取消收藏成功');
			});
		}
	}
};
</script>

<style scoped lang="scss">
.detail {
	padding: 40rpx 32rpx;
	background: #fff;
	.title {
		font-size: 44rpx;
		color: #262626;
		line-height: 70rpx;
		font-weight: bold;
	}
	.info {
		margin-top: 32rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		.source-date {
			.source {
				color: #666;
			}
			.date {
				color: #999;
				margin-left: 24rpx;
			}
		}
		.read {
			color: #999;
		}
	}
	.desc {
		margin-top: 56rpx;
		overflow: hidden;
		color: #262626;
		.wxParse {
			color: #262626;
		}
	}
}
.comment {
	padding: 20rpx 32rpx 0;
	background: #fff;
	.title {
		display: flex;
		align-items: center;
		font-size: 36rpx;
		color: #262626;
		font-weight: bold;
		border-bottom: 1rpx solid #eee;
		text {
			padding-bottom: 20rpx;
			line-height: normal;
		}
		.count {
			padding-bottom: 20rpx;
			font-size: 30rpx;
			color: #999;
			margin-left: 10rpx;
			line-height: normal;
		}
	}
	.item {
		display: flex;
		justify-content: space-between;
		padding: 30rpx 0 20rpx;
		border-bottom: 1rpx solid #eee;
		&:last-child {
			border-bottom: 0;
		}
		.avatar {
			flex-grow: 0;
			flex-shrink: 0;
			margin-right: 20rpx;
			image {
				width: 45rpx;
				height: 45rpx;
				border-radius: 50%;
			}
		}
		.comment-info {
			flex-grow: 1;
			flex-shrink: 1;
			.nickname-like {
				display: flex;
				justify-content: space-between;
				.nickname {
					font-size: 32rpx;
					color: #444;
					font-weight: bold;
				}
				.like {
					display: flex;
					align-items: center;
					image {
						width: 32rpx;
						height: 32rpx;
						margin-right: 14rpx;
					}
					.like-count {
						color: #999;
						font-size: 30rpx;
					}
				}
			}
			.comment-desc {
				color: #444;
				font-size: 32rpx;
				line-height: 1.6;
				margin-top: 15rpx;
			}
			.reply-count {
				background: #f2f2f2;
				padding: 8rpx 20rpx;
				font-size: 30rpx;
				color: #999;
				margin: 20rpx 0 24rpx;
			}
			.date-reply {
				display: flex;
				justify-content: space-between;
				align-items: center;
				.date {
					display: flex;
					align-items: center;
					color: #b4b4b4;
					font-size: 28rpx;
					margin-right: 20rpx;
					margin-top: 4rpx;
				}
				.reply {
					flex-grow: 0;
					flex-shrink: 0;
					font-size: 28rpx;
					color: #999;
				}
			}
		}
	}
	.no-comment {
		padding: 40rpx 0;
		color: #999;
		font-size: 30rpx;
	}
}
.comment-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 120rpx;
	background-color: #ffffff;
	box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.3);
	display: flex;
	flex-direction: row;
	.input {
		flex-grow: 0;
		flex-shrink: 0;
		margin: 20rpx 10rpx 20rpx 20rpx;
		display: flex;
		align-items: center;
		background: #f2f2f2;
		width: 420rpx;
		border-radius: 40rpx 40rpx 0 40rpx;
		text {
			font-size: 32rpx;
			color: #aaa;
			margin-left: 38rpx;
		}
	}
	.operate {
		width: 100%;
		flex-grow: 1;
		flex-shrink: 1;
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-right: 10rpx;
		view,
		navigator {
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 25%;
			image {
				width: 45rpx;
				height: 45rpx;
			}
		}
		.info,
		.like {
			position: relative;
			.count {
				position: absolute;
				top: -15rpx;
				right: -4rpx;
				background-image: linear-gradient(140deg, #bee7e9 9%, #8cc7b5 75%);
				display: flex;
				align-items: center;
				border-radius: 50rpx;
				padding: 0 10rpx;
				font-size: 22rpx;
				color: #fff;
				height: 30rpx;
				line-height: 30rpx;
			}
		}
		.share {
			height: 24px;
			display: flex;
			justify-content: space-around;
			padding: 0;
			background: transparent;
			image {
				width: 45rpx;
				height: 45rpx;
				border: 0;
			}
			&:after {
				display: none;
			}
		}
	}
}
.float-empty {
	height: 120rpx;
	width: 100%;
	display: block;
	background: #fff;
}
.add-comment {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #ffffff;
	z-index: 9999;
	.info {
		display: flex;
		flex-direction: row;
		padding: 20rpx 20rpx 20rpx 20rpx;
		.input {
			flex-grow: 1;
			flex-shrink: 1;
			display: flex;
			align-items: center;
			background: #f2f2f2;
			border-radius: 40rpx 40rpx 0 40rpx;
			padding: 20rpx 32rpx 20rpx;
			line-height: normal;
			textarea {
				//padding: 10rpx 0;
				width: 100%;
				font-size: 32rpx;
				line-height: 42rpx;
				background: #f2f2f2;
			}
		}
		.add {
			flex-grow: 0;
			flex-shrink: 0;
			width: 150rpx;
			display: flex;
			align-items: center;
			margin-left: 10rpx;
		}
		.cancel {
			position: absolute;
			right: 10rpx;
			top: 2rpx;
			/deep/.icon {
				font-size: 40rpx;
				color: #ccc;
			}
		}
	}
}
.h5-share {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: #ffffff;
	border-top: 1rpx solid #ddd;
	padding-top: 20rpx;
	padding-bottom: 20rpx;
	.title {
		font-size: 30rpx;
		text-align: center;
		height: 50rpx;
	}
	.share-icon {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		view {
			flex-grow: 0;
			flex-shrink: 0;
			text-align: center;
			image {
				margin-top: 35rpx;
				width: 80rpx;
				height: 80rpx;
			}
			text {
				display: block;
			}
		}
	}
	.share-btn {
		margin: 30rpx 30rpx 15rpx;
		border: 1rpx solid #8cc7b5;
		background: #8cc7b5;
		border-radius: 15rpx;
		font-size: 32rpx;
		text-align: center;
		padding: 12rpx 0;
		color: #fff;
	}
}
.share-maske {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.6);
	z-index: 99999;
	.share-tip {
		position: absolute;
		top: 100rpx;
		left: 0;
		text-align: center;
		.share-tip-info {
			height: 240rpx;
		}
		.share-tip-btn {
			margin-top: 400rpx;
			height: 82rpx;
		}
	}
	.share-browser-tip {
		top: 300rpx;
		.share-tip-info {
			height: 240rpx;
		}
		.share-tip-btn {
			margin-top: 200rpx;
		}
	}
}
.declaration {
	margin: 50rpx 0;
	font-size: 34rpx;
	color: #999;
}
.mini-btn[type='primary'] {
	background-color: #ffffff;
	border-radius: 100rpx;
	height: 30px;
}
.mini-btn {
	background: linear-gradient(45deg, #8CC7B5, #BEEDC7);
	border-radius: 100rpx;
	line-height: 2.4 !important;
	//font-size: 30rpx !important;
	border: 0;
}
.mini-btn::after {
	border: 0;
}
</style>
