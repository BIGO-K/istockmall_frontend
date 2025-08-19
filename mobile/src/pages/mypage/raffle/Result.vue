<template>
    <template
        v-if="raffle.progressStatus === '추첨완료'
            || (new Date(raffle.announceAt) <= nowDate 
                && new Date(raffle.buyStartAt) <= nowDate
                && raffle.progressStatus === '')"
    >
        <!-- 당첨자 -->
        <template v-if="raffle.isWinner">
            <h3>
                <strong class="mm_text-primary">{{ name }}님</strong>
                <br>
                <b>래플 당첨을 축하드립니다!</b>
            </h3>
            <dl>
                <dt>구매 가능 기간</dt>
                <dd>
                    {{ MMFilters.formatDate(raffle.buyStartAt, 'MM.DD (ddd) HH:mm', true) }} ~ {{ MMFilters.formatDate(raffle.buyEndAt, 'MM.DD (ddd) HH:mm', true) }}
                </dd>
            </dl>
        </template>

        <!-- 미당첨자 -->
        <template v-else>
            <h3>
                <b>아쉽습니다<br> 다음에 다시 도전해주세요!</b>
            </h3>
        </template>
    </template>

    <!-- 추첨 중 -->
    <template v-else-if="raffle.progressStatus === '추첨중'">
        <h3>
            <b>당첨자 추첨중입니다..</b>
        </h3>
        <p>조금만 기다려주세요!</p>
    </template>

    <div class="mm_product-item T=single-sm">
        <figure>
            <i v-lazyload="{ src: raffle.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
            <figcaption>
                <p class="text_brand">
                    {{ raffle.goods.brandName }}
                </p>
                <p class="text_product">
                    {{ raffle.goods.name }}
                </p>
            </figcaption>
        </figure>
    </div>

    <div v-if="raffle.progressStatus === '추첨완료' && raffle.isWinner" class="mm_btn_box">
        <MMLink
            :to="availableForPurchase ? { name: 'RaffleDetail', params: { id: raffle.id } } : {}"
            class="mm_btn T=primary"
            @click="beforePurchaseAlert"
        >
            <b>구매하러 가기</b>
        </MMLink>
    </div>
</template>

<script setup lang="ts">
import { toRefs, computed } from 'vue';
import { RaffleEntry } from '$/@type/raffleEntry';
import { mmon } from '$/helper/mmon';
import MMLink from '@/components/MMLink.vue';
import { formatDate } from '$/filters';
import { useUserState } from '$/composables/auth/userComposable';
import { ModalCloseHandler } from '$/@type/Modal';
    
const props = defineProps<{
    raffle: RaffleEntry
    closer: ModalCloseHandler<void>
}>();

const { user } = useUserState();
const { raffle } = toRefs(props);

const name = computed<string>(() => user.value?.name || '');
const nowDate = new Date();
const availableForPurchase = computed<boolean>(() => {
    return nowDate > new Date(raffle.value.buyStartAt) 
        && nowDate < new Date(raffle.value.buyEndAt)
});
    
function beforePurchaseAlert() {
    if (!availableForPurchase.value) {
        mmon.bom.alert(`구매 가능한 기간이 아닙니다.<br>(구매 기간: ${formatDate(raffle.value.buyStartAt, 'YYYY-MM-DD HH:mm')} - ${formatDate(raffle.value.buyEndAt, 'YYYY-MM-DD HH:mm')})`);
    }
}

</script>