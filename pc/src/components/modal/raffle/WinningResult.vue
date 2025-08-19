<template>
    <div class="m_modal-myraffle-result">
        <h3 v-if="!winningResult.isWinner">
            <b>아쉽습니다<br> 다음에 다시 도전해주세요!</b>
        </h3>
        <h3 v-else>
            <b>
                <strong class="mm_text-primary">{{ userInfo?.name }}</strong>님
                <br> 
                래플 당첨을 축하드립니다!
            </b>
        </h3>
        <dl v-if="winningResult.isWinner">
            <dt>구매 가능 기간</dt><dd>{{ buyPeriodLabel }}</dd>
        </dl>   
        <div class="mm_product-item T=single">
            <figure>
                <div class="mm_image-scale">
                    <i
                        v-lazyload="{ src: raffle.goods.thumbnailUrl }"
                        class="mm_bg-cover image_product"
                    />
                </div>
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
        <div
            v-if="winningResult && winningResult.isWinner"
            class="mm_btn_box"
        >
            <a
                class="mm_btn T=primary"
                href="javascript:;"
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
    </div>
</template>


<script setup lang='ts'>
import { computed } from 'vue';
import { EntryResult, Raffle } from '$/@type/raffle';
import moment from 'moment';
import { formatDate } from '$/filters';
import { mmon } from '$/helper/mmon';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
    raffle: Raffle,
    winningResult: EntryResult,
    closer: ModalCloseHandler<void>
}>();

const { user: userInfo } = usePageContext();

/** VARIABLE */

const isBuyAt = computed<boolean>(()=> {
    return moment().diff(props.raffle.buyStartAt, 'seconds') > 0;
});

const buyPeriodLabel = computed(()=> {
    return `${formatDate(props.raffle.buyStartAt, "MM.DD (ddd) HH:mm", true)} ~
            ${formatDate(props.raffle.buyEndAt, "MM.DD (ddd) HH:mm", true)}`;
})
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>