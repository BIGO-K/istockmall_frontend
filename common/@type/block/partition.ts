import { Banner, BannerResponse } from "$/@type/block/item"
import { Goods, ResponseGoods } from "$/@type/goods"
import { JointPurchase, JointPurchaseResponse } from "$/@type/jointPurchase"
import { Raffle, RaffleResponse } from "$/@type/raffle"
import { RankingGoods, RankingGoodsResponse } from "$/@type/ranking"

interface BlockItemPaginator {
    currentPage?: number
    total?: number
    perPage?: number        // 페이징 이외에 refresh등에서도 사용됨
    pagingUrl?: string

    // 블록 아이템 리스트
    goodsList?: (Goods & {
        rank?: RankingGoods['rank'];
        rankChangeType?: RankingGoods['changeType'];
        rankChangeValue?: RankingGoods['changeValue'];
    })[]
    banners?: Banner[]
    jointPurchaseList?: {
        id: number;                 // 공동 구매 ID
        jointPurchasePrice: number; // 공동구매가
        participantCount: number;   // 참여 인원
        targetCount: number;        // 목표 인원
        isTargetAchieve: boolean;   // 목표 달성 여부
        targetAt: string;           // 목표 일시
        targetAchieveRate: number;  // 목표 달성률
        goods: Goods & {
            brandId: number;                 // 진열브랜드 ID,
            brandLogoImageUrl: string;       // 브랜드 로고 이미지
        }
    }[]
    raffleList?: Raffle[]
}

interface BlockItemPaginatorResponse {
    current_page?: number
    total?: number
    per_page?: number
    paging_url: string
}

// 배너 파티션
interface BannerPartition extends BlockItemPaginator {
    banners: NonNullable<BlockItemPaginator['banners']>
}

interface BannerPartitionResponse extends BlockItemPaginatorResponse {
    banners: BannerResponse[]
}

// 상품 파티션
interface GoodsGroup extends BlockItemPaginator {
    goodsList: NonNullable<BlockItemPaginator['goodsList']>
    text1?: string
    text2?: string
    text3?: string
    link?: string           // 전체보기 링크
}

interface GoodsGroupResponse extends BlockItemPaginatorResponse {
    goods_list: (ResponseGoods & {
        rank?: RankingGoodsResponse['rank'];
        rank_change_type?: RankingGoodsResponse['change_type'];
        rank_change_value?: RankingGoodsResponse['change_value'];
    })[]
    text_1?: string
    text_2?: string
    text_3?: string
    link?: string
}

// 공동구매 파티션
interface JointPurchasePartition extends BlockItemPaginator {
    jointPurchaseList: NonNullable<BlockItemPaginator['jointPurchaseList']>
}
interface JointPurchasePartitionResponse extends BlockItemPaginatorResponse {
    joint_purchase_list: {
        id: number;                     // 공동 구매 ID
        is_only_adult: boolean;         // 성인전용상품 여부
        joint_purchase_price: number;   // 공동구매가
        participant_count: number;      // 참여 인원
        target_count: number;           // 목표 인원
        is_target_achieve: boolean;     // 목표 달성 여부
        target_at: string;              // 목표 일시
        target_achieve_rate: number;    // 목표 달성률
        goods: ResponseGoods & {
            brand_id: number;
            brand_logo_image_url: string;       // 브랜드 로고 이미지
        }
    }[]
}

// 래플 파티션
interface RafflePartition extends BlockItemPaginator {
    raffleList: NonNullable<BlockItemPaginator['raffleList']>
}
interface RafflePartitionResponse extends BlockItemPaginatorResponse {
    raffle_list: RaffleResponse[]
}

// 라이브 커머스 파티션
interface LiveCommercePartition {
    liveCommerceList?: {
        isOnAir: boolean;
        mainThumbnail: string;
        thumbnails?: {
            url: string;
            isRepresentative: boolean;
        }[]
        broadcastThumbnails?: {
            url: string;
            isRepresentative: boolean;
        }[]
        broadcastId: string;
        broadcastTypeCode: string;
        broadcastName: string;
        programmingStartAt: string;
        broadcastStartAt: string;
        previewUrl: string;
    }[]
}

interface LiveCommercePartitionResponse {
    live_commerce_list: {
        is_on_air: boolean;
        main_thumbnail: string;
        thumbnails?: {
            url: string;
            is_representative: boolean;
        }[]
        broadcast_thumbnails?: {
            url: string;
            is_representative: boolean;
        }[]
        broadcast_id: string;
        broadcast_type_code: string;
        broadcast_name: string;
        programming_start_at: string;
        broadcast_start_at: string;
        preview_url: string;
    }[]
} 

export {
    BlockItemPaginator,
    BannerPartition,
    BannerPartitionResponse,
    GoodsGroup,
    GoodsGroupResponse,
    JointPurchasePartition,
    JointPurchasePartitionResponse,
    RafflePartition,
    RafflePartitionResponse,
    LiveCommercePartition,
    LiveCommercePartitionResponse
}