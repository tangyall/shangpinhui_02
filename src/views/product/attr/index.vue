<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 展示平台属性 -->
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" style="margin: 10px 0" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格,展示平台属性 -->
        <el-table border :data="attrList">
          <el-table-column width="80" label="序号" type="index" align="center"></el-table-column>
          <el-table-column width="150" label="属性名称" prop="attrName"></el-table-column>
          <el-table-column width="" label="属性值列表">
            <template slot-scope="{ row, $index }">
              <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id" style="margin: 0 5px">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column width="150" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 修改或添加平台属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-table border style="margin: 20px 0" :data="attrInfo.attrValueList">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <!-- 失焦是span，聚焦是input -->
              <el-input v-model="row.valueName" placeholder="请输入属性值名称" size="mini" v-if="row.flag" :ref="$index" @blur="toLook(row)" @keyup.native.enter="toLook(row)"></el-input>
              <span v-else @click="toEdit(row, $index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length < 1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 接收平台属性的数据
      attrList: [],
      // 控制table表格是否显示
      isShowTable: true,
      // 收集或修改新增属性
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值
          // {
          //   attrId: 0, //相应属性名的id
          //   valueName: '' // 属性名
          // }
        ],
        categoryId: 0, //三级分类的id
        categoryLevel: 3 //服务器也需要区分是几级id
      }
    }
  },
  methods: {
    // 自定义事件的回调
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level == 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        // 代表三级分类的id有了
        this.category3Id = categoryId
        // 发请求,获取平台属性进行展示
        this.getAttrList()
      }
    },
    // 获取平台属性进行展示
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      let result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code == 200) {
        this.attrList = result.data
      }
    },
    // 添加属性值的回调
    addAttrValue() {
      // 向属性值的数组里添加元素
      this.attrInfo.attrValueList.push({
        // attrId：是相应属性的id，目前是没有的，
        attrId: this.attrInfo.id,
        // valueName：相应属性值的名称
        valueName: '',
        // 给每一个属性添加一个标记，用户可以切换查看和编辑模式，每一个模式不会相互干扰
        flag: true
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮的回调
    addAttr() {
      this.isShowTable = false
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [
          // 属性值
          // {
          //   attrId: 0, //相应属性名的id
          //   valueName: '' // 属性名
          // }
        ],
        categoryId: this.category3Id, //三级分类的id
        categoryLevel: 3 //服务器也需要区分是几级id
      }
    },
    // 修改某个属性
    updateAttr(row) {
      this.attrInfo = cloneDeep(row)
      this.attrInfo.attrValueList.forEach((item) => {
        this.$set(item, 'flag', false)
      })
      this.isShowTable = false
    },
    // 失去焦点的事件，切换为查看模式,
    toLook(row) {
      // 如果属性值为空，则不能作为最新的属性值，需要提示用户输入其他属性值
      if (row.valueName.trim() == '') {
        this.$message.info('不能为空，请重新输入')
        return
      }
      // 新增的属性值，不能与已有的属性值相同
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        // 需要把row从数组判断时去除
        if (row != item) {
          return row.valueName == item.valueName
        }
      })
      if (isRepeat) {
        this.$message.error('请勿重复输入')
        return
      }
      // row:形参是当前用户添加的最新的属性值
      row.flag = false
    },
    // 点击span回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true
      this.$nextTick(() => {
        // 获取相应的表单元素，实现聚焦
        this.$refs[index].focus()
      })
    },
    // 气泡确认框的确定按钮的回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮，添加或修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数
      // 1：若属性值为空，则不提交给服务器
      // 2：提交给服务器的数据不应出现flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        // 过滤没有属性值的
        if (item.valueName.trim() != '') {
          // 删除flag字段
          delete item.flag
          return true
        }
      })
      // 发请求
      await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
      try {
        // 提示成功信息
        this.$message.success('保存成功')
        // 从新获取数据进行展示
        this.getAttrList()
        // 保存成功后，展示平台属性
        this.isShowTable = true
      } catch (error) {}
    }
  }
}
</script>

<style></style>
