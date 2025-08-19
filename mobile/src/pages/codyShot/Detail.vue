<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>코디샷</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div v-if="codyShot !== null" class="mm_page-content">
                        <div class="mm_inner m_codyshot-detail">
                            <figure>
                                <div class="m_codyshot-detail-banner">
                                    <img v-lazyload="{ src: codyShot.thumbnailUrl }" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" :alt="codyShot.alt">
                                    <button
                                        v-for="(pointer, index) in codyShot.pointers"
                                        :key="index"
                                        :style="{ top: `${pointer.y}%`, left: `${pointer.x}%` }"
                                        type="button"
                                        class="btn_product-pointer"
                                        @click="() => {
                                            selectedPointerGoodsIndex = index;
                                            scrollToPointer(index);
                                        }"
                                    >
                                        <b class="mm_ir-blind">{{ pointer.goods.name }}</b>
                                    </button>
                                </div>
                                <figcaption>
                                    <p class="text_brand">
                                        {{ codyShot.brandName }}
                                    </p>
                                    <p class="text_main">
                                        {{ codyShot.title }}
                                    </p>
                                    <p class="text_sub">
                                        {{ codyShot.subTitle }}
                                    </p>
                                    <p class="text_date">
                                        {{ MMFilters.formatDate(codyShot.createdAt, 'YYYY-MM-DD') }}
                                    </p>
                                    <button type="button" class="btn_sns-share" @click="(event) => { showSnsShared(event) }">
                                        <i class="ico_share" /><b class="mm_ir-blind">공유하기</b>
                                    </button>
                                </figcaption>
                            </figure>
                            <div class="mm_product-list T=card">
                                <ul>
                                    <li
                                        v-for="(pointer, index) in codyShot.pointers"
                                        :key="index"
                                        :ref="setPointerTarget"
                                        :class="{ 'S=pointer-on': index === selectedPointerGoodsIndex }"
                                    >
                                        <MmGoods 
                                            :goods="pointer.goods" 
                                            :use-react-tag="true" 
                                            :use-liked-button="true"
                                        />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->

                    <!--// 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
            
            <SharedDim v-if="isShowSharedSns" @close="isShowSharedSns = false" />            
        </template>
    </MMSub>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { codyShotRepository } from '$/repository/codyShotRepository';
import { CodyShot } from '$/@type/codyShot';
import { mmon } from '$/helper/mmon';
import MMSub from "@/components/layout/Sub.vue";
import MMFooter from "@/components/Footer.vue";
import { useSnsShared } from '$/composables/shoppingComposable';
import SharedDim from '@/components/SharedDim.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const { route } = usePageContext();
const { shareDimOpen } = useSnsShared();

/** VARIABLE */
// 코디샷 전체 정보
const codyShot = ref<CodyShot|null>(null);
// 코디샷에 등록된 상품id 목록
const goodsIds = ref<number[]>([]);
// 포인터 클릭시 선택한 상품 id
const selectedPointerGoodsIndex = ref<number>(0);
// 코디샷 포인터에 등록된 상품 Element 목록
const pointerList = ref<Element[]>([]);
// sns 공유 영역 노출 여부
const isShowSharedSns= ref<boolean>(false);
/** // VARIABLE */
/** FUNCTION */
function setPointerTarget(element: Element) {
    pointerList.value.push(element);
    return pointerList
}
/**
 * 사진의 포인터 클릭시 해당 상품으로 스크롤
 *
 * @param index: number
 */
function scrollToPointer(index: number) {
    const target = pointerList.value[index];
    mmon.scroll.to(target, {
        margin: 100,
        direction: 'vertical',
        time: 0.2
    });
}

/**
 * 공유버튼 클릭시 SNS 공유영역 노출
 *
 * @param event: Event
 */
function showSnsShared(event: MouseEvent) {
    if (!codyShot.value) {
        return
    }

    shareDimOpen(
        event, 
        codyShot.value.title, 
        [
            `코디샷`,
            `${codyShot.value.title}`,
            `${codyShot.value.subTitle}`
        ].filter(v => v)
            .map(v => `#${v}`)
            .join(' '),
        codyShot.value.thumbnailUrl
    );
    isShowSharedSns.value = true;
}
/** // FUNCTION */
/** VUE LIFE CYCLE */
onMounted(async() => {
    try {
        // 코디샷 상세정보 조회
        codyShot.value = await codyShotRepository.getCodyShot(Number(route.params.id));
        // 코디샷에 등록된 포인터의 상품 id 목록 가공
        goodsIds.value = codyShot.value.pointers.map(pointer => {
            return pointer.goods.id;
        });
        // 상품의 좋아요 여부
        await shoppingRepository.getRelationLikedGoods(goodsIds.value, true);
        usePageTitleSetting(codyShot.value.title);
    } catch (e) {
        console.log(e)
    }
});
/** // VUE LIFE CYCLE */
</script>