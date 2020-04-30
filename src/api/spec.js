import request from '@/utils/request'


/**
 * 新增规格
 * @param params
 */
export function specCreate(data) {
  return request({
    url: '/spec/add',
    method: 'post',
    data
  })
}

/**
 * 修改规格
 * @param data
 */
export function specModify(data) {
  return request({
    url: '/spec/modify',
    method: 'post',
    data
  })
}

/**
 * 查询规格
 * @param data
 */
export function getSpecList(data) {
  return request({
    url: '/spec/queryByPage',
    method: 'post',
    data
  })
}

/**
 * 查询单个规格
 * @param data
 */
export function getSpecDetail(data) {
  return request({
    url: '/spec/queryById',
    method: 'post',
    data
  })
}

/**
 * 新增规格组
 * @param data
 */
export function specGroupCreate(data) {
  return request({
    url: '/specGroup/add',
    method: 'post',
    data
  })
}

/**
 * 查询规格组
 * @param data
 */
export function getSpecGroupList(data) {
  return request({
    url: '/specGroup/queryAll',
    method: 'post',
    data
  })
}

/**
 * 查询单个规格组详情
 * @param data
 */
export function getSpecGroupDetail(data) {
  return request({
    url: '/specGroup/queryById',
    method: 'post',
    data
  })
}
