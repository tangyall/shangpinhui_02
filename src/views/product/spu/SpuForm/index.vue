<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="(tm, index) in tradeMarkList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="5" placeholder="SPU描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- action:图片上传地址 -->
        <!-- list-type:文件列表的类型 -->
        <!-- on-preview:图片预览时触发 -->
        <!-- on-remove：图片删除时触发 -->
        <!-- file-list： -->
        <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList" :on-success="handleSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectAttr.length}未选择`" v-model="attrIdAndAttrName">
          <el-option :label="unSelect.name" :value="`${unSelect.id}:${unSelect.name}}`" v-for="(unSelect, index) in unSelectAttr" :key="unSelect.id"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaveAtrr">添加销售属性</el-button>
        <el-table border style="width: 100%; margin: 5px 0" :data="spu.spuSaleAttrList">
          <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
          <el-table-column label="属性名" prop="saleAttrName"></el-table-column>
          <el-table-column label="属性值名称列表" prop="">
            <template slot-scope="{ row, $index }">
              <!-- 展示已有的属性值列表 -->
              <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index, 1)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm" -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)"> </el-input>
              <!-- @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="">
            <template slot-scope="{ row, $index }">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  data() {
    return {
      attrIdAndAttrName: '', //收集未选择的销售属性的id和名称
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储spu信息属性
      spu: {
        category3Id: 0,
        // 品牌id
        tmId: '',
        // 描述
        description: '',
        // spu名称
        spuName: '',
        // spu图片的收集
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: '',
          //   imgUrl: '',
          //   spuId: 0
          // }
        ],
        // 平台属性和属性值的收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0
          //     }
          //   ]
          // }
        ]
      },
      tradeMarkList: [], // 存储品牌的信息
      spuImageList: [], //存储spu的图片
      saleAttrList: [] //全部的销售属性的数据
    }
  },
  methods: {
    // 照片墙删除图片的回调
    handleRemove(file, fileList) {
      // console.log(file, fileList)
      // 收集照片墙图片数据
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 初始化spu数据
    async initSpuData(spu) {
      // 获取spu信息的数据
      let spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code == 200) {
        this.spu = spuResult.data
      }
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取spu图片的数据
      let spuImageResult = await this.$API.spu.reqImageList(spu.id)
      if (spuImageResult.code == 200) {
        // 由于照片墙显示图片数据需要为数组，且数组元素需要有name和url属性
        let listAttr = spuImageResult.data
        listAttr.forEach((item) => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listAttr
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 照片墙图片上传成功的回调
    handleSuccess(response, file, fileList) {
      // console.log(response, file, fileList)
      // 手机图片墙的信息
      this.spuImageList = fileList
    },
    // 添加新的销售属性
    addSaveAtrr() {
      let attr = this.attrIdAndAttrName.split(':')[0]
      const baseSaleAttrId = attr[0]
      const saleAttrName = attr[1]
      let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      let result = this.spu.spuSaleAttrList.every((item) => item.baseSaleAttrId != newSaleAttr.baseSaleAttrId)
      if (result) {
        this.spu.spuSaleAttrList.push(newSaleAttr)
      }
      this.attrIdAndAttrName = ''
    },
    // 属性值添加按钮的回调
    addSaleAttrValue(row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
    },
    // el-input失去焦点的事件
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      if (inputValue.trim() == '') {
        this.$message.info('属性值不能为空')
        return
      }
      let result = row.spuSaleAttrValueList.every((item) => item.saleAttrValueName != inputValue)
      if (!result) {
        this.$message.info('属性值不能重复')
        return
      }
      let newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      // 新增的属性值不能为空且不能重复
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    // 添加或者更新的保存spu按钮的回调
    async addOrUpdateSpu() {
      // 整理参数spu
      // 整理照片墙的参数
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code == 200) {
        this.$message.success('保存成功')
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      } else {
        this.$message.error('保存失败')
      }
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加SPU发请求的回调函数
    async addSpuData(category3Id) {
      // 收集三级分类id
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取平台全部的销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 取消按钮的回调
    cancel() {
      this.$emit('changeScene', { scene: 0, flag: '' })
      Object.assign(this._data, this.$options.data())
    }
  },
  computed: {
    // 计算出未选择的销售属性
    unSelectAttr() {
      // 整个平台的销售属性       saleAttrList
      // 当前spu的销售属性        spuSaleAttrValueList
      // filter：数组过滤方法
      let result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName
        })
      })
      return result
    }
  }
}
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
