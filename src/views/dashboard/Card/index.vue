<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <!-- 第一个card -->
        <el-card>
          <Detail title="总销售额" count="￥ 126560">
            <template slot="charts">
              <span>
                周同比 56.67%<svg t="1655431308298" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2285" width="16" height="16"><path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="2286"></path></svg>
              </span>
              <span>
                日同比 19.6%<svg t="1655431477524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3749" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="3750"></path></svg>
              </span>
            </template>
            <template slot="footer">
              <span>日销售额 ￥ 1277</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <!-- 第二个card -->
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineCharts></LineCharts>
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <!-- 第三个card -->
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <BarCharts></BarCharts>
            </template>
            <template slot="footer">
              <span>转化率 69%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <!-- 第四个card -->
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressChart></ProgressChart>
            </template>
            <template slot="footer">
              <span>
                周同比 12%<svg t="1655431308298" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2285" width="16" height="16"><path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="2286"></path></svg>
              </span>
              <span>
                日同比 11%<svg t="1655431477524" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3749" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="3750"></path></svg>
              </span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import LineCharts from './lineChart'
import BarCharts from './barChart'
import ProgressChart from './progressChart'

export default {
  name: 'Card',
  components: {
    Detail,
    LineCharts,
    BarCharts,
    ProgressChart
  }
}
</script>

<style></style>
