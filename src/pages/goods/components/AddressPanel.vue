<template>

  <view class="address-panel">
    <!-- 关闭按钮 -->
    <uni-icons type="close" class="close" @tap="emit('close')" />
    <!-- 标题 -->
    <view class="title">配送至</view>
    <!-- 内容 -->
    <view class="content">
      <radio-group @change="radioChange">
        <view class="item" v-for="(item, index) in addressList" :key="item.id">
          <view class="user">{{ item.receiver + ' ' + item.contact }}</view>
          <view class="address">{{ item.fullLocation.replace(/\s/g, '') + item.address }}</view>
          <radio
            :value="item.id"
            class="icon"
            :checked="checkedAddress?.id === item.id"
            color="#27ba9b"
          />
        </view>
      </radio-group>
    </view>
    <view class="footer">
      <view class="button primary"> 新建地址 </view>
      <view v-if="false" class="button primary">确定</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { getMemberAddressAPI } from '@/api/address'
import type { AddressItem } from '@/types/address'
import { onMounted } from 'vue'
import { ref } from 'vue'

// 子调父
const emit = defineEmits<{
  (event: 'close'): () => void
  (event: 'update', address: AddressItem): void
}>()

const addressList = ref<AddressItem[]>()
const checkedAddress = ref<AddressItem>()

const getAddressList = async () => {
  const res = await getMemberAddressAPI()
  addressList.value = res.result
}

const radioChange: UniHelper.RadioGroupOnChange = (e) => {
  checkedAddress.value = addressList.value?.find((item) => item.id === e.detail.value)

  if (checkedAddress.value) {
    emit('update', checkedAddress.value)
  }
}

onMounted(() => {
  uni.showLoading({ title: '加载中' })
  getAddressList()
  setTimeout(() => {
    uni.hideLoading()
  }, 500)
})
</script>

<style lang="scss">
.address-panel {
  padding: 0 30rpx;
  border-radius: 10rpx 10rpx 0 0;
  position: relative;
  background-color: #fff;
}

.title {
  line-height: 1;
  padding: 40rpx 0;
  text-align: center;
  font-size: 32rpx;
  font-weight: normal;
  border-bottom: 1rpx solid #ddd;
  color: #444;
}

.close {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
}

.content {
  min-height: 300rpx;
  max-height: 540rpx;
  overflow: auto;
  padding: 20rpx;
  .item {
    padding: 30rpx 50rpx 30rpx 60rpx;
    background-size: 40rpx;
    background-repeat: no-repeat;
    background-position: 0 center;
    background-image: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png);
    position: relative;
  }
  .icon {
    color: #27ba9b;
    position: absolute;
    top: 40%;
    right: 0;
    transform: scale(0.7);
  }
  .icon-checked {
    color: #27ba9b;
  }
  .icon-ring {
    color: #444;
  }
  .user {
    font-size: 28rpx;
    color: #444;
    font-weight: 500;
  }
  .address {
    font-size: 26rpx;
    color: #666;
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0 40rpx;
  font-size: 28rpx;
  color: #444;

  .button {
    flex: 1;
    height: 72rpx;
    text-align: center;
    line-height: 72rpx;
    margin: 0 20rpx;
    color: #fff;
    border-radius: 72rpx;
  }

  .primary {
    color: #fff;
    background-color: #27ba9b;
  }

  .secondary {
    background-color: #ffa868;
  }
}
</style>
