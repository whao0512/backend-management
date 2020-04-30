import request from '@/utils/request'

/**
 * 查询所有类目
 * @param data
 */
export function getAllCategoryList(data) {
  return request({
    url: '/category/queryAll',
    method: 'post',
    data
  })
}

/**
 * 查询单个具体的类目
 * @param params
 */
export function getCategoryDetail(params) {
  return request({
    url: '/category/queryById',
    method: 'post',
    params
  })
}


/**
 * 新增类目
 * @param data
 */
export function categoryCreate(data) {
  return request({
    url: '/category/add',
    method: 'post',
    data
  })
}

/**
 * 修改分类
 * @param data
 */
export function categoryModify(data) {
  return request({
    url: '/category/modify',
    method: 'post',
    data
  })
}


/**
 * 分类上移和下移
 * @param params
 */
export function categorySort(params) {
  return request({
    url: '/category/modify',
    method: 'post',
    params
  })
}

/**
 * 根据父分类id查询同一层级分类数据
 * @param params
 */
export function categorySortById(params) {
  return request({
    url: '/category/querySameLevel',
    method: 'post',
    params
  })
}
