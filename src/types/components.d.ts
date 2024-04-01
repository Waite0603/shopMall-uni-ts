import { ComponentCustomProperties } from 'vue'
import XtxSwiper from '@/components/XtxSwiper.vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    XtxSwiper: typeof XtxSwiper
  }
}