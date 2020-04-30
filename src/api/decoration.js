import request from '@/utils/request'

/**
 * 查询所有区块
 * @param data
 */
export function getAllBlock(data) {
  return request({
    url: '/merchantBlock/queryAll',
    method: 'post',
    data
  })
}


/**
 * 新增区块
 * @param data
 */
export function blockCreate(data) {
  return request({
    url: '/merchantBlock/add',
    method: 'post',
    data
  })
}

/**
 * 修改区块
 * @param data
 */
export function blockModify(data) {
  return request({
    url: '/merchantBlock/modify',
    method: 'post',
    data
  })
}
