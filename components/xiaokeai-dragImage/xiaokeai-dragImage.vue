<template>
	<view @touchmove.stop.prevent="moveHandle" class="moveWrap">
		<movable-area class="movarea" ref="areaBox" id="areaBox">
			<view class="imgBox">
				<view :id="'img' + idx" class="imgItem" v-for="(item, idx) in scopeImgList" :key="idx"
					:style="{transition:addJump?' all 0.5s':'',opacity:idx===selectIdx?'0':'1', width: imgSize + 'rpx', height: imgSize + 'rpx', 
					borderRadius:imgRadius+'rpx',padding:imgPadding+'rpx',left:(hoverImgIdx==='img'+idx?curHoverBoxMove.x+'rpx':''),
					top:(hoverImgIdx==='img'+idx?curHoverBoxMove.y+'rpx':'')}" @tap.stop="handleClick(idx)">
					<image :style="{borderRadius:imgRadius+'rpx' }" :ref="'img' + idx" :src="item.url" mode="aspectFill"
						@touchstart="tstr(idx, $event)" @touchmove="tsmo" @touchend="toend"></image>
					<view v-if="editing" class="remove-btn" @tap.stop="closeImg(idx)"></view>
				</view>
				<slot></slot>
			</view>
			<movable-view v-if="moveSrc" :animation="false" class="moveV" :x="x" :y="y" direction="all"
				@change="onChange"
				:style="{ width: imgSize + 'rpx', height: imgSize + 'rpx',padding:imgPadding+'rpx' }">
				<image :style="{borderRadius:imgRadius+'rpx' }" :src="moveSrc" mode="aspectFill"></image>
			</movable-view>
		</movable-area>

	</view>
