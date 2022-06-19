<template>
  <div>
    <!-- 表格 -->
    <el-table border :data="records">
      <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
      <el-table-column label="名称" prop="skuName" width=""></el-table-column>
      <el-table-column label="描述" prop="skuDesc" width=""></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="" style="height: 80px; width: 80px" />
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight" width="80"></el-table-column>
      <el-table-column label="价格" prop="price" width="80"></el-table-column>
      <el-table-column label="操作" prop="" width="">
        <template slot-scope="{ row, $index }">
          <el-button type="info" icon="el-icon-bottom" size="mini" v-if="row.isSale == 1" @click="cancel(row)"></el-button>
          <el-button type="success" icon="el-icon-top" size="mini" v-else @click="sale(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="$message.info('此功能正在开发中')"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      style="text-align: center; margin: 10px 0"
      :total="total"
      :current-page="1"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getSkuList"
      @prev-click="getSkuList"
      @next-click="getSkuList"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!-- 抽屉 -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag style="margin-right: 10px" type="success" v-for="(attr, index) in skuInfo.skuAttrValueList" :key="attr.id">{{ attr.attrName }}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel trigger="click" height="300px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" style="width: 500px; height: 300px" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Sku',
  data() {
    return {
      // 当前页
      page: 1,
      // 每页展示的数据量
      limit: 10,
      // 存储sku列表的数据
      records: [],
      // 分页器总的数据量
      total: 0,
      // 存储sku信息
      skuInfo: {},
      // 控制抽屉显示与隐藏
      show: false
    }
  },
  mounted() {
    this.getSkuList()
  },
  methods: {
    // 获取sku列表数据
    async getSkuList(pages = 1) {
      this.page = pages
      const { page, limit } = this
      let result = await this.$API.sku.reqSkuList(page, limit)
      if (result.code == 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    handleSizeChange(limit) {
      this.limit = limit
      this.getSkuList()
    },
    // 上架
    async sale(row) {
      let result = await this.$API.sku.reqSale(row.id)
      console.log(result)
      if (result.code == 200) {
        row.isSale = 1
        this.$message.success('上架成功')
      } else {
        this.$message.error('上架失败')
      }
    },
    // 下架
    async cancel(row) {
      let result = await this.$API.sku.reqCancel(row.id)
      console.log(result)
      if (result.code == 200) {
        row.isSale = 0
        this.$message.success('下架成功')
      } else {
        this.$message.error('下架失败')
      }
    },
    // 获取sku详情的方法
    async getSkuInfo(sku) {
      this.show = true
      let result = await this.$API.sku.reqSkuById(sku.id)
      if (result.code == 200) {
        this.skuInfo = result.data
      }
    }
  }
}
</script>

<style scoped>
.el-row .el-col-5 {
  text-align: right;
}
.el-col-16 {
  margin: 3px 15px;
}
</style>

<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__button {
  width: 10px;
  height: 10px;
  background-color: skyblue;
  border-radius: 50%;
}
</style>
