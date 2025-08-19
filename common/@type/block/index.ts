import { TabResponse } from '$/@type/block/item';
import { Tab } from '$/@type/block/item';
import { 
    BannerPartition, 
    BannerPartitionResponse,
    BlockItemPaginator,
    GoodsGroup,
    GoodsGroupResponse,
    JointPurchasePartition,
    JointPurchasePartitionResponse,
    LiveCommercePartition,
    LiveCommercePartitionResponse,
    RafflePartition,
    RafflePartitionResponse
} from "$/@type/block/partition"

// 컨테이너
interface Container {
    id: number
    blocks: Block[]
}

interface ContainerResponse {
    id: number
    blocks: BlockResponse[]
}

// 블록
interface Block {
    id: number
    name: string
    title1?: string
    title2?: string
    link?: string
    linkLabel?: string
    existsMyFit?: boolean
    rankHasRange?: boolean
    designTitleClassName?: string
    tabs?: Tab[]
    bannerPartition?: BannerPartition | null
    goodsGroup?: GoodsGroup | null
    jointPurchasePartition?: JointPurchasePartition | null
    rafflePartition?: RafflePartition | null
    liveCommercePartition?: LiveCommercePartition | null
}

interface BlockResponse {
    id: number
    mui_code: string
    title_1?: string
    title_2?: string
    link?: string
    link_label?: string
    exist_my_fit?: boolean
    rank_has_range?: boolean
    design_title_class_name?: string
    tabs?: TabResponse[]
    banner_partition?: BannerPartitionResponse
    goods_group?: GoodsGroupResponse
    joint_purchase_partition?: JointPurchasePartitionResponse
    raffle_partition?: RafflePartitionResponse
    live_commerce_partition?: LiveCommercePartitionResponse
}

interface BlockContext {
    /**
     * 블록 CONTEXT 식별값 code
     * 블록 ID, 블록 CODE명, (탭의 하위 배너,상품그룹인경우) 탭ID, (배너의 하위상품그룹인 경우) 배너 ID로 구성
     * @example ${blockId}_${block_name}_${tabId||bannerId}?
     */
    code: string;   
    tabId?: number;         // 선택된 탭 ID
    goodsOrder?: number[]   // 상품그룹 상품 노출 순서
    sliderScrollPosition?: number   // 가로 스크롤 위치
    sliderIndex?: number    // 슬라이더 INDEX
    carouselIndex?: number  // 캐러셀 INDEX
    isShowMore?: boolean    // 더보기 영역 노출여부
    pageNumber?: number     // 선택된 페이지 번호
    // 페이지네이터 > 리스트
    paginatorList?: BlockItemPaginator['banners']
        | BlockItemPaginator['goodsList']
        | BlockItemPaginator['raffleList']
        | BlockItemPaginator['jointPurchaseList']
}

export {
    Container,
    ContainerResponse,
    Block,
    BlockResponse,
    BlockContext
}