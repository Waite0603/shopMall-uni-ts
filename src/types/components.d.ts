import { ComponentCustomProperties } from 'vue'
import XtxSwiper from '@/components/XtxSwiper.vue'
import XtxGuess from '@/components/XtxGuess.vue'

import type { SkuPopup } from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup.d.ts'
import type { InputNumberBox } from '@/components/vk-data-input-number-box/vk-data-input-number-box'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    XtxSwiper: typeof XtxSwiper
    XtxGuess: typeof XtxGuess
    vkDataGoodsSkuPopup: SkuPopup,
    vkDataInputNumberBox: InputNumberBox
  }
}

// 组件实例类型
export type XtxGuessInstance = InstanceType<typeof XtxGuess>