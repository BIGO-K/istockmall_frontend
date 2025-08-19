<template>
    <div class="mm_page-content">
        <div class="mm_inner">
            <div class="m_raffle">
                <h3 class="mm_title">
                    <b>래플</b><a
                        class="btn_guide"
                        href="javascript:;"
                        @click.prevent="guideModalOpen()"
                    ><b class="mm_ir-blind">래플 안내</b><i class="ico_help-guide" /></a>
                </h3>
                <div
                    v-if="!isCompleteLoading"
                    class="mm_product-list T=skeleton m_raffle-list"
                >
                    <ul>
                        <li v-for="index in 7" :key="index">
                            <div class="mm_product-item">
                                <i class="image_product" />
                                <div class="mm_product-item-info">
                                    <p class="text_brand" />
                                    <p class="text_product" />
                                    <p class="text_price" />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <template v-else-if="isCompleteLoading && raffleList.length > 0">
                    <!-- 래플 상품리스트 -->
                    <div class="mm_product-list m_raffle-list">
                        <ul>
                            <li
                                v-for="raffle in raffleList"
                                :key="raffle.id"
                            >
                                <RaffleItem
                                    :raffle="raffle"
                                    @refetch="getRaffleList()"
                                />
                            </li>
                        </ul>
                    </div>
                    <!--// 래플 상품리스트 -->

                    <!--종료된 래플 전체보기 -->
                    <div class="mm_foot">
                        <div class="mm_btn_box">
                            <MMLink
                                class="mm_btn T=line T=dark"
                                :to="{ name: 'RaffleEnd' }"
                            >
                                <b>종료된 래플 전체보기</b><i class="ico_link" />
                            </MMLink>
                        </div>
                    </div>
                    <!--// 종료된 래플 전체보기 -->
                </template>
                <p
                    v-else
                    class="mm_text-none"
                >
                    <i class="ico_text-none" />등록된 래플이 없습니다
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { raffleRepository } from '$/repository/raffleRepository';
import { Raffle } from '$/@type/raffle';
import { defaultCatch } from "$/functions";
import { usePageTitleSetting } from '$/composables/seoComposable';
import Guide from '@/components/modal/raffle/Guide.vue';
import RaffleItem from '@/pages/raffle/Item.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';

usePageTitleSetting('래플');
        
/** VARIABLE */
// 래플 목록
const raffleList = ref<Raffle[]>([]);
const isCompleteLoading = ref<boolean>(false);

/** FUNCTION */
function guideModalOpen() {
    useModal().open(Guide, {
        title: '래플',
        name: 'RaffleGuide',
        itemClass: 'm_modal-raffle-guide'
    })
}

async function getRaffleList() {
    try {
        raffleList.value = await raffleRepository.getRaffleList();
    } catch (error) {
        defaultCatch(error);
    }
}
/** VUE LIFE CYCLE */
onMounted(async() => {
    await getRaffleList();
    isCompleteLoading.value = true;
});
</script>