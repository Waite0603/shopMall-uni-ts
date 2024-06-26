<template>
  <page-skeleton v-if="showSkeleton"></page-skeleton>

  <view class="viewport" v-else>
    <!-- 搜索框 -->
    <view class="search">
      <view class="input">
        <view>
          <uni-icons type="search" />
          adfadf
        </view>
      </view>
    </view>
    <!-- 分类 -->
    <view class="categories">
      <!-- 左侧：一级分类 -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in categoryTopList"
          :key="index"
          class="item"
          :class="{ active: activeIndex === index }"
          @click="changeTab(index)"
        >
          <text class="name"> {{ item.name }} </text>
        </view>
      </scroll-view>
      <!-- 右侧：二级分类 -->
      <scroll-view class="secondary" scroll-y :scroll-top="scrollTop" @scroll="scroll">
        <!-- 焦点图 -->
        <XtxSwiper class="banner" :list="bannerList" />
        <!-- 内容区域 -->
        <view class="panel" v-for="item in secondaryData" :key="item.id">
          <view class="title">
            <text class="name">{{ item.name }}</text>
            <navigator class="more" hover-class="none">全部</navigator>
          </view>
          <view class="section">
            <navigator
              v-for="goods in item.goods"
              :key="goods.id"
              class="goods"
              hover-class="none"
              :url="`/pages/goods/goods?id=${goods.id}`"
            >
              <image class="image" :src="goods.picture"></image>
              <view class="name ellipsis">{{ goods.name }}</view>
              <view class="price">
                <text class="symbol">¥</text>
                <text class="number">{{ goods.price }}</text>
              </view>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'

import PageSkeleton from './components/PageSkeleton.vue'

import { getHomeBannerAPI } from '@/api/home'
import { getCategoryTopAPI } from '@/api/category'
import type { BannerItem } from '@/types/home'
import type { CategoryTopItem } from '@/types/category'
import { nextTick } from 'vue'
const bannerList = ref<BannerItem[]>([])
const categoryTopList = ref<CategoryTopItem[]>([])
const showSkeleton = ref(true)
const activeIndex = ref(0)

// 获取首页轮播图数据
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}

// 获取分类数据
const getCategoryTopData = async () => {
  const res = await getCategoryTopAPI()
  categoryTopList.value = res.result
}

// 提取二级分类数据
const secondaryData = ref<any>([])
const getSecondaryData = () => {
  console.log('categoryTopList', categoryTopList.value)
  if (categoryTopList.value.length) {
    secondaryData.value = categoryTopList.value[activeIndex.value].children
  } else {
    secondaryData.value = []
  }
  console.log('secondaryData', secondaryData.value)
}

// scroll-view 回到顶部
const scrollTop = ref(0)
const oldScrollTop = ref(0)

// 滚动事件
const scroll: UniHelper.ScrollViewOnScroll = (e) => {
  // 滚动距离
  const { scrollTop } = e.detail
  oldScrollTop.value = scrollTop
}

// 切换 tab
const changeTab = (index: number) => {
  activeIndex.value = index
  getSecondaryData()

  // 渲染完成后, 滚动到顶部
  scrollTop.value = oldScrollTop.value
  nextTick(() => {
    scrollTop.value = 0
  })
}

onLoad(() => {
  Promise.all([getHomeBannerData(), getCategoryTopData()]).then(() => {
    getSecondaryData()
    showSkeleton.value = false
  })
})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}
.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.search {
  margin-top: 20rpx;
  padding: 0 30rpx 20rpx;
  background-color: #fff;
  .input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64rpx;
    padding-left: 26rpx;
    color: #8b8b8b;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: #f3f4f4;
  }
}
/* 分类 */
.categories {
  flex: 1;
  min-height: 400rpx;
  display: flex;
}
/* 一级分类 */
.primary {
  overflow: hidden;
  width: 180rpx;
  flex: none;
  background-color: #f6f6f6;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96rpx;
    font-size: 26rpx;
    color: #595c63;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 42rpx;
      bottom: 0;
      width: 96rpx;
      border-top: 1rpx solid #e3e4e7;
    }
  }
  .active {
    background-color: #fff;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 8rpx;
      height: 100%;
      background-color: #27ba9b;
    }
  }
}
.primary .item:last-child::after,
.primary .active::after {
  display: none;
}
/* 二级分类 */
.secondary {
  background-color: #fff;
  .carousel {
    height: 200rpx;
    margin: 0 30rpx 20rpx;
    border-radius: 4rpx;
    overflow: hidden;
  }
  .panel {
    margin: 0 30rpx 0rpx;
  }
  .title {
    height: 60rpx;
    line-height: 60rpx;
    color: #333;
    font-size: 28rpx;
    border-bottom: 1rpx solid #f7f7f8;
    .more {
      float: right;
      padding-left: 20rpx;
      font-size: 24rpx;
      color: #999;
    }
  }
  .more {
    &::after {
      content: '>';
    }
  }
  .section {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx 0;
    .goods {
      width: 150rpx;
      margin: 0rpx 30rpx 20rpx 0;
      &:nth-child(3n) {
        margin-right: 0;
      }
      image {
        width: 150rpx;
        height: 150rpx;
      }
      .name {
        padding: 5rpx;
        font-size: 22rpx;
        color: #333;
      }
      .ellipsis {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .price {
        padding: 5rpx;
        font-size: 18rpx;
        color: #cf4444;
      }
      .number {
        font-size: 24rpx;
        margin-left: 2rpx;
      }
    }
  }
}
</style>
@/api/home
