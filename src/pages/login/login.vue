<template>
  <view class="viewport">
    <view class="logo">
      <image
        src="https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/logo_icon.png"
      ></image>
    </view>
    <view class="login">
      <!-- 网页端表单登录 -->
      <input
        class="input"
        v-model="loginFrom.account"
        type="text"
        placeholder="请输入用户名/手机号码"
      />
      <input
        class="input"
        v-model="loginFrom.password"
        type="text"
        password
        placeholder="请输入密码"
      />
      <button class="button phone" @click="onLogin">登录</button>

      <!-- 小程序端授权登录 -->
      <!-- <button class="button phone">
        <uni-icons type="phone-filled" class="icon" color="#fff" />
        手机号快捷登录
      </button> -->
      <view class="extra">
        <view class="caption">
          <text>其他登录方式</text>
        </view>
        <view class="options">
          <!-- 通用模拟登录 -->
          <button class="simulate-button" @click="onSimpleLogin">
            <uni-icons type="phone-filled" />
          </button>
          模拟快捷登录
        </view>
      </view>
      <view class="tips">登录/注册即视为你同意《服务条款》和《小兔鲜儿隐私协议》</view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import { postLoginAPI, postLoginSimpleAPI } from '@/api/user'
import { useUserStore } from '@/stores'

// 登录表单
const loginFrom = ref({
  account: '13123456789',
  password: '123456'
})

const userStore = useUserStore()

const onLogin = async () => {
  const res = await postLoginAPI(loginFrom.value)
  // 保存用户信息
  userStore.setProfile(res.result)

  uni.showToast({
    title: '登录成功',
    icon: 'success'
  })

  // 跳转到首页
  setTimeout(() => {
    uni.switchTab({
      url: '/pages/index/index'
    })
  }, 1500)
}

// 模拟手机号码登录
const onSimpleLogin = async () => {
  const res = await postLoginSimpleAPI(loginFrom.value.account)
  // 保存用户信息
  userStore.setProfile(res.result)

  uni.showToast({
    title: '登录成功',
    icon: 'success'
  })

  // 延迟跳转到首页
  await new Promise(resolve => setTimeout(resolve, 1500))

  uni.switchTab({
    url: '/pages/index/index'
  })
}
</script>

<style lang="scss">
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 40rpx;
}

.logo {
  flex: 1;
  text-align: center;
  image {
    width: 220rpx;
    height: 220rpx;
    margin-top: 15vh;
  }
}

.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
  padding: 40rpx 20rpx 20rpx;

  .input {
    width: 90%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    border: 1px solid #ddd;
    padding: 0 30rpx;
    margin-bottom: 20rpx;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    color: #fff;
  }

  .icon {
    font-size: 32rpx;
    margin-right: 10rpx;
  }

  .phone {
    background-color: #28bb9c;
  }

  .wechat {
    background-color: #06c05f;
  }

  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;
    .caption {
      width: 440rpx;
      line-height: 1;
      border-top: 1rpx solid #ddd;
      font-size: 26rpx;
      color: #999;
      position: relative;
      text {
        transform: translate(-40%);
        background-color: #fff;
        position: absolute;
        top: -12rpx;
        left: 50%;
      }
    }

    .options {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 70rpx;
      font-size: 26rpx;
      color: #444;
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20rpx;
        border: 1rpx solid #ddd;
        border-radius: 50%;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 14rpx;
      }
    }

    .icon {
      font-size: 24rpx;
      color: #444;
      display: flex;
      flex-direction: column;
      align-items: center;
      border-radius: 50%;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444;
        border-radius: 50%;
      }
    }
    .icon-weixin::before {
      border-color: #06c05f;
      color: #06c05f;
    }
  }
}

.tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
}
</style>