</template>
<script>
	export default {
		props: {
			//图片列表
			imgList: {
				type: Array,
				default: function() {
					return [];
				}
			},
			//图片大小
			imgSize: {
				type: Number,
				default: function() {
					return 160;
				}
			},
			//图片间距
			imgPadding: {
				type: Number,
				default: function() {
					return 0;
				}
			},
			//图片行数
			rowNum: {
				type: Number,
				default: function() {
					return 2;
				}
			},
			//图片圆角
			imgRadius: {
				type: Number,
				default: function() {
					return 80;
				}
			},
			editing: {
				type: Boolean,
				default: function() {
					return false;
				}
			}
		},
		components: {},
		data() {
			return {
				addJump:false,
				scopeImgList: this.imgList,
				areaBoxInfo: {},
				x: 0,
				y: 0,
				selectIdx: null,
				moveSrc: '',
				areaBoxTop: 0,
				hoverImgIdx: '',
				inBoxXY: {},
				curHoverBoxMove: {
					x: 0,
					y: 0
				}
			};
		},
		watch: {
			hoverImgIdx(e) {
				let idx = this.selectIdx
				let hoverIdx = parseInt(e.split('img')[1]);
				if (this.scopeImgList[idx]) {
					let selectRow = this.scopeImgList[idx].y / uni.upx2px(this.imgSize)
					let selectColum= this.scopeImgList[idx].x / uni.upx2px(this.imgSize)
					let hoverRow = this.scopeImgList[hoverIdx].y / uni.upx2px(this.imgSize)
					let hoverColum= this.scopeImgList[hoverIdx].x / uni.upx2px(this.imgSize)
					let left =  -(this.imgSize * (hoverColum - selectColum))
					let top= -(this.imgSize * (hoverRow - selectRow))
					this.curHoverBoxMove = {
						x: left,
						y: top,
					}
				}
			},
			imgList(e) {
				this.scopeImgList = e.map((v)=>{ return {"url":v}});
				let _this = this;
				this.$nextTick(function() {
					_this.getDomInfo('areaBox', info => {
						_this.areaBoxInfo = info;
						// 设置区域内所有图片的左上角坐标
						_this.scopeImgList.forEach((item, idx) => {
							_this.getDomInfo('img' + idx, res => {
								item.x = res.left - info.left;
							});
							_this.getDomInfo('img' + idx, res => {
								item.y = res.top - info.top;
							});
						});
					});
				})
			}
		},
		methods: {
			handleClick(index){
				if(this.editing){
					this.$emit('addImg',index);
				}else{
					this.previewPic(index);
				}
			},
			/**
			 * 预览图片
			 */
			previewPic(index){
				uni.previewImage({
					urls : this.imgList,
					current: index
				})
			},
			moveHandle() {
				return;
			},
			onChange(e) {
				// console.log(e.detail)
			},
			tstr(e, s) {
				const _this = this;
				if(!this.editing)return;
				_this.addJump=true
				_this.getDomInfo('areaBox', info => {
					_this.areaBoxInfo = info;
					// 设置区域内所有图片的左上角坐标
					_this.scopeImgList.forEach((item, idx) => {
						_this.getDomInfo('img' + idx, res => {
							item.x = res.left - info.left;
						});
						_this.getDomInfo('img' + idx, res => {
							item.y = res.top - info.top;
						});
					});
				});
				//获取拖拽区域的上边距和下边距
				let areaBoxTop = this.areaBoxInfo.top;
				let areaBoxLeft = this.areaBoxInfo.left;
				// console.log(this.areaBoxInfo)

				// 设置可移动方块的初始位置为当前所选中图片的位置坐标
				this.x = this.scopeImgList[e].x;
				this.y = this.scopeImgList[e].y;
				//显示可移动方块
				this.moveSrc = this.scopeImgList[e].url;
				//保存当前所选择的图片索引
				this.selectIdx = e;
				var x = s.changedTouches[0].clientX - areaBoxLeft;
				var y = s.changedTouches[0].clientY - areaBoxTop;
				// 保存鼠标在图片内的坐标
				this.inBoxXY = {
					x: x - this.scopeImgList[e].x,
					y: y - this.scopeImgList[e].y,
				}
			},
			tsmo(e) {
				if(!this.editing)return;
				const _this = this;
				let areaBoxTop = this.areaBoxInfo.top;
				let areaBoxLeft = this.areaBoxInfo.left;
				let imgSize = this.imgSize;
				//重置为以拖拽盒子左上角为坐标原点
				var x = e.changedTouches[0].clientX - areaBoxLeft;
				var y = e.changedTouches[0].clientY - areaBoxTop;
				this.x = x - this.inBoxXY.x;
				this.y = y - this.inBoxXY.y;
				this.scopeImgList.forEach((item, idx) => {
					if (x > item.x && x < item.x + imgSize && y > item.y && y < item.y + imgSize) {
						_this.hoverImgIdx = 'img' + idx
					}
				});
			},
			toend(e) {
				const _this = this;
				if(!this.editing)return;
				_this.addJump=false
				// 移动结束隐藏可移动方块
				let beforeIdx = _this.selectIdx;
				let afterIdx = parseInt(_this.hoverImgIdx.split('img')[1]);
				if (_this.hoverImgIdx !== '' && beforeIdx !== afterIdx) {
					_this.scopeImgList[beforeIdx].url = _this.scopeImgList[afterIdx].url;
					_this.scopeImgList[afterIdx].url = _this.moveSrc;
					this.$emit('moveEndList', this.scopeImgList.map(v=>v.url));
				}
				this.moveSrc = '';
				this.hoverImgIdx = ''
				this.selectIdx = null
			},
			addImgBtn() {
				this.$emit('addImg');
			},
			closeImg(e) {
				this.$emit('delImg', e);
			},
			getDomInfo(id, callBack) {
				const query = uni.createSelectorQuery().in(this);
				// console.log(query)
				query.select('#' + id)
					.boundingClientRect()
					.exec(function(res) {
						callBack(res[0]);
					});
			}
		},
		mounted() {
			let _this = this;
			this.getDomInfo('areaBox', info => {
				_this.areaBoxInfo = info;
				// 设置区域内所有图片的左上角坐标
				_this.scopeImgList.forEach((item, idx) => {
					_this.getDomInfo('img' + idx, res => {
						item.x = res.left - info.left;
					});
					_this.getDomInfo('img' + idx, res => {
						item.y = res.top - info.top;
					});
				});
			});

		}
	};
</script>

<style lang="scss" scoped>
	.movarea {
		width: 100%;
		height: 320rpx;
		display: flex;
		flex-direction: row;
	}
	.imgBox {
		width: 100%;
		height: 320rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		.imgItem {
			position: relative;		
			left: 0;
			top: 0;
			box-sizing: border-box;
			margin-right: 20upx;
			margin-bottom: 30upx;
			image {
				width: 100%;
				height: 100%;
				// transition: all 0.2s;
				// vertical-align: top;
			}

			.remove-btn {
				position: absolute;
				background-image: url(../../static/img/icon/icon_sub.png);
				background-size: 100% 100%;
				width: 50upx;
				height: 50upx;
				top: -28upx;
				right: 0;
			}
		}
	}

	.moveV {
		opacity: 0.6;
		z-index: 999;
		box-sizing: border-box;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.select {
		opacity: 0;
	}
</style>
