import { http } from "@/utils/http"
import type { BannerItem } from "@/types/home"

/**
 * 首页banner
 * @param distributionSite  广告区域展示位置, 1 为首页（默认值） 2 为商品分类页
 * @returns 
 */
export const getHomeBanner = (distributionSite = 1) => {
  return http<BannerItem[]>({
    method: "GET",
    url: "/home/banner",
    data: {
      distributionSite
    }
  })
}