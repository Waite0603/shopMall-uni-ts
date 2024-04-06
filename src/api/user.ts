import { http } from '@/utils/http'

import type { LoginResult } from '@/types/user'

type LoginParams = {
  account: string,
  password: string
}

/**
 * 登录接口
 * @param data 登录参数
 */
export const postLoginAPI = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login',
    data
  })
}

/**
 * 小程序登录_内测版
 * @param phoneNumber 模拟手机号码
 */
export const postLoginSimpleAPI = (phoneNumber: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/login/wxMin/simple',
    data: {
      phoneNumber,
    },
  })
}