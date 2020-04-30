import request from '@/utils/request'

/**
 * 新增商家图文
 * imageType 图片类型：1-商家证书 2-商家服务 3-公司概况 4-合作伙伴 5-联系我们 6-常见问题 10-其他
 * @param data
 */
export function merchantImageCreate(data) {
  return request({
    url: '/merchantImage/add',
    method: 'post',
    data
  })
}

/**
 * 修改或删除商家图文
 * @param data
 */
export function merchantImageModify(data) {
  return request({
    url: '/merchantImage/modify',
    method: 'post',
    data
  })
}

/**
 * 新增或者修改商家图文
 * @param data
 */
export function merchantImageModifyOrAdd(data) {
  return request({
    url: '/merchantImage/addOrModify',
    method: 'post',
    data
  })
}

/**
 * 简单操作图文（可包含不同类型的类型）
 * @param data
 */
export function simpleOperate(data) {
  return request({
    url: '/merchantImage/simpleOperate',
    method: 'post',
    data
  })
}


/**
 * 商家基础信息复合接口
 * @param data
 */
export function modify4Image(data) {
  return request({
    url: '/merchant/modify4Image',
    method: 'post',
    data
  })
}



/**
 * 根据类型查询商家图文
 * @param data
 */
export function merchantImageType(data) {
  return request({
    url: '/merchantImage/queryByType',
    method: 'post',
    data
  })
}


/**
 * 商家获取系统操作员
 * @param params
 */
export function getSysOperatorList(params) {
  return request({
    url: '/merchantUserManger/queryAdminUserByPage',
    method: 'post',
    params
  })
}

/**
 * 商家获取系统操作员
 * @param params
 */
export function modifySysOperator(params) {
  return request({
    url: '/merchantUserManger/modifyMerchantAdmin',
    method: 'post',
    params
  })
}
/**
 * 注销商家系统操作员
 * @param params
 */
export function logOffSysOperator(params) {
  return request({
    url: '/merchantUserManger/cancelUser',
    method: 'post',
    params
  })
}


/**
 * 添加商家系统操作员
 * @param params
 */
export function sysOperatorCreate(params) {
  return request({
    url: '/merchantUserManger/addMerchantAdmin',
    method: 'post',
    params
  })
}


/**
 * 重置操作员密码
 * @param params
 */
export function resetSysOperatorPwd(params) {
  return request({
    url: '/merchantUserManger/resetPassword',
    method: 'post',
    params
  })
}

/**
 * 商家基本信息的修改
 * @param data
 */
export function merchantInfoModify(data) {
  return request({
    url: '/merchant/modify',
    method: 'post',
    data
  })
}


/**
 * 商家基本信息的修改
 * @param data
 */
export function merchantInfo(data) {
  return request({
    url: '/merchant/query',
    method: 'post',
    data
  })
}

