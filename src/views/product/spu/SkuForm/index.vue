<template>
  <div>
    <el-form label-width="100px" ref="">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格（元）">
        <el-input placeholder="价格（元）" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量（千克）">
        <el-input placeholder="重量（千克）" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr, index) in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue, index) in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr, index) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80" align="center"></el-table-column>
          <el-table-column label="图片" prop="" width="">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName" width=""></el-table-column>
          <el-table-column label="操作" prop="" width="">
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="small" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
              <el-button size="small" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 存储平台属性的数据
      attrInfoList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储图片信息
      spuImageList: [],
      // 收集sku数据
      skuInfo: {
        // 第一类：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二类：通过数据双向绑定获取
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 第三类：书写代码进行获取
        // 平台属性数据
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   valueId: 0
          // }
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   saleAttrId: 0,
          //   saleAttrValueId: 0,
          // }
        ],
        // 图片数据
        skuImageList: [
          // {
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   isDefault: 'string',
          //   spuImgId: 0
          // }
        ],
        // 设置默认图片
        skuDefaultImg: ''
      },
      spu: {},
      // 复选框收集的图片数据
      imageList: []
    }
  },
  methods: {
    // 获取skufrom数据
    async getData(category1Id, category2Id, spu, imageList) {
      // 收集父组件的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.tmId = spu.tmId
      this.skuInfo.spuId = spu.id
      this.spu = spu
      // 获取平台属性的数据
      let result = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (result.code == 200) {
        this.attrInfoList = result.data
      }
      // 获取销售属性
      let result1 = await this.$API.spu.reqSpuAttrSaleList(spu.id)
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data
      }
      // 获取图片的数据
      let result2 = await this.$API.spu.reqSpuImageList(spu.id)
      if (result2.code == 200) {
        result2.data.forEach((item) => {
          item.isDefault = 0
        })
        this.spuImageList = result2.data
      }
    },
    // table表格的复选框事件
    handleSelectionChange(params) {
      this.imageList = params
    },
    // 排他操作
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 取消按钮的操作
    cancel() {
      // 自定义事件，让父组件切换场景
      this.$emit('changeScenes', { scene: 0, flag: '' })
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮的事件
    async save() {
      // 整理平台属性
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      attrInfoList.forEach((item) => {
        if (item.attrAndValueId) {
          let arr = item.attrAndValueId.split(':')
          let obj = { attrId: arr[0], valueId: arr[1] }
          skuInfo.skuAttrValueList.push(obj)
        }
      })
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 整理图片数据
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImagId: item.id
        }
      })
      let result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code == 200) {
        this.$message.success('保存成功')
        this.$emit('changeScenes', { scene: 0, flag: '' })
      }
    }
  }
}
</script>

<style></style>
