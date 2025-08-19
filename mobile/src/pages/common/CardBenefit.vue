<template>
    <ModalPopup>    
        <template #headerTitle>
            <h1><b>카드사별 혜택</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <p v-if="cardBenefits == null" class="mm_text-none T=sm">
                            <i class="ico_text-none" />등록된 할부 정보가 없습니다
                        </p>    
                        <div v-else class="m_popup-card">
                            <!-- 무이자할부안내 -->
                            <section v-if="cardBenefits.interestFreeList.length > 0">
                                <h3 class="mm_strapline">
                                    <b>무이자 할부 안내</b>
                                </h3>
                                <ul>
                                    <li
                                        v-for="freeInstant in cardBenefits.interestFreeList" 
                                        :key="`${freeInstant.imageUrl}_${freeInstant.info}`"
                                    >
                                        <i
                                            v-lazyload="{ src: freeInstant.imageUrl, useErrorImage: false }"  
                                            class="mm_bg-contain image_card"
                                            :title="freeInstant.imageAlt"
                                        />
                                        <p v-html="MMFilters.nlToBr(freeInstant.info)" />
                                        <span>{{ MMFilters.formatDate(cardBenefits.startAt, 'YYYY.MM.DD') }} ~ {{ MMFilters.formatDate(cardBenefits.endAt, 'YYYY.MM.DD') }}</span>
                                    </li>         
                                </ul>
                            </section>
                            <!--// 무이자할부안내 -->

                            <!-- 부분무이자할부안내 -->
                            <section v-if="cardBenefits.partialInterestList.length > 0">
                                <h3 class="mm_strapline">
                                    <b>부분 무이자 할부 안내</b>
                                </h3>
                                <ul>
                                    <li 
                                        v-for="partialInterest in cardBenefits.partialInterestList"
                                        :key="`${partialInterest.imageUrl}_${partialInterest.info}`"
                                    >
                                        <i
                                            v-lazyload="{ src: partialInterest.imageUrl }"  
                                            class="mm_bg-contain image_card"
                                        />
                                        <p v-html="MMFilters.nlToBr(partialInterest.info)" />
                                        <span>{{ MMFilters.formatDate(cardBenefits.startAt, 'YYYY.MM.DD') }} ~ {{ MMFilters.formatDate(cardBenefits.endAt, 'YYYY.MM.DD') }}</span>
                                    </li>
                                </ul>
                            </section>
                            <!--// 부분무이자할부안내 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CardInstallMentInfo } from '$/@type/exhibit';
import { defaultCatch } from '$/functions';
import { exhibitRepository } from '$/repository/exhibitRepository';
import ModalPopup from '@/components/layout/ModalPopup.vue';

const cardBenefits = ref<CardInstallMentInfo|null>({
    title: '',
    interestFreeList: [],
    partialInterestList: [],
    startAt: '',
    endAt: ''
});

onMounted(async() => {
    try {
        cardBenefits.value = await exhibitRepository.cardBenefit();
    } catch (e) {
        defaultCatch(e);
    }
})
</script>
