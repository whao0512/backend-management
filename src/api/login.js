import request from '@/utils/request'
import md5 from 'js-md5';

/**
 * 获取图形验证码Id
 * @param username
 * @param password
 */
export function getImgCheckCodeId() {
  return request({
    url: '/merchantUserManger/getImgCheckCodeId',
    method: 'post'
  })
}

/**
 * 获取图形验证码
 */
export function getImgCheckCode() {
  return request({
    url: '/merchantUserManger/generateImageCode',
    method: 'post'
  })
}

export function login(data) {
  const params = {
    userName: data.username,
    password: md5(data.password),
    // password,
    checkCode: data.checkCode,
    imgCheckCodeId : data.imgCheckCodeId
  }
  return request({
    url: '/merchantUserManger/login',
    method: 'post',
    params: params
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
