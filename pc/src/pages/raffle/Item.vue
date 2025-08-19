<template>
    <div class="mm_product-item T=pa">
        <MMLink 
            :to="
                raffle.goods.isOnlyAdult && needCertificateAge
                    ? { name: pathCertificate, query: { redirect_to_after: `/raffle/detail/${raffle.id}`, is_need_adult_certification: 'Y' } }
                    : { name: 'RaffleDetail', params: { id: raffle.id } }
            "   
        >
            <figure>
                <div class="mm_image-scale">
                    <i
                        v-lazyload="{ src: raffle.goods.thumbnailUrl }"
                        class="mm_bg-cover image_product"
                    />
                </div>
                <p v-if="raffle.goods.isOnlyAdult && needCertificateAge" class="text_adult">
                    <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
                </p>
                <p class="text_raffle">
                    <strong v-html="timerHtml" />
                    <b v-html="statusHtml" />
                </p>
                <figcaption>
                    <p
                        class="text_brand"
                        v-text="raffle.goods.brandName"
                    />
                    <p
                        class="text_product"
                        v-text="raffle.goods.name"
                    />
                    <p
                        class="text_sale"
                        v-text="`${raffle.goods.saleRate}%`"
                    />
                    <p class="text_price">
                        <strong v-text="MMFilters.formatNumber(raffle.goods.baseDiscountedPrice)" />
                        <del v-if="raffle.goods.saleRate > 0" v-text="MMFilters.formatNumber(raffle.goods.price)" />
                    </p>
                </figcaption>
            </figure>
        </MMLink>
        <div class="mm_btn_box">
            <template v-if="raffle.isEnd">
                <template v-if="raffle.isBuyEnd">
                    <a class="mm_btn T=sm"><b>래플 종료</b></a>
                    <a
                        class="btn_winner"
                        href="javascript:;"
                        @click="winnersModalOpen()"
                    ><b>당첨자 보기</b><i class="ico_link T=sm" /></a>
                </template>
                <template v-else>
                    <b
                        v-if="!raffle.isConfirmedWinner || !raffle.isNotice"
                        class="mm_btn T=sm T=line T=dark"
                        v-text="noticeLabel"
                    />
                    <a
                        v-else
                        class="mm_btn T=sm T=primary"
                        href="javascript:;"
                        @click="winningResultModalOpen()"
                    ><b>당첨 결과 확인하기</b></a>
                </template>
            </template>
            <template v-else>
                <template v-if="raffle.isStart">
                    <a
                        v-if="raffle.isEntry"
                        class="mm_btn T=sm"
                    ><b>응모 완료</b></a>
                    <a
                        v-else-if="isAvailableDevice"
                        class="mm_btn T=sm T=primary"
                        href="javascript:;"
                        @click="entryModalOpen()"
                    ><b>응모하기</b></a>
                    <b
                        v-else
                        class="mm_btn T=sm T=line T=dark"
                        v-text="availableDeviceLabel"
                    />
                </template>
                <template v-else>
                    <b class="mm_btn T=sm T=line T=dark">진행 예정</b>                                    
                </template>
            </template>
        </div>
    </div>
</template>


<script setup lang='ts'>
import { toRefs } from 'vue';
import { Raffle } from '$/@type/raffle';
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { certificateRepository } from '$/repository/auth/certificateRepository';
import { useRefreshUser } from '$/composables/auth/userComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { raffleRepository } from '$/repository/raffleRepository';
import Entry from '@/components/modal/raffle/Entry.vue';
import WinningResult from '@/components/modal/raffle/WinningResult.vue';
import Winners from '@/components/modal/raffle/Winners.vue';
import { useRaffleItem } from '$/composables/raffleComposable';


const props = defineProps<{
    raffle: Raffle
}>();

const emit = defineEmits<{
    (e: 'refetch'): void,
}>();

const {
    user: userAuthInfo, 
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
    timerHtml
} = useRaffleItem(props.raffle, { isPc: true });

/** VARIABLE */
const { raffle } = toRefs(props);
const pathCertificate = isUser.value ? 'AdultCertification' : 'Login';
/** // VARIABLE */

/** FUNCTION */
function entryModalOpen() {
    if (!isUser.value) {
        return mmon.bom.confirm('로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?',
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

    if (userAuthInfo.value && !userAuthInfo.value.isCertificated) {
        return mmon.bom.confirm('본인인증 완료 후 응모 가능합니다.\n본인인증을 진행하시겠습니까?',
            async (flag: boolean) => {
                if (!flag) return;

                try {
                    const { identityProfile } = await useIdentityVerification('width=643px, height=593px, resizble=no, scrollbars=yes', false);
                    await certificateRepository.certificateConfirmUser(identityProfile.token);
                    await useRefreshUser();
                } catch (e) {
                    defaultCatch(e);
                }
            }
        )
    }

    useModal().open(Entry, {
        title: '응모하기',
        name: 'RaffleEntry',
        itemClass: 'm_modal-raffle-entry',
        props: async() => {                    
            const userInfo = await raffleRepository.userInfoForEntry(raffle.value.id);
            return {
                raffleId: raffle.value.id,
                userInfo
            }
        },
        onClose: () => {
            emit('refetch')
        }
    });
}
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
            props: {         
                raffle: raffle.value,
                winningResult
            }
        });
    } catch (error) {
        defaultCatch(error);
    }
}

async function winnersModalOpen() {
    try {
        const winners = await raffleRepository.getWinners(raffle.value.id);
        useModal().open(Winners, {
            title: '당첨자 보기',
            itemClass: 'm_modal-raffle-winner',
            name: 'Winner',
            props: {
                winners
            }
        });
    } catch(e) {
        defaultCatch(e);
    }
}
/** // FUNCTION */
</script>