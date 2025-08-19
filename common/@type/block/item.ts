import {
  BannerPartition,
  BannerPartitionResponse,
  GoodsGroup,
  GoodsGroupResponse,
} from "$/@type/block/partition";

// 탭
interface Tab {
  id: number;
  title: string;
  bannerPartition?: BannerPartition;
  goodsGroup?: GoodsGroup;
}

interface TabResponse {
  id: number;
  title: string;
  banner_partition: BannerPartitionResponse;
  goods_group: GoodsGroupResponse;
}

// 배너
interface Banner {
  id: number;
  imageUrl: string;
  alt: string;
  goodsGroup?: GoodsGroup;
  link?: string; // 더보기 url
  isUseText?: boolean;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  displayStartAt?: string;
  displayEndAt?: string;
  createdAt?: string;
  colorCode?: "#FFFFFF" | "#000000"; // 추후 white/black 외 다른 컬러도 대응가능하도록 hex코드로 설정
}

interface BannerResponse {
  id: number;
  image_url: string;
  alt: string;
  goods_group?: GoodsGroupResponse;
  link?: string;
  brand_name?: string;
  is_use_text?: boolean;
  text_1?: string;
  text_2?: string;
  text_3?: string;
  text_4?: string;
  display_start_at?: string;
  display_end_at?: string;
  created_at?: string;
  text_color?: "#FFFFFF" | "#000000";
}

export { Tab, TabResponse, Banner, BannerResponse };
