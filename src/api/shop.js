import request from '@/utils/request'


/**
 * 经营概况统计
 * @param data
 */
export function businessCount(data) {
  return request({
    url: '/shop/businessCount',
    method: 'post',
    data
  })
}


/**
 * 订单状态统计
 * @param data
 */
export function orderStatusCount(data) {
  return request({
    url: '/shop/orderStatusCount',
    method: 'post',
    data
  })
}
