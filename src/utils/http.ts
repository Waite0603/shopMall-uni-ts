/**
 * 添加拦截器
 *    拦截 request 请求
 *    拦截 uploadFile 文件上传
 *
 * TODO:
 *    1. 非 http 开头需拼接地址
 *    2. 请求超时
 *    3. 添加小程序端请求头标识
 *    4. 添加 token 请求头标识
 */

import { useMemberStore } from '@/stores'

const baseUrl = 'https://pcapi-xiaotuxian-front.itheima.net'

// 添加拦截器
// https://uniapp.dcloud.net.cn/api/interceptor
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseUrl + options.url
    }

    // 请求超时, 默认是 60s(单位毫秒)
    options.timeout = 10000

    // 添加小程序端请求头标识
    options.header = {
      ...options.header,
      'source-client': 'miniapp'
    }

    // 添加 token 请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }

    return options
  }
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/**
 * 请求函数
 * @param options 请求参数
 * @returns Promise
 * 1. 返回 Promise 对象
 * 2. 请求成功
 *    2.1 提取核心数据 res.data
 *    2.2 类型泛型
 * 3. 请求失败
 *    3.1 网络错误
 *    3.2 401 鉴权错误
 *    3.3 其他错误
 */
interface resData<T> {
  code: string
  msg: string
  result: T
}

export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<resData<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        // 状态码 2xx
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as resData<T>)
        }
        // 状态码 401
        else if (res.statusCode === 401) {
          // 清空 token, 跳转登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.reLaunch({
            url: '/pages/login/login'
          })

          reject(res)
        }
        // 其他错误
        else {
          uni.showToast({
            icon: 'none',
            title: (res.data as resData<T>).msg || '请求失败'
          })

          reject(res)
        }
      },
      fail(err) {
        // 网络错误
        uni.showToast({
          icon: 'none',
          title: '网络错误, 换个网络试试吧'
        })
        reject(err)
      }
    })
  })
}
