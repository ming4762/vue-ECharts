<template>
  <!-- 暂无数据div -->
  <div class="shadow" :style="getDivStyle" v-if="!getHasData">
    暂无数据
  </div>
  <div v-else :style="getDivStyle"></div>
</template>



<script>
import echarts from 'echarts/lib/echarts'
import { addListener, removeListener } from 'resize-detector'
import debounce from 'lodash/debounce'

/**
 * 事件信息
 */
const EVENTS = [
  'legendselectchanged',
  'legendselected',
  'legendunselected',
  'legendscroll',
  'datazoom',
  'datarangeselected',
  'timelinechanged',
  'timelineplaychanged',
  'restore',
  'dataviewchanged',
  'magictypechanged',
  'geoselectchanged',
  'geoselected',
  'geounselected',
  'pieselectchanged',
  'pieselected',
  'pieunselected',
  'mapselectchanged',
  'mapselected',
  'mapunselected',
  'axisareaselected',
  'focusnodeadjacency',
  'unfocusnodeadjacency',
  'brush',
  'brushselected',
  'rendered',
  'finished',
  'click',
  'dblclick',
  'mouseover',
  'mouseout',
  'mousemove',
  'mousedown',
  'mouseup',
  'globalout',
  'contextmenu'
]

export default {
  components: {
    echarts
  },
  props: {
    // 初始化 ECharts 实例
    initOptions: {
      type: Object
    },
    // ECharts 实例的数据
    options: {
      type: Object
    },
    // 当前 ECharts 实例使用的主题
    theme: {
      type: [String, Object]
    },
    // 实例的分组，会自动绑定到 ECharts 组件的同名属性上
    group: {
      type: String
    },
    // 指定 ECharts 实例在组件根元素尺寸变化时是否需要自动进行重绘
    autoresize: {
      type: Boolean,
      default: false
    },
    // 在性能敏感（数据量很大）的场景下，我们最好对于 options prop 绕过 Vue 的响应式系统。当将 manual-update prop 指定为 true 且不传入 options prop 时，数据将不会被监听。然后，你需要用 ref 获取组件实例以后手动调用 mergeOptions 方法来更新图表
    manualUpdate: {
      type: Boolean,
      default: false
    },
    // 是否浅监控属性变化
    watchShallow: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      lastArea: 0,
      chart: null,
      manualOptions: null,
      _resizeHandler: null
    }
  },

  // 生命周期钩子
  created () {
    if (!this.manualUpdate) {
      // 延迟加载不监控options变化
      this.$watch('options', (_new, old) => {
        if (!this.chart && _new) {
          this.init()
        } else {
          this.chart.setOption(_new, _new !== old)
        }
      }, { deep: !this.watchShallow })
    }
    const watched = ['theme', 'initOptions', 'autoresize', 'manualUpdate', 'watchShallow']
    watched.forEach(prop => {
      this.$watch(prop, () => {
        this.refresh()
      }, { deep: true })
    })
  },
  mounted () {
    // 初始化表格
    if (this.options) {
      this.init()
    }
  },
  /**
   * 页面激活执行
   */
  activated () {
    if (this.autoresize) {
      this.chart && this.chart.resize()
    }
  },
  /**
   * 销毁页面前销毁chart
   */
  beforeDestroy () {
    if (this.chart) {
      this.destroy()
    }
  },

  // 计算属性
  computed: {
    // 获取div的样式
    getDivStyle: function () {
      if (!this.initOptions || !this.initOptions.height) {
        return 'height: 100%;'
      }
      return `height:${this.initOptions.height};`
    },
    // 判断charts是否有数据
    getHasData: function () {
      // 获取数据
      const option = this.manualOptions || this.options
      if (!option) {
        return false
      }
      if (!option.series || option.series.length === 0) {
        return false
      }
      let result = false
      for (let item of option.series) {
        if (item.data && item.data.length > 0) {
          result = true
          break
        }
      }
      return result
    }
  },
  methods: {
    /**
     * 执行echart方法
     */
    delegateMethod: function (name, ...args) {
      if (!this.chart) {
        this.init()
      }
      return this.chart[name](...args)
    },
    // 执行echart方法resize
    resize: function (options) {
      this.delegateMethod('resize', options)
    },
    // 执行echart方法appendData
    appendData: function (params) {
      this.delegateMethod('appendData', params)
    },
    // 执行echart方法dispatchAction
    dispatchAction: function (payload) {
      this.delegateMethod('dispatchAction', payload)
    },
    // 执行echart方法convertToPixel
    convertToPixel: function (finder, value) {
      this.delegateMethod('convertToPixel', finder, value)
    },
    // 执行echart方法convertFromPixel
    convertFromPixel: function (finder, value) {
      this.delegateMethod('convertFromPixel', finder, value)
    },
    // 执行echart方法containPixel
    containPixel: function (finder, value) {
      this.delegateMethod('containPixel', finder, value)
    },
    // 执行echart方法showLoading
    showLoading: function (type, options) {
      this.delegateMethod('showLoading', type, options)
    },
    // 执行echart方法hideLoading
    hideLoading: function () {
      this.delegateMethod('hideLoading')
    },
    // 执行echart方法appendData
    getDataURL: function (options) {
      this.delegateMethod('getDataURL', options)
    },
    // 执行echart方法appendData
    getConnectedDataURL: function (options) {
      this.delegateMethod('getConnectedDataURL', options)
    },
    clear: function () {
      this.delegateMethod('clear')
    },
    dispose: function () {
      this.delegateMethod('dispose')
    },
    // 合并参数
    mergeOptions: function (options, notMerge, lazyUpdate) {
      if (this.manualUpdate) {
        this.manualOptions = options
      }
      if (!this.chart) {
        this.init()
      } else {
        this.delegateMethod('setOption', options, notMerge, lazyUpdate)
      }
    },
    // 获取el面积
    getArea () {
      return this.$el.offsetWidth * this.$el.offsetHeight
    },
    /**
     * 初始化方法
     */
    init: function () {
      if (!this.chart && this.getHasData) {
        // 创建chart实例
        const chart = echarts.init(this.$el, this.theme, this.initOptions)
        if (this.group) {
          chart.group = this.group
        }
        chart.setOption(this.manualOptions || this.options || {}, true)
        console.log(this.$listeners)
        // 绑定事件
        EVENTS.forEach(event => {
          if (this.$listeners[event]) {
            chart.on(event, params => {
              this.$emit(event, params)
            })
          }
        })
        // 绑定autoresize
        if (this.autoresize) {
          this.lastArea = this.getArea()
          this._resizeHandler = debounce(() => {
            if (this.lastArea === 0) {
              this.mergeOptions({}, true)
              this.resize()
              this.mergeOptions(this.options || this.manualOptions || {}, true)
            } else {
              this.resize()
            }
            this.lastArea = this.getArea()
          }, 100, { leading: true })
          addListener(this.$el, this._resizeHandler)
        }
        this.chart = chart
      }
    },
    // 销毁charts
    destroy: function () {
      if (this.autoresize) {
        // 移除事件
        removeListener(this.$el, this._resizeHandler)
      }
      this.dispose()
      this.chart = null
    },
    // 刷新echart
    refresh: function () {
      if (this.chart) {
        this.destroy()
        this.init()
      }
    }
  }
}
</script>

<style>
  .shadow {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9rem;
    color: #8590a6;
  }
</style>
