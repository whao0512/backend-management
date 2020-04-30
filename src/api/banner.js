import request from '@/utils/request'

/**
 * 查询所有banner
 * @param data
 */
export function getBannerList(data) {
  return request({
    url: '/merchantBanner/queryAll',
    method: 'post',
    data
  })
}

/**
 * 新增banner
 * @param params
 */
export function bannerCreate(params) {
  return request({
    url: '/merchantBanner/add',
    method: 'post',
    params
  })
}

/**
 * 修改banner
 * @param data
 */
export function bannerModify(data) {
  return request({
    url: '/merchantBanner/modify',
    method: 'post',
    data
  })
}

/**
 * 修改banner排序
 * @param params
 */
export function bannerModifyOrder(params) {
  return request({
    url: '/merchantBanner/move',
    method: 'post',
    params
  })
}
