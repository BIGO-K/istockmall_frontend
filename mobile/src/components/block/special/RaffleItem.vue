<template>
    <div class="mui_product-item">
        <MMLink 
            :to="
                raffle.goods.isOnlyAdult && needCertificateAge
                    ? { name: pathCertificate, query: { redirect_to_after: `/raffle/detail/${raffle.id}`, is_need_adult_certification: 'Y' } }
                    : { name: 'RaffleDetail', params: { id: raffle.id } }
            "   
        >
            <figure>
                <i v-lazyload="{ src: raffle.goods.thumbnailUrl }" class="mui_bg-cover image_product" />
                <p v-if="raffle.goods.isOnlyAdult && needCertificateAge" class="text_adult">
                    <b class="mui_ir-blind">미성년자 구매불가</b><i class="uico_adult" />
                </p>
                <p v-if="raffleTextType === 'raffle'" class="text_raffle">
                    <MMTimer v-if="isShowTimer" :target-at="targetAt" :is-end="raffle.isEnd" @onTimer="changeIsStart" />
                    <b v-html="statusHtml" />
                </p>
                <figcaption>
                    <p v-if="raffleTextType === 'state'" class="text_state">
                        <MMTimer v-if="isShowTimer" :target-at="targetAt" :is-end="raffle.isEnd" :tag-name="'b'" @onTimer="changeIsStart" />
                        <strong v-html="statusHtml" />
                    </p>
                    <template v-if="isShowGoodsInfo">
                        <p class="text_brand" v-text="raffle.goods.brandName" />
                        <p class="text_product" v-text="raffle.goods.name" />
                        <p v-if="isShowSellRate" class="text_sale" v-text="`${raffle.goods.saleRate}%`" />
                        <p v-if="isShowPrice" class="text_price">
                            <strong v-text="MMFilters.formatNumber(raffle.goods.baseDiscountedPrice)" />
                            <del v-if="raffle.goods.saleRate > 0"><span v-text="MMFilters.formatNumber(raffle.goods.price)" /></del>
                        </p>
                    </template>
                </figcaption>
            </figure>
        </MMLink>
        <div v-if="isShowButton" class="mui_btn_box">
            <template v-if="raffle.isEnd">
                <template v-if="raffle.isBuyEnd">
                    <a class="btn_raffle T=end"><b>래플 종료</b></a>
                    <a
                        class="btn_winner"
                        href="#RAFFLE_WINNERS"
                        @click="openWinnersModal"
                    >
                        <b>당첨자 보기</b>
                    </a>
                </template>
                <template v-else>
                    <b
                        v-if="!raffle.isConfirmedWinner"
                        class="btn_raffle"
                        v-text="noticeLabel"
                    />
                    <a
                        v-else
                        class="btn_raffle T=result"
                        @click="winningResultModalOpen()"
                    ><b>당첨 결과 확인하기</b></a>
                </template>
            </template>
            <template v-else>
                <template v-if="raffle.isStart">
                    <a
                        v-if="raffle.isEntry && isUser"
                        class="btn_raffle T=end"
                    ><b>응모 완료</b></a>
                    <a
                        v-else-if="isAvailableDevice"
                        class="btn_raffle"
                        @click="entryPopupOpen()"
                    >
                        <b>응모하기</b>
                    </a>
                    <b
                        v-else
                        class="btn_raffle"
                        v-text="availableDeviceLabel"
                    />
                </template>
                <template v-else>
                    <b class="btn_raffle">진행 예정</b>                                    
                </template>
            </template>
        </div>
        <slot name="extra_data" />
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { Raffle } from '$/@type/raffle';
import { useRaffleEntryModalPopup, useRaffleItem, useRaffleModal } from '$/composables/raffleComposable';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import MMTimer from "@/components/block/special/Timer.vue";
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { raffleRepository } from '$/repository/raffleRepository';
import WinningResult from '@/components/modal/raffle/WinningResult.vue';

const props = withDefaults(defineProps<{
    raffle: Raffle
    isShow: ('price'|'sellRate'|'button'|'timer'|'goodsInfo')[]
    raffleTextType?: 'raffle'|'state'
}>(), {
    isShow: () => [],
    raffleTextType: 'raffle'
});

const {
    isUser, 
    needCertificateAge,
    route,
    router
} = usePageContext();

const {
    statusHtml,
    noticeLabel,
    isAvailableDevice,
    availableDeviceLabel,
    targetAt,
} = useRaffleItem(props.raffle, { useNoTimer: true });

const { 
    setRaffleId,
} = useRaffleModal();


/** VARIABLE */
const { raffle, isShow,  raffleTextType } = toRefs(props)
const pathCertificate = computed(() => isUser.value ? 'AdultCertification' : 'Login')
// 노출여부
const isShowPrice = computed<boolean>(() => isShow.value.includes('price'));
const isShowSellRate = computed<boolean>(() => isShow.value.includes('sellRate'));
const isShowButton = computed<boolean>(() => isShow.value.includes('button'));
const isShowTimer = computed<boolean>(() => isShow.value.includes('timer'));
const isShowGoodsInfo = computed<boolean>(() => isShow.value.includes('goodsInfo'));

// 응모 모달팝업
const { entryPopupOpen } = useRaffleEntryModalPopup(
    props.raffle.id, 
    () => { raffle.value.isEntry = true },
    { preventHashChange: !isShowButton.value }
)

/** // VARIABLE */

/** FUNCTION */
/**
 * 래플시작여부 변경
 * @param diffInMilliSecond 
 */
function changeIsStart(diffInMilliSecond: number) {
    if (diffInMilliSecond > 999 || raffle.value.isStart !== false) {
        return;
    }
           
    // 남은 시간이 0.5초 미만일 경우 진행 예정 -> 진행중으로 정보 변경 및 타이머 재시작
    raffle.value.isStart = true;
}

/**
 * 당첨자 리스트 모달
 * @param e 
 */
function openWinnersModal(e: MouseEvent) {
    if (!raffle.value.isConfirmedWinner) {
        e.preventDefault();
        mmon.bom.alert('해당 래플의 당첨자가 추첨되지 않았습니다.');
    }
    setRaffleId(raffle.value.id);
}

/**
 * 당첨자 결과 확인 모달
 */
async function winningResultModalOpen() {
    if (!isUser.value) {
        return  mmon.bom.confirm('로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?',
            (flag: boolean) => {
                if (flag) {
                    router.push({
                        name: 'Login',
                        query: {
                            redirect_to_after: route.path
                        }
                    })
                }
            }
        );
    }

    try {   
        const winningResult = await raffleRepository.winningResult(raffle.value.id);
        useModal().open(WinningResult, {
            title: '당첨 결과 확인',
            name: 'WinningResult',
            itemClass: 'm_modal-myraffle-result',
            props: {         
                raffle: raffle.value,
                winningResult
            }
        });
    } catch (error) {
        defaultCatch(error);
    }
}
/** // FUNCTION */
</script>