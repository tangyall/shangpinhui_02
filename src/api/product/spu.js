import request from '@/utils/request'

// 获取spu列表数据的接口
// /admin/product/{page}/{limit}        get     page,limit,category3Id
export const reqSpuList = (page, limit, category3Id) => request({
  url: `/admin/product/${page}/${limit}`,
  method: 'get',
  params: {category3Id}
})

// 获取SPU信息的接口
// admin/product/getSpuById/{spuId}    get
export const reqSpu = (spuId) => request({
  url: `admin/product/getSpuById/${spuId}`,
  method: 'get'
})

// 获取品牌的信息
// /admin/product/baseTrademark/getTrademarkList   get
export const reqTradeMarkList = () => request({
  url: '/admin/product/baseTrademark/getTrademarkList',
  method: 'get'
})

// 获取spu图片的请求
// /admin/product/spuImageList/{spuId}      get
export const reqImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method: 'get'
})

// 获取平台的全部销售属性-----整个平台, 一共三个
// /admin/product/baseSaleAttrList      get
export const reqBaseSaleAttrList = () => request({
  url: '/admin/product/baseSaleAttrList',
  method: 'get'
})

// 修改或添加spu
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 携带参数带有id，则为修改spu
  if(spuInfo.id) {
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'post',
      data: spuInfo
    })
  } else {
    // 携带的参数不带id，则为添加
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
}

// 删除spu
export const reqDeleteSpu = (spuId) => request({
  url: `/admin/product/deleteSpu/${spuId}`,
  method: 'delete'
}) 

// 获取图片的接口
export const reqSpuImageList = (spuId) => request({
  url: `/admin/product/spuImageList/${spuId}`,
  method: 'get'
})

// 获取销售属性列表
export const reqSpuAttrSaleList = (spuId) => request({
  url: `/admin/product/spuSaleAttrList/${spuId}`,
  method: 'get'
}) 

// 获取平台属性的请求
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({
  url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
  method: 'get'
})

// 添加sku
export const reqAddSku = (skuInfo) => request({
  url: '/admin/product/saveSkuInfo',
  method: 'post',
  data: skuInfo
})

// 获取sku列表的请求
export const reqSkuList = (spuId) => request({
  url: `/admin/product/findBySpuId/${spuId}`,
  method: 'get'
})