import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // 请求超时时间
  headers: {
    'seller_domain': sessionStorage.getItem('seller_domain'),
    'hymall_token': sessionStorage.getItem('hymall_token')
  },
  withCredentials: true,
})

// request拦截器
service.interceptors.request.use(
  config => {
    let urlKey = 'domain';
    let url = window.location.hash
    let domain = ''
    let reg = new RegExp("(^|&)" + urlKey + "=([^&]*)(&|$)", "i");
    let urlFormat = url.substr(7)
    let r = urlFormat.substr(1).match(reg);
    if (r != null) domain = (r[2]);

    if (sessionStorage.getItem('seller_domain')) {
      config.headers['seller_domain'] = sessionStorage.getItem('seller_domain') // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (domain != '') {
      config.headers['seller_domain'] = domain
    }
    if (sessionStorage.getItem('hymall_token')) {
      config.headers['hymall_token'] = sessionStorage.getItem('hymall_token') // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  // response => response,
  response => {
    const res = response.data;
    if (res.returnCode != '000000') {
      Message({
        message: res.returnMsg,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      if (res.returnCode === '107018' ) {
        const host = window.location.host;
        let currentDomain = sessionStorage.getItem('seller_domain');
        MessageBox.confirm(
          '您当前还未登录，请先登录！',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          window.location.href = `http://${host}/?domain=${currentDomain}#/login`;
          sessionStorage.removeItem('baseInfo')
          // store.dispatch('FedLogOut').then(() => {
          //   location.reload() // 为了重新实例化vue-router对象 避免bug
          // })
          // location.reload()
        })
      }

      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
