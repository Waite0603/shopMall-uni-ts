<template>
  <!-- 自定义导航栏 -->
  <CustomNavbar></CustomNavbar>

  <!-- 滚动容器 -->
  <scroll-view @scrolltolower="onScrolltolower" class="scroll-view" scroll-y>
    <XtxSwiper :list="bannerList"></XtxSwiper>
    <CategoryPanel :list="categoryList"></CategoryPanel>
    <HotPanel :list="hotList"></HotPanel>
    <XtxGuess></XtxGuess>
  </scroll-view>
  
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app';

import { getHomeBannerAPI, getHomeCategoryAPI, getHomeHotAPI } from '@/services/home'

import CustomNavbar from './components/CustomNavbar.vue'
import CategoryPanel from './components/CategoryPanel.vue'
import HotPanel from './components/HotPanel.vue'

import type { BannerItem, CategoryItem, HotItem } from '@/types/home'

const bannerList = ref<BannerItem[]>([])
const categoryList = ref<CategoryItem[]>([])
const hotList = ref<HotItem[]>([])

const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

const getHomeCategoryData = async () => {
  const res = await getHomeCategoryAPI()
  categoryList.value = res.result
}

const getHomeHotData = async () => {
  const res = await getHomeHotAPI()
  hotList.value = res.result
}

const onScrolltolower = () => {
  console.log('触底了')
}
  
onLoad(() => {
  getHomeBannerData()
  getHomeCategoryData()
  getHomeHotData()
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

