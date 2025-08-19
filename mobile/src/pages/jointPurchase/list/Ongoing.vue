<template>
    <ul v-if="isLoading" class="m_coopbuy-list T=skeleton">
        <li v-for="item, index in 6" :key="index">
            <i class="image_product" />
            <p class="text_brand" />
            <p class="text_product" />
            <p class="text_price" />
        </li>
    </ul>

    <template v-else>
        <p v-if="totalCount === 0 && !isLoading" class="mm_text-none">
            <i class="ico_text-none" />진행중인 공동구매가 없습니다
        </p>
        <VirtualScroller
            v-else
            :class="['m_coopbuy-list']"
            :items="jointPurchases"
            :items-per-page="perPage"
            :is-page-ready="isPageReady"
            :height-px-per-item="heightPxPerItem"
            :init-page="initPage"
            :total-count="totalCount"
            :is-loading="isLoading"
            @page-required="loadPage"
            @page-on-view-changed="setPageOnView"
        >
            <template #item="{ item }">
                <!-- 진행 중 -->
                <li
                    :class="[item.targetAchieveRate >= 100 ? 'S=coopbuy-complete' : '']"
                >
                    <MMLink
                        :id="`detail_${item.id}`"
                        :to="
                            item.isOnlyAdult && needCertificateAge
                                ? { name: pathCertificate, query: { redirect_to_after: `/joint-purchase/detail/${item.id}`, is_need_adult_certification: 'Y' } }
                                : { name: 'JointPurchaseDetail', params: { id: item.id } }
                        "
                    >
                        <figure>
                            <i v-lazyload="{ src: item.thumbnailUrl }" class="mm_bg-cover image_product" />
                            <p v-if="item.isOnlyAdult && needCertificateAge" class="text_adult">
                                <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
                            </p>
                            <figcaption>
                                <div class="m_coopbuy-on-progress">
                                    <Timer :joint-purchase="item" />
                                    <p class="text_goal">
                                        목표까지
                                        <b>
                                            <strong>{{ MMFilters.formatNumber(item.participantCount) }}<sub>명</sub></strong><span>/</span>
                                            {{ MMFilters.formatNumber(item.targetCount) }}명
                                        </b>
                                    </p>
                                    <b class="m...progress-bar">
                                        <i
                                            :style="`width:${ item.targetAchieveRate }%;`"
                                            :title="`${ item.targetAchieveRate }%`"
                                        />
                                    </b>
                                </div>
                                <p class="text_brand">
                                    {{ item.brandName }}
                                </p>
                                <p class="text_product">
                                    {{ item.goodsName }}
                                </p>
                                <p class="text_price">
                                    <del><span>{{ MMFilters.formatNumber(item.price) }}</span></del>
                                    공동구매가<strong>{{ MMFilters.formatNumber(item.jointPurchasePrice) }}</strong>
                                </p>
                            </figcaption>
                        </figure>
                    </MMLink>
                    <div class="mm_btn_box">
                        <div class="mm_flex T=equal">
                            <!-- 공유하기 -->
                            <button
                                type="button"
                                class="mm_btn T=line T=dark btn_sns-share"
                                @click="(event) => {
                                    snsShare(event, item);
                                }"
                            >
                                <i class="ico_share" />
                                <b>친구에게 공유하기</b>
                            </button>
                            <!--// 공유하기 -->
                            <MMLink
                                :button="true" 
                                class="mm_btn btn_coopbuy-entry"
                                :to="{ name: 'JointPurchaseDetail', params: { id: item.id } }"
                            >
                                <b>공동구매 참여하기</b>
                            </MMLink>
                        </div>
                    </div>
                </li>
                <!-- // 진행 중 -->
            </template>
        </VirtualScroller>
    </template>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, watch, nextTick } from 'vue';
import { jointPurchaseRepository } from '$/repository/jointPurchaseRepository';
import { typeCastNumber } from '$/filters';
import VirtualScroller from '@/components/VirtualScrollerAddShow.vue';
import { defaultCatch } from '$/functions';
import { makePath } from '$/services/http';
import MMLink from '@/components/MMLink.vue';
import Timer from '@/pages/jointPurchase/Timer.vue';
import { JointPurchase } from '$/@type/jointPurchase';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const emit = defineEmits(['snsShare']);
const { 
    router,
    route,
    isUser,
    needCertificateAge,
} = usePageContext();
const pathCertificate = isUser.value ? 'AdultCertification' : 'Login'

const perPage = ref(6);

const heightPxPerItem = ref(800);        
const isLoading = ref<boolean>(true);                       // 로딩 중인지 체크
const totalCount = ref<number>(0);
const itemsByPage = ref<Array<(JointPurchase|null)[]>>([])

//평탄화된 공동구매 배열
const jointPurchases = computed(() => {
    return itemsByPage.value.flatMap((itemsInPage) => {
        return itemsInPage
    })
})

const isPageReady = ref(false)
const initPage = ref(typeCastNumber(route.query.page, 1))
const loadingPages = ref<number[]>([]) 

/** FUNCTION */
/**
 * 페이지에 해당하는 공동구매 목록 조회
 */
async function loadPage(page: number|number[]) {
    const pages = Array.isArray(page) ? page.concat([]) : [page]
    const pagesNeedLoad = pages.filter(page => {
        if (
            loadingPages.value.some(lp => lp === page)
        || (itemsByPage.value[page] && itemsByPage.value[page].some(item => item === null) === false)
        ) {
            return false;
        }

        return true;
    })

    if (pagesNeedLoad.length < 1) {
        return;
    }

    isLoading.value = true;
    loadingPages.value = loadingPages.value.concat(pagesNeedLoad)

    try {
        await Promise.all(pagesNeedLoad.map(async page => {
            const paginator = await jointPurchaseRepository.getJointPurchases(
                page, 
                perPage.value
            )

            itemsByPage.value[page] = paginator.data
            totalCount.value = paginator.total
        } ))
    } catch (e) {
        defaultCatch(e)
    } finally {
        isLoading.value = false
        loadingPages.value = loadingPages.value.filter(lp => !pagesNeedLoad.some(needLoadPage => needLoadPage === lp))
    }
}

/**
 * page on view 를 갱신 (단순 쿼리스트링 처리용)
 */
function setPageOnView(currentPage: number) {
    router.replace(makePath(route.path, {
        page: currentPage,
    }));
}

// 공유하기 버튼 클릭 시
function snsShare(event: MouseEvent, jointPurchase: JointPurchase) {
    emit('snsShare', event, jointPurchase);
}
/** // FUNCTION */

/** VUE LIFE CYCLE */
onBeforeMount(async () => {
    if (initPage.value > 1) {
        for (let page = 1; page <= initPage.value; page++) {
            itemsByPage.value[page] = []
            for (let itemIndex = 0; itemIndex < perPage.value; itemIndex++) {
                itemsByPage.value[page][itemIndex] = null
            }
        }
    }
    await loadPage([
        typeCastNumber(route.query.page, 1) - 1,
        typeCastNumber(route.query.page, 1)
    ].filter(p => p > 0))

    isPageReady.value = true;
})

watch(jointPurchases, async (to) => {
    if (to.length > 0) {
        await nextTick()
        const el = document.querySelector('.m_coopbuy-list > li:not([data-skeleton]):nth-child(2)') as HTMLElement
        if (el) {
            heightPxPerItem.value = el.offsetHeight + 55
        }
    }
})
/** // VUE LIFE CYCLE */
</script>