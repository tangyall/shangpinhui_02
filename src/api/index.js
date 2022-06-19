// 将四个模块的请求统一暴露
import * as trademark from './product/tradeMark'
import * as attr from './product/attr'
import * as sku from './product/sku'
import * as spu from './product/spu'

export default {
  trademark,
  sku,
  spu,
  attr
}