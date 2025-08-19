<template>
    <div class="m_modal-myraffle-result">
        <template v-if="!winningResult">
            <!-- 추첨 진행중 -->
            <h3><b>당첨자 추첨중입니다..</b></h3><p>조금만 기다려주세요!</p>
        </template>
        <template v-else>
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
            <dl>
                <dt>구매 가능 기간</dt><dd>{{ buyPeriodLabel }}</dd>
            </dl>
        </template>      
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
import { computed, onBeforeMount, ref } from 'vue';
import { EntryResult } from '$/@type/raffle';
import moment from 'moment';
import { formatDate } from '$/filters';
import { mmon } from '$/helper/mmon';
import { useUserState } from '$/composables/auth/userComposable';
import { ModalCloseHandler } from '$/@type/Modal';
import { RaffleEntry } from '$/@type/raffleEntry';
import { raffleRepository } from '$/repository/raffleRepository';

const props = defineProps<{
    raffle: RaffleEntry,
    closer: ModalCloseHandler<void>
}>();

const { user: userInfo } = useUserState();
const winningResult = ref<EntryResult|undefined>();

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

onBeforeMount(async() => {
    try {
        winningResult.value = await raffleRepository.winningResult(props.raffle.id);
    } catch(e) {

    }
});

</script>