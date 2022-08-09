<template>
	<view class="container">
		<view class="content">
			<view class="detail">
				<view class="comment">
					<view class="item">
						<view class="avatar"><image :src="info.userAvatar"></image></view>
						<view class="comment-info">
							<view class="nickname-like">
								<view class="nickname">{{ info.userName }}</view>
								<view class="like">
									<image @tap="commentLike()" v-show="!info.isLike" src="https://yzimg.jikebang.com/gczh/imgs/article/icon_like_01.png"></image>
									<image @tap="commentLike()" v-show="info.isLike" src="https://yzimg.jikebang.com/gczh/imgs/article/icon_like_01_hover.png"></image>
									<view class="like-count">{{ info.likeCount }}</view>
								</view>
							</view>
							<view class="comment-desc">{{ info.content }}</view>
							<view class="date-reply">
								<view class="date">{{ info.createTime }}</view>
								<view @tap="initAddReply('commit', info.id, info.userName)" class="reply">回复TA</view>
							</view>
						</view>
					</view>
				</view>
				<view class="comment replys">
					<view class="title">
						全部回复
						<text v-if="info.replyCount > 0">({{ info.replyCount }})</text>
					</view>
					<view class="item" v-for="(item, index) in info.replyList" :key="index">
						<view class="avatar"><image :src="item.userAvatar"></image></view>
						<view class="comment-info">
							<view class="nickname-like">
								<view class="nickname">{{ item.userName }}</view>
								<view class="like">
									<image @tap="replyLike(item.id, index)" v-show="!item.isLike" src="https://yzimg.jikebang.com/gczh/imgs/article/icon_like_01.png"></image>
									<image @tap="replyLike(item.id, index)" v-show="item.isLike" src="https://yzimg.jikebang.com/gczh/imgs/article/icon_like_01_hover.png"></image>
									<view class="like-count">{{ item.likeCount }}</view>
								</view>
							</view>
							<view class="comment-desc">
								<text>{{ item.parentId > 0 ? '回复@' + item.toUserName + '：' : '' }}</text>
								{{ item.content }}
							</view>
							<view class="reply-count" v-if="item.replyCount > 0">全部{{ item.replyCount }}条回复 ></view>
							<view class="date-reply">
								<view class="date">{{ item.createTime }}</view>
								<view @tap="initAddReply('reply', item.id, item.userName)" class="reply">回复TA</view>
							</view>
						</view>
					</view>
					<loading v-if="hasMoreData"></loading>
					<view class="no-comment" v-if="info.replyCount == 0">暂无回复，快来抢占沙发吧~</view>
				</view>
			</view>
			<view class="float-empty"></view>
			<view class="bg-masker" v-if="showAddReply" @tap="showAddReplyBg(false)"></view>
			<view class="add-comment" v-if="!showPageLoading">
				<view class="info">
					<view class="input">
						<textarea
							:cursor-spacing="20"
							ref="commentContent"
							:show-confirm-bar="false"
							@focus="showAddReplyBg(true)"
							:maxlength="200"
							:focus="addReplyFocus"
							:fixed="true"
							:auto-height="true"
							v-model.trim="commentContent"
							placeholder-class="input-bg"
							:placeholder="replyPid > 0 ? '回复 ' + replyNickname + '：' : '回复 ' + info.userName + '：'"
						/>
					</view>
					<view class="add"><button class="mini-btn" type="primary" @click="addReply()">回复</button></view>
				</view>
			</view>
		</view>
		<pageLoading v-if="showPageLoading"></pageLoading>
	</view>
</template>

