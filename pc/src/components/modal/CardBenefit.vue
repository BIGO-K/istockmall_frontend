<template>
    <p
        v-if="cardBenefits == null"
        class="mm_text-none T=sm"
    >
        <i class="ico_text-none" />등록된 할부 정보가 없습니다
    </p>    
    <div
        v-else
        class="m_modal-card"
    >
        <!-- 무이자할부안내 -->
        <section v-if="cardBenefits.interestFreeList.length > 0">
            <h3><b>무이자 할부 안내</b></h3>
            <ul>
                <li
                    v-for="freeInstant in cardBenefits.interestFreeList"
                    :key="freeInstant.info"
                >
                    <i
                        v-lazyload="{ src: freeInstant.imageUrl }"  
                        class="mm_bg-contain image_card"
                    />
                    <p v-html="MMFilters.nlToBr(freeInstant.info)" />
                    <span>{{ MMFilters.formatDate(cardBenefits.startAt, 'YYYY.MM.DD') }} ~ {{ MMFilters.formatDate(cardBenefits.endAt, 'YYYY.MM.DD') }}</span>
                </li>                                    
            </ul>
        </section>
        <!--// 무이자할부안내 -->
        <!-- 부분무이자할부안내 -->
        <section v-if="cardBenefits.partialInterestList.length > 0">
            <h3><b>부분 무이자 할부 안내</b></h3>
            <ul>
                <li 
                    v-for="partialInterest in cardBenefits.partialInterestList" 
                    :key="partialInterest.info"
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
</template>


<script setup lang='ts'>
import { CardInstallMentInfo } from '$/@type/exhibit';
import { ModalCloseHandler } from '$/@type/Modal';

/** VARIABLE */

defineProps<{
    cardBenefits: CardInstallMentInfo | null,
    closer: ModalCloseHandler<void>
}>();

/** FUNCTION */

/** VUE LIFE CYCLE */

</script>
