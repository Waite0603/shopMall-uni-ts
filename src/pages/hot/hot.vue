<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="bannerPicture" class="cover-image"></image>
    </view>
    <!-- 推荐选项 -->
    <view class="tabs">
      <text
        v-for="(subType, index) in subTypes"
        :key="index"
        class="text"
        :class="{ active: index === activeTab }"
        @tap="activeTab = index"
      >
        {{ subType.title }}
      </text>
    </view>
    <!-- 推荐列表 -->
    <scroll-view
      scroll-y
      class="scroll-view"
      :scroll-top="scrollTop"
      @scroll="scroll"
      @scrolltolower="onScrolltolower"
    >
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="goods in renderHotList"
          :key="goods.id"
          :url="`/pages/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="goods.picture"></image>
          <view class="name ellipsis">{{ goods.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text" v-if="!loadFinish">正在加载...</view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { getHotRecommendAPI } from '@/services/hot'
import { onReady, onLoad } from '@dcloudio/uni-app'
import { ref, watch, nextTick } from 'vue'

import type { SubTypeItem, HotResult } from '@/types/hot'
import type { GoodsItem } from '@/types/global'

// 热门推荐页 标题和url
const hotMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' }
]

// 定义热门推荐数据
const bannerPicture = ref<string>('')
const subTypes = ref<SubTypeItem[]>([])
const activeTab = ref(0)
const renderHotList = ref<GoodsItem[]>([])
const loadFinish = ref(false)
const scrollTop = ref(0)
const oldScrollTop = ref(0)

// uniapp 接收路由参数
const query = defineProps<{
  type: string
}>()
const currUrlMap = hotMap.find((item) => item.type === query.type)

// 首次获取热门推荐数据
const getHotRecommendData = async (url: string) => {
  const res = await getHotRecommendAPI(url)
  console.log(res)
  bannerPicture.value = res.result.bannerPicture
  subTypes.value = res.result.subTypes
  renderHotList.value.push(...res.result.subTypes[0].goodsItems.items)
}

// 滚动事件
const scroll = (e: any) => {
  // 滚动距离
  const { scrollTop } = e.detail
  oldScrollTop.value = scrollTop
}

// 滚动触底
const onScrolltolower = async () => {
  // 获取当前选项数据
  const currData = subTypes.value[activeTab.value]
  console.log(currData)

  // 判断是否加载完成
  if (loadFinish.value) {
    return
  }

  if (currData.goodsItems.page < currData.goodsItems.pages) {
    // 页码累加
    currData.goodsItems.page++
  }
  else {
    loadFinish.value = true
    return uni.showToast({
      title: '没有更多了',
      icon: 'none',
      duration: 2000
    })
  }


  // 请求数据
  const res = await getHotRecommendAPI(currUrlMap!.url, {
    subType: currData.id,
    page: currData.goodsItems.page,
    pageSize: currData.goodsItems.pageSize
  })

  // 数据合并
  const newSubType = res.result.subTypes[activeTab.value]
  renderHotList.value.push(...newSubType.goodsItems.items)
}

onLoad(() => {
  if (currUrlMap) {
    getHotRecommendData(currUrlMap.url)
  }
})

onReady(() => {
  // 设置 uni 页面标题
  if (currUrlMap) {
    uni.setNavigationBarTitle({
      title: currUrlMap.title
    })

    // 请求数据
  } else {
    // 提示, 返回上一页
    uni.showToast({
      title: '参数错误',
      icon: 'none',
      duration: 2000
    })

    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})

// 监听选项卡切换
watch(activeTab, (newVal) => {
  renderHotList.value = []
  loadFinish.value = false
  renderHotList.value = subTypes.value[newVal].goodsItems.items

  // 渲染完成后, 滚动到顶部
  scrollTop.value = oldScrollTop.value
  nextTick(() => {
    scrollTop.value = 0
  })
})
</script>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}
.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}
.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  .cover-image {
    width: 100%;
    height: 100%;
  }
}
.scroll-view {
  flex: 1;
  height: 0;
}
.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;
  .text {
    margin: 0 20rpx;
    position: relative;
  }
  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;
  .navigator {
    width: 300rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }
  .thumb {
    width: 305rpx;
    height: 305rpx;
  }
  .name {
    height: 88rpx;
    font-size: 26rpx;
  }
  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }
  .symbol {
    font-size: 70%;
  }
  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>
