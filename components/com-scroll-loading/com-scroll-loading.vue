<template>
  <view class="com-scroll-loading">
    <slot :list="list" :total="total" :pagination="pagination" :loadStatus="loadStatus"></slot>
    <com-empty :msg="errMsg" :icon="emptyIcon" v-if="loadStatus === 'noMore' && list.length == 0"></com-empty>
    <com-load-more v-else :status="loadStatus"></com-load-more>
  </view>
</template>

<script>
import Request from '@/utils/request';
/**
 * ComScrollLoading
 * @description 滚动加载组件，用于实现上拉加载更多、下拉刷新
 * 在父组件中通过通过如下方式使用：
 * 推荐使用：
  <com-srcoll-loading v-model="list"></com-srcoll-loading>
  data() {
    return {
      list: []
    };
  },

  或通过解构插槽的方式使用
  注意：该方式目前在微信小程序存在一定的兼容问题，不建议使用，如若使用了请严格测试是否正常。
  如果内部需要用到<block v-if="type == 1"></block>这种需要使用v-if或v-show的情况，会导致内容无法渲染。
  <com-srcoll-loading>
    <template v-slot="{list}"></template>
  </com-srcoll-loading>

 * @tutorial 链接
 * @property {Function｜String} getListMethod 获取列表的接口或者方法
 * @property {Object} params 初始化的参数，默认为空{}
 * @property {String} dataKey 列表数据的字段，默认是list，有些接口可能是data等字段
 * @property {String} emptyMsg 数据为空时的提示语
 * @property {String} emptyIcon 数据为空时显示的图标
 * @event {Function} refresh 下拉刷新，在父组件的onPullDownRefresh中使用以及初始化时使用
 * @event {Function} loadMore 上拉加载，在父组件的中onReachBottom使用
 * @event {Function} success 加载成功
 * @event {Function} fail 加载失败
 * @event {Function} updateItem 用于更新某一条数据，提供给父组件使用
 * @event {Function} deleteItem 用于删除某一条数据，提供给父组件使用
 * @event {Function} isLoad 初始化时是否立即加载数据
 */

export default {
  name: 'ComScrollLoading', // 滚动加载组件，用于实现上拉加载更多、下拉刷新
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      }
    },
    // 自定义分页条数
    limit: {
      type: [Number, String]
    },
    // 获取列表的接口或者方法
    getListMethod: {
      type: [Function, String],
      default: ''
    },
    // 初始化的参数
    params: {
      type: Object,
      default: () => {
        return {};
      }
    },
    // 请求方法类型，默认为post
    methodType: {
      type: String,
      default: 'POST'
    },
    // 列表数据的字段，默认是list，有些接口可能是data等字段
    dataKey: {
      type: String,
      default: 'list'
    },
    emptyMsg: {
      type: String,
      default: '暂无相关数据'
    },
    emptyIcon: {
      type: String,
      default: 'empty'
    },
    isLoad: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loadStatus: 'more', // 上拉状态 more-loading前；loading-loading中；noMore-没有更多了
      list: [], // 列表数据
      total: 0, // 总数
      pagination: {
        Limit: this.$config.PAGE_SIZE,
        Page: 1
      },
      requestParams: {}, // 获取列表的参数
      errMsg: ''
    };
  },
  watch: {
    value: {
      handler(val) {
        this.list = val;
      },
      immediate: true,
      deep: true
    },
    emptyMsg: {
      handler(val) {
        this.errMsg = val;
      },
      immediate: true
    },
    list(value) {
      this.$emit('input', value);
    }
  },
  created() {
    if (this.isLoad) {
      this.refresh();
    }
  },
  methods: {
    // 获取列表
    getList(extParams) {
      if (this.limit) {
        this.$set(this.pagination, 'Limit', this.limit)
      }
       if (!this.getListMethod) {
        return false;
      }
      uni.showLoading({
        title: '加载中...'
      });
      this.loadStatus = 'loading';
      if (extParams) {
        this.requestParams = extParams;
      }
      if (this.params) {
        this.requestParams = Object.assign(this.requestParams, this.params);
      }
      this.requestParams.Page = this.pagination.Page;
      this.requestParams.Limit = this.pagination.Limit;

      let res = '';
      if (typeof this.getListMethod === 'string') {
        res = Request({
          url: this.getListMethod,
          method: this.methodType,
          params: this.requestParams
        });
      } else {
        res = this.getListMethod(this.requestParams);
      }
      if (res && typeof res.then === 'function') {
        res
          .then((res) => {
            let data = res.data
            if (this.dataKey === 'data') {
              if (this.$utils.getType(data) === 'array') {
                this.list = this.pagination.Page == 1 ? data : this.$lodash.concat(this.list, data);
                this.total = res.count || 0;
              }
              this.loadStatus = 'noMore';
            } else {
              let { list, count } = data;
              list = list || []
              this.list = this.pagination.Page == 1 ? list : this.$lodash.concat(this.list, list);
              this.total = count || 0;

            }
            if (this.list.length < this.total) {
								this.loadStatus = 'more'
							} else {
								this.loadStatus = 'noMore'
							}
            this.$emit('success', { list: this.list, total: this.total, pagination: this.pagination });
            uni.hideLoading();
            uni.stopPullDownRefresh();
          })
          .catch(e => {
            this.$emit('fail', e);
            this.errMsg = e.errMsg;
            this.loadStatus = 'noMore';
            uni.hideLoading();
            uni.stopPullDownRefresh();
          });
      }
    },
    // 下拉刷新
    refresh(extParams) {
      setTimeout(() => {
        this.list = [];
        this.loadStatus = 'more';
        this.pagination.Page = 1;
        this.requestParams = {};
        this.getList(extParams);
      })
    },
    // 上拉加载
    loadMore(extParams) {
      if (this.loadStatus != 'more') return;
      this.loadStatus = 'loading';
      this.pagination.Page++;
      this.getList(extParams);
    },
    /**
     * 用于更新某一条数据，提供给父组件使用
     */
    updateItem(item = {}, index = 0) {
      this.list[index] = Object.assign(this.list[index], item);
      this.list.splice(index, 0);
      this.$emit('input', this.list);
    },
    /**
     * 用于删除某一条数据，提供给父组件使用
     */
    deleteItem(index) {
      if (index == undefined) return;
      this.list.splice(index, 1);
      this.$emit('input', this.list);
    }
  }
};
</script>

<style scoped></style>
