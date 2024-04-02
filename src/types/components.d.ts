import { ComponentCustomProperties } from 'vue'
import XtxSwiper from '@/components/XtxSwiper.vue'
import XtxGuess from '@/components/XtxGuess.vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    XtxSwiper: typeof XtxSwiper,
    XtxGuess: typeof XtxGuess
  }
}