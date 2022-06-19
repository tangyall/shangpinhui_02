<template>
  <div>
    <!-- 三级联动 -->
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 底部由三部分进行切换 -->
      <!-- 展示spu列表的结构 -->
      <div v-show="scene == 0">
        <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80"></el-table-column>
          <el-table-column label="spu名称" prop="spuName"></el-table-column>
          <el-table-column label="spu描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 将来用hintButton进行封装替换 -->
              <hint-button title="添加spu" type="success" icon="el-icon-plus" size="mini" @click="addSku(row)"></hint-button>
              <hint-button title="修改spu" type="warning" icon="el-icon-edit" size="mini" @click="updateSpu(row)"></hint-button>
              <hint-button title="查看当前spu的全部sku列表" type="info" icon="el-icon-info" size="mini" @click="handler(row)"></hint-button>
              <el-popconfirm title="确定删除此spu吗？" @onConfirm="deleteSpu(row)">
                <hint-button title="删除spu" type="danger" icon="el-icon-delete" size="mini" slot="reference"> </hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          style="text-align: center; margin: 10px 0"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="handleCurrentChange"
          @prev-click="handleCurrentChange"
          @next-click="handleCurrentChange"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" ref="spu" @changeScene="changeScene"></SpuForm>
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScene"></SkuForm>
    </el-card>
    <!-- 查看sku列表 -->
    <el-dialog :title="`${spu.spuName}的列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" border v-loading="loading">
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="价格" prop="price"></el-table-column>
        <el-table-column label="重量" prop="weight"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row, $index }">
            <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
import { done } from 'nprogress'
export default {
  name: 'Spu',
  data() {
    return {
      // 分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 分页器当前第几页
      page: 1,
      // 每一页展示的数据量
      limit: 3,
      // 存储spu列表数据
      records: [],
      // spu数据的总量
      total: 0,
      // 控制三级联动的可操作性
      // scene:0：展示spu列表， 1：修改|添加spu， 2：添加sku
      scene: 0,
      // 控制sku列表的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      // 存储sku列表数据
      skuList: [],
      loading: true
    }
  },
  methods: {
    // 三级联动的自定义事件，可以把子组件相应的id传给父组件
    getCategoryId({ categoryId, level }) {
      // categoryId:获取一，二，三级的id
      // 区分是哪一级的id
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 获取spu类的列表数据进行展示
        this.getSpuList()
      }
    },
    // 获取spu列表的方法
    async getSpuList() {
      const { page, limit, category3Id } = this
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      if (result.code == 200) {
        this.records = result.data.records
        this.total = result.data.total
      }
    },
    // 修改分页器当前页的回调
    handleCurrentChange(page) {
      this.page = page
      this.getSpuList()
    },
    // 每一页展示数据量变化时的回调
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 添加spu按钮的回调
    addSpu() {
      // 切换场景
      this.scene = 1
      // 通知子组件发请求
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改某一个spu的回调
    updateSpu(row) {
      this.scene = 1
      // 在父组件中，可以通过ref获取子组件的方法和数据
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件的回调(spuform)
    changeScene({ scene, flag }) {
      this.scene = scene
      if (flag == '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除spu按钮的回调
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code == 200) {
        this.$message.success('删除成功')
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加sku按钮的回调
    addSku(row) {
      this.scene = 2
      // 父组件调用子组件的方法，让子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // 查看sku列表按钮的回调
    async handler(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      // 获取sku列表数据
      let result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code == 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done) {
      this.loading = true
      this.skuList = []
      done()
    }
  },
  components: { SpuForm, SkuForm }
}
</script>

<style></style>
