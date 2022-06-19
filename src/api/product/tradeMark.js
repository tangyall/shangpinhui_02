// 这个模块主要获取品牌管理数据的模块
// 引入axios，进行二次封装
import request from '@/utils/request'

// 获取品牌列表接口 
// /admin/product/baseTrademark/{page}/{limit}     get
export const reqTradeMark = (page, limit) => request({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: 'get'
})

// 处理添加品牌的操作
// /admin/product/baseTrademark/save    post  携带两个参数：品牌名称和logo

// 修改品牌的操作   
//  /admin/product/baseTrademark/save      put  携带三个参数：品牌id，品牌名称和logo
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 携带id，则为修改品牌
  if(tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'put',
      data: tradeMark
    })
  } else {
    // 新增品牌
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMark
    })
  }
}

// 删除某个品牌的操作
// /admin/product/baseTrademark/remove/{id}    delete
export const reqDeleteTradeMark = (id) => request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})