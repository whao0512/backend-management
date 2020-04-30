import request from '@/utils/request'

/**
 * 分页查询会员
 * @param data
 */
export function getMemberList(data) {
  return request({
    url: '/merchantUserManger/querySellerMemberByPage',
    method: 'post',
    data
  })
}

/**
 * 审核会员
 * @param parmas
 */
export function memberApproval(params) {
  return request({
    url: '/merchantUserManger/auditCustomer',
    method: 'post',
    params
  })
}
