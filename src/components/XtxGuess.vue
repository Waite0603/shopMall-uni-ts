<template>
  <!-- 猜你喜欢 -->
  <view class="caption">
    <text class="text">猜你喜欢</text>
  </view>
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="item in guessList"
      :key="item.id"
      :url="`/pages/goods/goods?id=${item.id}`"
    >
      <image class="image" mode="aspectFill" :src="item.picture"></image>
      <view class="name"> {{ item.name }} </view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ item.price }}</text>
      </view>
    </navigator>
  </view>
  <view class="loading-text"> {{ finishFlag ? '没有更多了' : '加载中...' }} </view>
</template>

<script setup lang="ts">
import { getHomeGoodsGuessLikeAPI } from '@/api/home'
import { onMounted } from 'vue'
import { ref } from 'vue'

import type { GuessItem } from '@/types/home'
import type { PageParams } from '@/types/global'

// 数据加载结束标记
const finishFlag = ref(false)
// 猜你喜欢列表
const guessList = ref<GuessItem[]>([])

// 分页参数, ? 可选参数转为必选参数
const pageParams: Required<PageParams> = {
  page: 1,
  pageSize: 10
}

// 重置页码
const resetPage = () => {
  pageParams.page = 1
  guessList.value = []
  finishFlag.value = false
}

const getHomeGoodsGuessLikeData = async () => {
  // 如果数据加载结束, 则不再请求数据
  if (finishFlag.value) return

  const res = await getHomeGoodsGuessLikeAPI(pageParams)
  guessList.value.push(...res.result.items)

  if (pageParams.page < res.result.pages) {
    // 添加页码
    pageParams.page++
  } else {
    finishFlag.value = true
  }
}

onMounted(() => {
  getHomeGoodsGuessLikeData()
})

// 暴露给父组件的方法
defineExpose({
  getMore: getHomeGoodsGuessLikeData,
  resetPage
})
</script>

<style lang="scss">
:host {
  display: block;
}
/* 分类标题 */
.caption {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  color: #262626;
  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 28rpx 0 30rpx;

    &::before,
    &::after {
      content: '';
      width: 20rpx;
      height: 20rpx;
      background-image: url(@/static/images/bubble.png);
      background-size: contain;
      margin: 0 10rpx;
    }
  }
}

/* 猜你喜欢 */
.guess {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;
  .guess-item {
    width: 300rpx;
    padding: 24rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }
  .image {
    width: 304rpx;
    height: 304rpx;
  }
  .name {
    height: 75rpx;
    margin: 10rpx 0;
    font-size: 26rpx;
    color: #262626;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .price {
    line-height: 1;
    padding-top: 4rpx;
    color: #cf4444;
    font-size: 26rpx;
  }
  .small {
    font-size: 80%;
  }
}
// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
@/api/home
