import request from '@/utils/request'

/**
 * 查询所有账单
 * @param data
 */
export function getBillList(data) {
  return request({
    url: '/bill/querySellerBillByPage',
    method: 'post',
    data
  })
}

/**
 * 还款
 * @param data
 */
export function billRepay(data) {
  return request({
    url: '/bill/repay',
    method: 'post',
    data
  })
}
