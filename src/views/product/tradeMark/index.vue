<template>
  <div>
    <!-- 按钮 -->
    <el-button type="primary" icon="el-icon-plus" style="margin: 10px, 0px" @click="showDialog">添加</el-button>
    <!-- 表格组件 -->
    <el-table style="margin-top: 10px; width: 100%" border :data="list">
      <el-table-column label="序号" width="80px" align="center" type="index"> </el-table-column>
      <el-table-column label="品牌名称" width="width" align="center" prop="tmName"> </el-table-column>
      <el-table-column label="品牌LOGO" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width" align="center">
        <template slot-scope="{ row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :pager-count="7"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      layout=" prev, pager, next, jumper, ->, sizes, total"
      @prev-click="getPageList"
      @next-click="getPageList"
      @current-change="getPageList"
      @size-change="handleSizeChange"
    ></el-pagination>
    <!-- 对话框 -->
    <el-dialog :title="tmForm.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form 表单 -->
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="reluForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    // 输入自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error('品牌名称长度需要2~10位'))
      } else {
        callback()
      }
    }
    return {
      // 分页器第几页
      page: 1,
      // 每一页展示数据的多少
      limit: 3,
      // 总数据的条数
      total: 0,
      // 列表数据
      list: [],
      // 对话框显示与隐藏的属性控制
      dialogFormVisible: false,
      // 收集品牌的信息
      tmForm: {
        logoUrl: '',
        tmName: ''
      },
      rules: {
        // 品牌名称的验证规则
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          // 自定义校验规则
          { validator: validateTmName, trigger: 'change' }
        ],
        // 品牌logo的验证规则
        logoUrl: [{ required: true, message: '请上传品牌图片' }]
      }
    }
  },
  mounted() {
    // 获取列表数据的方法
    this.getPageList()
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList(pager = 1) {
      this.page = pager
      // 解构参数
      const { page, limit } = this
      let result = await this.$API.trademark.reqTradeMark(page, limit)
      if (result.code == 200) {
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    // handleCurrentChange(page) {
    //   this.page = page
    //   this.getPageList()
    // }
    // 修改每页展示的数据量
    handleSizeChange(limit) {
      this.limit = limit
      this.getPageList()
    },
    // 点击添加品牌的按钮
    showDialog() {
      // 清除上一次的品牌信息
      this.tmForm = { logoUrl: '', tmName: '' }
      // 弹出对话框
      this.dialogFormVisible = true
    },
    // 修改某个品牌的信息
    updateTradeMark(row) {
      this.dialogFormVisible = true
      this.tmForm = { ...row }
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // 收集品牌图片数据
      this.tmForm.logoUrl = res.data
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type == 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加按钮，添加或修改品牌
    addOrUpdateTradeMark() {
      this.$refs.reluForm.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false
          // 发请求，添加或修改品牌
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(this.tmForm)
          if (result.code == 200) {
            // 弹出信息
            this.$message.success(this.tmForm.id ? '修改品牌成功' : '添加品牌成功')
            // 重新获取数据
            this.getPageList(this.tmForm.id ? (pager = this.page) : 1)
          }
        } else {
          console.log('提交失败!!')
          return false
        }
      })
    },
    // 删除品牌的操作
    deleteTradeMark(row) {
      this.$confirm('此操作将该品牌信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id)
          if (result.code == 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getPageList(this.list.length > 1 ? this.page : this.page - 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
