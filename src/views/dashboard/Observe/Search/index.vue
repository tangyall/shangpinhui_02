<template>
  <div>
    <el-card class="card">
      <div slot="header" class="header">
        <el-row>
          <el-col :span="23">
            <span>线上热门搜索</span>
          </el-col>
          <el-col :span="1">
            <!-- 下拉菜单 -->
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineChart></LineChart>
        </el-col>
        <el-col :span="12">
          <LineChart></LineChart>
        </el-col>
      </el-row>
      <!-- table表格 -->
      <!--  :default-sort="{ prop: 'date', order: 'descending' }" -->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="排名" type="index" width="80" align="center"> </el-table-column>
        <el-table-column label="搜索关键字" align="center"> </el-table-column>
        <el-table-column label="用户数" sortable width="180" align="center"> </el-table-column>
        <el-table-column label="周涨幅" sortable width="180" align="center"> </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination layout="->,prev, pager, next" :total="1000"> </el-pagination>
    </el-card>
  </div>
</template>

<script>
import LineChart from './lineChart'

export default {
  name: 'Search',
  data() {
    return {
      tableData: [{}]
    }
  },
  components: {
    LineChart
  }
}
</script>

<style scoped>
.header {
  padding: 5px;
  border-bottom: 1px solid #eee;
}
.search-header {
  display: flex;
  justify-content: space-between;
}
.card {
  height: 407px;
}
</style>
