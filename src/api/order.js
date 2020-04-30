import request from '@/utils/request'

/**
 * 分页查询订单
 * @param data
 */
export function getOrderList(data) {
  return request({
    url: '/order/querySellerOrderByPage',
    method: 'post',
    data
  })
}


/**
 * 查询订单详情
 * @param data
 */
export function getOrderDetail(data) {
  return request({
    url: '/order/querySellerOrderDetail',
    method: 'post',
    data
  })
}

/**
 * 提交审核
 * @param data
 */
export function submitApproval(data) {
  return request({
    url: '/order/submitApprove',
    method: 'post',
    data
  })
}

/**
 * 审核通过
 * @param data
 */
export function approvePass(data) {
  return request({
    url: '/order/approvePass',
    method: 'post',
    data
  })
}


/**
 * 审核不通过
 * @param data
 */
export function approveFail(data) {
  return request({
    url: '/order/approveFail',
    method: 'post',
    data
  })
}

/**
 * 取消订单
 * @param data
 */
export function orderCancel(data) {
  return request({
    url: '/order/cancelOrder',
    method: 'post',
    data
  })
}

/**
 * 确认收货
 * @param data
 */
export function confirmReceipt(data) {
  return request({
    url: '/order/confirmReceipt',
    method: 'post',
    data
  })
}

/**
 * 确认发货
 * @param data
 */
export function confirmShip(data) {
  return request({
    url: '/order/confirmShip',
    method: 'post',
    data
  })
}

