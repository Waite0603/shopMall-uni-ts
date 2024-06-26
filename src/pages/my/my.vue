<template>
  <scroll-view class="viewport" scroll-y enable-back-to-top @scrolltolower="onScrolltolower">
    <!-- 个人资料 -->
    <view class="profile" :style="{ paddingTop: safeAreaInsets!.top + 'px' }">
      <!-- 情况1：已登录 -->
      <view class="overview" v-if="userStore.profile">
        <navigator url="/pagesUser/profile/profile" hover-class="none">
          <image class="avatar" mode="aspectFill" :src="userStore.profile.avatar"></image>
        </navigator>
        <view class="meta">
          <view class="nickname">
            {{ userStore.profile.nickname || userStore.profile.account }}
          </view>
          <navigator class="extra" url="/pagesUser/profile/profile" hover-class="none">
            <text class="update">更新头像昵称</text>
          </navigator>
        </view>
      </view>
      <!-- 情况2：未登录 -->
      <view class="overview" v-else>
        <navigator url="/pages/login/login" hover-class="none">
          <image
            class="avatar gray"
            mode="aspectFill"
            src="http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/picture/2021-04-06/db628d42-88a7-46e7-abb8-659448c33081.png"
          ></image>
        </navigator>
        <view class="meta">
          <navigator url="/pages/login/login" hover-class="none" class="nickname">
            未登录
            <view class="extra">
              <text class="tips" style="margin-top: 14rpx">点击登录账号</text>
            </view>
          </navigator>
        </view>
      </view>
      <navigator class="settings" url="/pagesUser/setting/setting" hover-class="none">
        设置
      </navigator>
    </view>
    <!-- 我的订单 -->
    <view class="orders">
      <view class="title">
        我的订单
        <navigator class="navigator" url="/pagesOrder/list/list?type=0" hover-class="none">
          查看全部订单 >
        </navigator>
      </view>
      <view class="section">
        <!-- 订单 -->
        <navigator url="/pagesOrder/refund/list/list?type=0" class="navigator" hover-class="none">
          <uni-icons type="shop" color="" size="30" />
          待付款
        </navigator>
        <navigator url="/pagesOrder/refund/list/list?type=1" class="navigator" hover-class="none">
          <uni-icons type="paperplane" color="" size="30" />
          待发货
        </navigator>
        <navigator url="/pagesOrder/refund/list/list?type=2" class="navigator" hover-class="none">
          <uni-icons type="shop-filled" color="" size="30" />
          待收货
        </navigator>
        <navigator url="/pagesOrder/refund/list/list?type=3" class="navigator" hover-class="none">
          <uni-icons type="hand-up" color="" size="30" />
          待评价
        </navigator>
        <navigator url="/pagesUser/contact/contact" class="navigator" hover-class="none">
          <uni-icons type="chat" color="" size="30" />
          联系客服
        </navigator>
      </view>
    </view>
    <!-- 猜你喜欢 -->
    <view class="guess">
      <XtxGuess ref="guessRef" />
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores'
import { getMemberProfileAPI } from '@/api/user'
import type { XtxGuessInstance } from '@/types/components'
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app';

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 获取会员信息
const userStore = useUserStore()

// 获取 xtxGuess 组件实例
const guessRef = ref<XtxGuessInstance>()
const onScrolltolower = () => {
  guessRef.value?.getMore()
}

// 验证登录状态
onShow(() => {
  // 获取会员信息
  getMemberProfileAPI()
})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f7f7f8;
}

.viewport {
  height: 100%;
  background-repeat: no-repeat;
  background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/center_bg.png);
  background-size: 100% auto;
}

/* 用户信息 */
.profile {
  margin-top: 20rpx;
  position: relative;

  .overview {
    display: flex;
    height: 120rpx;
    padding: 0 36rpx;
    color: #fff;
  }

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .gray {
    filter: grayscale(100%);
  }

  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    line-height: 30rpx;
    padding: 16rpx 0;
    margin-left: 20rpx;
  }

  .nickname {
    max-width: 350rpx;
    margin-bottom: 16rpx;
    font-size: 30rpx;
  }

  .extra {
    display: flex;
    font-size: 20rpx;
  }

  .tips {
    font-size: 22rpx;
  }

  .update {
    padding: 3rpx 10rpx 1rpx;
    color: rgba(255, 255, 255, 0.8);
    border: 1rpx solid rgba(255, 255, 255, 0.8);
    margin-right: 10rpx;
    border-radius: 30rpx;
  }

  .settings {
    position: absolute;
    bottom: 0;
    right: 40rpx;
    font-size: 30rpx;
    color: #fff;
  }
}

/* 我的订单 */
.orders {
  position: relative;
  z-index: 99;
  padding: 30rpx;
  margin: 50rpx 20rpx 0;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);

  .title {
    height: 40rpx;
    line-height: 40rpx;
    font-size: 28rpx;
    color: #1e1e1e;

    .navigator {
      font-size: 24rpx;
      color: #939393;
      float: right;
    }
  }

  .section {
    display: flex;
    justify-content: space-between;
    padding: 40rpx 20rpx 10rpx;
    .navigator,
    .contact {
      display: flex;
      flex-direction: column;
      text-align: center;
      font-size: 24rpx;
      color: #333;
      uni-icons {
        color: #ffa14d;
      }
    }
    .contact {
      padding: 0;
      margin: 0;
      border: 0;
      background-color: transparent;
      line-height: inherit;
    }
  }
}

/* 猜你喜欢 */
.guess {
  background-color: #f7f7f8;
  margin-top: 20rpx;
}
</style>
