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

import { useMemberStore } from "@/stores"

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

    console.log('token', token)

    console.log('拦截前触发', options)
    return options
  }
}
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)


