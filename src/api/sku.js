import request from '@/utils/request'


/**
 * 新增sku属性
 * @param params
 */
export function skuAttributeCreate(data) {
  return request({
    url: '/sku/addSkuAttribute',
    method: 'post',
    data
  })
}

/**
 * 删除sku属性
 * @param params
 */
export function skuAttributeDelete(params) {
  return request({
    url: '/sku/deleteSkuAttribute',
    method: 'post',
    params
  })
}

/**
 * 入库
 * @param params
 */
export function skuInStore(params) {
  return request({
    url: '/sku/inStore',
    method: 'post',
    params
  })
}

/**
 * 修改sku属性
 * @param params
 */
export function skuAttributeModify(data) {
  return request({
    url: '/sku/modifySkuAttribute',
    method: 'post',
    data
  })
}

/**
 * 上/下架
 * @param params
 */
export function onOrOffSale(params) {
  return request({
    url: '/sku/onOrOffSale',
    method: 'post',
    params
  })
}

/**
 * 分页查询SKU
 * @param params
 */
export function getSkuList(data) {
  return request({
    url: '/sku/queryByPage',
    method: 'post',
    data
  })
}

/**
 * 根据id查询sku属性
 * @param params
 */
export function getSkuAttributeDetail(params) {
  return request({
    url: '/sku/querySkuAttributeById',
    method: 'post',
    params
  })
}

/**
 * 分页查询sku属性
 * @param params
 */
export function getSkuAttributeList(params) {
  return request({
    url: '/sku/querySkuAttributeByPage',
    method: 'post',
    params
  })
}

/**
 * 分页查询库存记录
 * @param params
 */
export function getStockRecordList(data) {
  return request({
    url: '/sku/queryStockRecordByPage',
    method: 'post',
    data
  })
}
