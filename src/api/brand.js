import request from '@/utils/request'

/**
 * 查询所有品牌
 * @param data
 */
export function getBrandList(data) {
  return request({
    url: '/brand/queryByPage',
    method: 'post',
    data
  })
}

/**
 * 修改品牌
 * @param data
 */
export function brandModify(data) {
  return request({
    url: '/brand/modify',
    method: 'post',
    data
  })
}

/**
 * 品牌新增
 * @param data
 */
export function brandCreate(data) {
  return request({
    url: '/brand/add',
    method: 'post',
    data
  })
}
