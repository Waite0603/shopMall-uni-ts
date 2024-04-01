<template>
  <custom-navbar></custom-navbar>
  <XtxSwiper :list="bannerList"></XtxSwiper>
  <view class="content">
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app';

import { getHomeBanner } from '@/services/home'
import CustomNavbar from './components/CustomNavbar.vue'

import type { BannerItem } from '@/types/home'

const bannerList = ref<BannerItem[]>([])

const getHomeBannerData = async () => {
  const res = await getHomeBanner()
  bannerList.value = res.result
}
  
onLoad(() => {
  getHomeBannerData()
})
</script>

<style>

</style>
