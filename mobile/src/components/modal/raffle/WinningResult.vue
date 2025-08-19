<!-- @format -->

<template>
    <template v-if="!raffle.isConfirmedWinner">
        <h3>
            <b>당첨자 추첨중입니다..</b>
        </h3>
        <p>조금만 기다려주세요!</p>
    </template>

    <template v-else>
        <template v-if="!winningResult.isEntry">
            <h3><b>래플 응모내역이 없습니다</b></h3>
            <p>래플 응모해보세요!</p>
        </template>

        <template v-else-if="winningResult.isWinner">
            <h3>
                <strong class="mm_text-primary">{{ userInfo?.name }}님</strong>
                <br>
                <b>당첨을 축하드립니다!</b>
            </h3>
            <dl>
                <dt>구매 가능 기간</dt>
                <dd>{{ buyPeriodLabel }}</dd>
            </dl>
        </template>

        <h3 v-else>
            <b>
                아쉬워요
                <br>
                다음에 다시 도전해주세요
            </b>
        </h3>
    </template>

    <div class="mm_product-item T=single-sm">
        <figure>
            <i
                v-lazyload="{ src: raffle.goods.thumbnailUrl }"
                class="mm_bg-cover image_product"
            />
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
    <div v-if="winningResult.isWinner" class="mm_btn_box">
        <a
            class="mm_btn T=primary"
            @click="() => {
                if (isBuyAt) {
                    return $router.push({
                        name: 'RaffleDetail',
                        params : {
                            id: raffle.id
                        }
                    })
                }
                mmon.bom.alert(`구매 가능한 기간이 아닙니다. \n(구매기간 : ${buyPeriodLabel})`)
            }"
        >
            <b>구매하러 가기</b>
        </a>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { EntryResult, Raffle } from "$/@type/raffle";
import moment from 'moment';
import { mmon } from '$/helper/mmon';
import { formatDate } from "$/filters";
import { useUserState } from '$/composables/auth/userComposable';
import { ModalCloseHandler } from "$/@type/Modal";

/** VARIABLE */
const props = defineProps<{
    raffle: Raffle,
    winningResult: EntryResult,
    closer: ModalCloseHandler<void>
}>();

const { user: userInfo } = useUserState();

const isBuyAt = computed<boolean>(()=> {
    return moment().diff(props.raffle.buyStartAt, 'seconds') > 0;
});

const buyPeriodLabel = computed(()=> {
    return `${formatDate(props.raffle.buyStartAt, "MM.DD (ddd) HH:mm", true)} 
            ~ ${formatDate(props.raffle.buyEndAt, "MM.DD (ddd) HH:mm", true)}`;
})
/** // VARIABLE */
</script>
