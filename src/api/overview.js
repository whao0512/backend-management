import request from '@/utils/request'

/**
 * 经营概况统计
 * @param params
 */
export function businessCount(params) {
  return request({
    url: '/shop/businessCount',
    method: 'post',
    params
  })
}


/**
 * 订单状态统计
 * @param params
 */
export function orderStatusCount(params) {
  return request({
    url: '/shop/orderStatusCount',
    method: 'post',
    params
  })
}


/**
 * 趋势分析
 * @param params
 */
export function trendAnalysis(params) {
  return request({
    url: '/shop/trendAnalysis',
    method: 'post',
    params
  })
}
