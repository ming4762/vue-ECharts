<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>vue-typescrip-starter</h2>
    <p>mixin 数据 ：{{ testMixinArg }}</p>
    <!-- <Hello type="测试啊啊啊"></Hello> -->
    <!-- <MonitorList :data="['123', '2312', '2312', '21312', '2132', '1231']"></MonitorList> -->
    <ECharts
      autoresize
      :initOptions="{height: '400px',width:'auto'}"
      :options="options"></ECharts>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import TestMixin from '../mixins/test-mixin'

import { ECharts } from '../../src/index'

import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar'

@Component({
  components: {
    ECharts
  },
  mixins: [TestMixin]
})
export default class HelloWorld extends Vue<TestMixin> {
  msg: string = 'Welcome to Your Vue-Typescript App'

  mounted () {
    console.log('这是 _.assign({})')
    console.log('from mixin', this.testMixinArg)

    setTimeout(() => {
      this.options = this.options2
    }, 3000)
  }

  private handlemouseover () {
    console.log(this)
  }

  private options = {
    title: {
      text: '堆叠区域图'
    },
    tooltip : {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        data: []
        // data : ['周一','周二','周三','周四','周五','周六','周日']
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
        name:'邮件营销',
        type:'bar',
        stack: '总量',
        areaStyle: {},
        data: []
        // data:[120, 132, 101, 134, 90, 230, 210]
      }
    ]
  }

  private options2 = {
    title: {
      text: '堆叠区域图'
    },
    tooltip : {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis : [
      {
        type : 'category',
        boundaryGap : false,
        // data: []
        data : ['周一','周二','周三','周四','周五','周六','周日']
      }
    ],
    yAxis : [
      {
        type : 'value'
      }
    ],
    series : [
      {
        name:'邮件营销',
        type:'bar',
        stack: '总量',
        areaStyle: {},
        // data: []
        data:[120, 132, 101, 134, 90, 230, 210]
      }
    ]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
