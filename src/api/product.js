import request from '@/utils/request'


/**
 * 新增产品
 * @param data
 */
export function productCreate(data) {
  return request({
    url: '/product/addProduct',
    method: 'post',
    data
  })
}


/**
 * 编辑产品
 * @param data
 */
export function productModify(data) {
  return request({
    url: '/product/modifyProduct',
    method: 'post',
    data
  })
}

/**
 * 查询产品详情
 * @param params
 */
export function productDetail(params) {
  return request({
    url: '/product/queryProductFullInfo',
    method: 'post',
    params
  })
}
