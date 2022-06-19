<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'BarChart',
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
          type: 'bar',
          data: [12, 56, 23, 35, 56, 98, 77, 88, 66, 100, 85, 68, 79, 92],
          color: 'skyblue'
        }
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      },
      tooltip: {}
    })
  }
}
</script>

<style scoped>
.charts {
  width: 100%;
  height: 100%;
}
</style>
