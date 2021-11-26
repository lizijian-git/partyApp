<template>
	<view class="table-container" :style="{ height: tableHeight + 'px' }">
		<view class="table">
			<view class="table-tr">
				<view class="table-th" v-for="(label,lIndex) in tableLabel" :key="label.name">
					{{label.title }}
				</view>
			</view>
			<view class="table-tr" v-for="(row,rIndex) in tableData" :key="row">
				<view class="table-td" v-for="(label,lIndex) in tableLabel" :key="label.name" :style="{ 'white-space' : row[label.name].length > 15 ? 'normal' : 'nowarp' }">
					<view v-if="lIndex === 0">{{ rIndex + 1 }}</view>
					<view class="preview-btn flex" v-if="label.type === 2 && row[label.name]">
						<image v-for="(img,iIndex) in row[label.name]" :key="img" :src="img" mode="" @tap.stop="previewImage(row[label.name],iIndex)"></image>
					</view>
					<text v-else>{{ row[label.name] }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default{
	data() {
		return {
			tableHeight: uni.getSystemInfoSync().windowHeight - 180
		}
	},
	props: {
		tableLabel: {
			type: Array,
			default: () => []
		},
		tableData: {
			type: Array,
			default: () => []
		}
	},
	methods: {
		previewImage(data,index) {
			this.$emit('previewImage',data,index);
		}
	},
}
</script>

<style lang="scss" scoped>
	.table-container{
		padding: 10upx 0;
		margin: 0 10upx;
		overflow-x: auto;
		.table{
			display: table;
			border-collapse: collapse;
			.table-tr{
				display: table-row;
				.table-th,.table-td{
					display: table-cell;
					vertical-align: middle;
					white-space: nowrap;
					border: 2upx solid #dfe6ec;
					padding: 10upx 20upx;
					text-align: center;
				}
				.table-th{
					color: #909399;
					font-weight: bold;
					font-size: $font-lg;
				}
				.table-td{
					font-size: $font-secondary;
					color: #606266;
				}
				image{
					width: 120upx;
					height: 120upx;
					&:not(:last-child){
						margin-right: 10upx;
					}
				}
			}
		}
	}
</style>
