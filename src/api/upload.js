import request from '@/utils/request'

/**
 * 文件上传
 * @param params
 */
export function getBannerList(params) {
  return request({
    url: '/file/commonFileUpload',
    method: 'post',
    params
  })
}
