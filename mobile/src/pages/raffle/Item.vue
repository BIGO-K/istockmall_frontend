<template>
    <div class="mm_product-item">
        <MMLink
            :to="
                raffle.goods.isOnlyAdult && needCertificateAge
                    ? { name: pathCertificate, query: { redirect_to_after: `/raffle/detail/${raffle.id}`, is_need_adult_certification: 'Y' } }
                    : { name: 'RaffleDetail', params: { id: raffle.id } }
            "                
        >
            <figure>
                <i v-lazyload="{ src: raffle.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                <p v-if="raffle.goods.isOnlyAdult && needCertificateAge" class="text_adult">
                    <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
                </p>
                <p class="text_raffle">
                    <strong v-html="timerHtml" />
                    <b v-html="statusHtml" />
                </p>
                <figcaption>
                    <p class="text_brand" v-text="raffle.goods.brandName" />
                    <p class="text_product" v-text="raffle.goods.name" />
                    <p class="text_sale" v-text="`${raffle.goods.saleRate}%`" />
                    <p class="text_price">
                        <strong v-text="MMFilters.formatNumber(raffle.goods.baseDiscountedPrice)" />
                        <del v-if="raffle.goods.saleRate > 0"><span v-text="MMFilters.formatNumber(raffle.goods.price)" /></del>
                    </p>
                </figcaption>
            </figure>
        </MMLink>
        <div class="mm_btn_box">
            <template v-if="raffle.isEnd">
                <template v-if="raffle.isBuyEnd">
                    <a class="mm_btn T=disabled"><b>래플 종료</b></a>
                    <a
                        class="mm_btn T=primary"
                        href="#RAFFLE_WINNERS"
                        @click="(e) => {
                            if (!raffle.isConfirmedWinner) {
                                e.preventDefault();
                                mmon.bom.alert('해당 래플의 당첨자가 추첨되지 않았습니다.');
                            }
                            setRaffleId(raffle.id);
                        }"
                    >
                        <b>당첨자 보기</b>
                    </a>
                </template>
                <template v-else>
                    <b
                        v-if="!raffle.isConfirmedWinner || !raffle.isNotice"
                        class="mm_btn T=line"
                        v-text="noticeLabel"
                    />
                    <a
                        v-else
                        class="mm_btn T=primary"
                        @click="winningResultModalOpen()"
                    ><b>당첨 결과 확인하기</b></a>
                </template>
            </template>
            <template v-else>
                <template v-if="raffle.isStart">
                    <a
                        v-if="raffle.isEntry"
                        class="mm_btn"
                    ><b>응모 완료</b></a>
                    <a
                        v-else-if="isAvailableDevice"
                        class="mm_btn T=primary"
                        @click="entryPopupOpen()"
                    >
                        <b>응모하기</b>
                    </a>
                    <b
                        v-else
                        class="mm_btn T=line"
                        v-text="availableDeviceLabel"
                    />
                </template>
                <template v-else>
                    <b class="mm_btn T=line T=dark">진행 예정</b>                                    
                </template>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { Raffle } from '$/@type/raffle';
import { useRaffleEntryModalPopup, useRaffleItem, useRaffleModal } from '$/composables/raffleComposable';
import { mmon } from '$/helper/mmon';
import { defaultCatch } from '$/functions';
import { raffleRepository } from '$/repository/raffleRepository';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useModal } from '$/composables/pageHandler/modalComposable';
import WinningResult from '@/components/modal/raffle/WinningResult.vue';

const props = defineProps<{
    raffle: Raffle
}>();

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
    timerHtml,
} = useRaffleItem(props.raffle);

// 래플 모달
const { 
    setRaffleId,
} = useRaffleModal();

const { entryPopupOpen } = useRaffleEntryModalPopup(
    props.raffle.id, 
    () => {
        raffle.value.isEntry = true
    }
)

/** VARIABLE */
const { raffle } = toRefs(props);
const pathCertificate = isUser.value ? 'AdultCertification' : 'Login'
/** //VARIABLE */

/** FUNCTION */
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