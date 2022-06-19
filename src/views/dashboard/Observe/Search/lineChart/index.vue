<template>
  <div>
    <div class="header">
      <span class="search-header">搜索用户</span>
      <svg t="1655428224218" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2547" width="26" height="26">
        <path
          d="M509.92 795.84c157.904 0 285.92-128.016 285.92-285.92C795.84 352 667.808 224 509.92 224 352 224 224 352 224 509.92c0 157.904 128 285.92 285.92 285.92z m0 48C325.504 843.84 176 694.32 176 509.92 176 325.504 325.504 176 509.92 176c184.416 0 333.92 149.504 333.92 333.92 0 184.416-149.504 333.92-333.92 333.92z m-2.448-400.704h16a16 16 0 0 1 16 16v201.728a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V459.136a16 16 0 0 1 16-16z m0-100.176h16a16 16 0 0 1 16 16v23.648a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-23.648a16 16 0 0 1 16-16z"
          p-id="2548"
        ></path>
      </svg>
    </div>
    <div class="main">
      <span class="main-title">12321</span>
      <span class="main-content">17.1%</span>
      <svg t="1655431308298" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2285" width="16" height="16">
        <path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="2286"></path>
      </svg>
      <svg t="1655431477524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3749" width="16" height="16">
        <path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="3750"></path>
      </svg>
    </div>
    <div class="footer">
      <div class="charts" ref="charts"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'LineChart',
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        type: 'category'
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'line',
          data: [12, 56, 23, 35, 56, 98, 77, 88, 66, 100],
          itemStyle: {
            opacity: 0
          },
          lineStyle: {
            color: 'skyblue'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'skyblue' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'white' // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
          smooth: true
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.search-header {
  margin-right: 20px;
}
.main-title {
  margin-right: 30px;
}
.main-content {
  margin-right: 10px;
  font-size: 14px;
}
.charts {
  width: 100%;
  height: 100px;
}
.footer {
  margin: 10px 0;
}
</style>