<script>
import pageLoading from '@/components/loading/pageLoading.vue';
import iconfont from '@/components/iconfont/iconfont.vue';
import loading from '@/components/loading/loading.vue';
export default {
	components: {
		pageLoading,
		loading,
		iconfont
	},
	data() {
		return {
			id: 0,
			info: { reply: { count: 0, list: [] } },
			showAddReply: false,
			addReplyFocus: false,
			operate: '',
			commentContent: '',
			replyCommentId: 0,
			replyPid: 0,
			replyNickname: '',
			pageNum: 1,
			page_size: 10,
			hasMoreData: false,
			showPageLoading: true
		};
	},
	onShow() {
	},
	onLoad(e) {
		if (e.id > 0) {
			this.id = e.id;
		}
		if (e.operate === 'reply') {
			this.operate = e.operate;
		}
		this.getCommentDetail();
	},
	onPullDownRefresh() {
		uni.showLoading({
			title: '刷新中'
		});
		this.pageNum = 1;
		this.getCommentDetail();
	},
	onReachBottom: function() {
		console.log(this.hasMoreData);
		if (this.hasMoreData) {
			this.getReply();
		}
	},
	methods: {
		/*获取评论*/
		async getCommentDetail() {
			let res = await this.$http.apiCall('get', '/system/comment/detail', {id:this.id});
			uni.hideLoading()
			uni.stopPullDownRefresh();
			console.log("获取的评论详情："+JSON.stringify(res))
			if(res){
				this.info = res;
				this.showPageLoading = false;
				this.hasMoreData = res.replyCount >= 10;
				this.pageNum += 1;

				/*初始化回复*/
				if (this.operate === 'reply') {
					this.showAddReplyBg(true);
				}

			}
		},

		/*评论点赞*/
		commentLike() {
			this.$app.request({
				url: this.$api.article.commentLike,
				data: {
					comment_id: this.id
				},
				method: 'POST',
				dataType: 'json',
				success: res => {
					console.log('res');
					if (res.code == 0) {
						if (this.info.isLike) {
							this.info.isLike = false;
							this.info.likeCount -= 1;
						} else {
							this.info.isLike = true;
							this.info.likeCount += 1;
						}

						let msg = this.info.isLike ? '点赞成功' : '已取消点赞';
						this.$mHelper.toast(msg,'success');
					} else {
						this.$mHelper.toast(res.msg,'warning');
					}
				}
			});
		},

		/*回复点赞*/
		replyLike(reply_id, index) {
			this.$app.request({
				url: this.$api.article.commentReplyLike,
				data: {
					reply_id: reply_id
				},
				method: 'POST',
				dataType: 'json',
				success: res => {
					if (res.code == 0) {
						if (this.info.replyList[index].isLike) {
							this.info.replyList[index].isLike = false;
							this.info.replyList[index].likeCount -= 1;
						} else {
							this.info.replyList[index].isLike = true;
							this.info.replyList[index].likeCount += 1;
						}
						let msg = this.info.replyList[index].isLike ? '点赞成功' : '已取消点赞';
						this.$mHelper.toast(msg,'success');
					} else {
						this.$mHelper.toast(res.msg,'warning');
					}
				}
			});
		},

		/*初始化回复*/
		initAddReply(type, id, nickname) {
			this.replyNickname = nickname;
			if (type == 'reply') {
				this.replyPid = id;
			}
			this.showAddReply = true;
			this.addReplyFocus = true;
		},

		/*添加回复*/
		async addReply() {
			if (this.commentContent == '') {
				this.$mHelper.toast('回复内容不能为空');
				return;
			}
			let formData = {
				parentId:this.id,
				bizId: this.id,
				bizType : '1',
				content: this.commentContent
			}
			let res = await this.$http.apiCall('post', '/system/comment/add', JSON.stringify(formData));
			if (res) {
				this.info.comment = res.data;
				this.showAddComment = false;
				this.commentContent = '';
				this.$mHelper.toast('回复成功');
				await this.getCommentDetail()
			} else {
				this.$mHelper.toast(res.msg);
			}
		},

		/*展示回复背景*/
		showAddReplyBg(status) {
			this.showAddReply = status;
			console.log(status);
			setTimeout(() => {
				this.addReplyFocus = status;
			}, 200);
		},
		/*获取回复*/
		async getReply() {
			this.queryParams.pageNum = this.pageNum
			this.queryParams.bizType = '1'
			this.queryParams.bizId = this.id
			let url = '/system/comment/queryList';
			console.log("请求的参数："+JSON.stringify(this.queryParams))
			let res = await this.$http.apiCall('get', url, this.queryParams);
			if(res.list) {
				this.info.commentList = this.info.commentList.concat(res.list);
				this.info.comment.count = res.list.length;
				if (res.totalPages > this.pageNum) {
					this.hasMoreData = true;
				} else {
					this.hasMoreData = false;
				}
				this.pageNum += 1;
			}
			uni.stopPullDownRefresh();
			uni.hideLoading();
		}
	}
};
</script>

<style scoped lang="scss">
.mini-btn{
	font-size: 13px;
}
.comment {
	padding: 15rpx 32rpx 20rpx;
	background: #fff;
	.title {
		display: flex;
		align-items: center;
		font-size: 34rpx;
		color: #444;
		font-weight: bold;
		padding-bottom: 15rpx;
		border-bottom: 1rpx solid #eee;
		text {
			font-size: 28rpx;
			color: #999;
			margin-left: 10rpx;
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
				width: 56rpx;
				height: 56rpx;
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
						width: 30rpx;
						height: 30rpx;
						margin-right: 14rpx;
					}
					.like-count {
						color: #999;
						font-size: 28rpx;
					}
				}
			}
			.comment-desc {
				color: #262626;
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
		padding: 20rpx 0;
		color: #999;
		font-size: 30rpx;
	}
}
.replys {
	border-top: 0;
	margin-top: 15rpx;
	padding-bottom: 0;
}
.comment-bar {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 120rpx;
	background-color: #ffffff;
	border-top: 1rpx solid #ddd;
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
			font-size: 30rpx;
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
				right: -9rpx;
				background: #fd1815;
				display: block;
				border-radius: 20rpx;
				padding: 2rpx 10rpx;
				font-size: 24rpx;
				line-height: 1.3;
				color: #fff;
			}
		}
		.share {
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 25%;
			image {
				width: 45rpx;
				height: 45rpx;
			}
			&:after {
				display: none;
			}
			&:last-child {
				image {
					border: 1rpx solid #63b5e8;
				}
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
	box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.2);
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
			margin-left: 15rpx;
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
</style>
