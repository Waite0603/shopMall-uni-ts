<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar></CustomNavbar>

  <!-- 滚动容器 -->
  <scroll-view
    class="scroll-view"
    refresher-enabled
    scroll-y
    :refresher-triggered="isTriggered"
    @scrolltolower="onScrolltolower"
    @refresherrefresh="onRefresherrefresh"
  >
    <PageSkeleton v-if="isLoaded"></PageSkeleton>
    <template v-else>
      <XtxSwiper :list="bannerList"></XtxSwiper>
      <CategoryPanel :list="categoryList"></CategoryPanel>
      <HotPanel :list="hotList"></HotPanel>
      <XtxGuess ref="guessRef"></XtxGuess>
    </template>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'

import PageSkeleton from './components/PageSkeleton.vue'
import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'

import type { BannerItem, CategoryItem, HotItem } from '@/types/home'
import type { XtxGuessInstance } from '@/types/components'

const bannerList = ref<BannerItem[]>([])
const categoryList = ref<CategoryItem[]>([])
const hotList = ref<HotItem[]>([])

// 数据是否加载完成
const isLoaded = ref(false)

// 获取首页轮播图数据
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

// 获取首页分类数据
const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}

// 获取首页热门推荐数据
const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}

// 获取 xtxGuess 组件实例
const guessRef = ref<XtxGuessInstance>()
const onScrolltolower = () => {
  guessRef.value?.getMore()
}

// 下拉刷新函数
const isTriggered = ref(false)
const onRefresherrefresh = async () => {
  isTriggered.value = true
  // 同时请求三个接口
  guessRef.value?.resetPage()
  Promise.all([
    getHomeBannerData(),
    getHomeCategoryData(),
    getHomeHotData(),
    guessRef.value?.getMore()
  ])
  // 关闭下拉刷新
  setTimeout(() => {
    isTriggered.value = false
  }, 1000)
}

// 页面加载时获取数据
onLoad(async () => {
  isLoaded.value = true
  await Promise.all([getHomeBannerData(), getHomeCategoryData(), getHomeHotData()])
  isLoaded.value = false
})
</script>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
  // 设置height: 0; 阻止容器默认高度撑开
  height: 0;
}
</style>
