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
                <div class="mui_image-scale">
                    <i 
                        v-lazyload="{ src: raffle.goods.thumbnailUrl }" 
                        class="mui_bg-cover image_product"
                    />
                </div>
                <p v-if="raffle.goods.isOnlyAdult && needCertificateAge" class="text_adult">
                    <b class="mui_ir-blind">미성년자 구매불가</b><i class="uico_adult" />
                </p>
                <p v-if="raffleTextType === 'raffle'" class="text_raffle">
                    <MMTimer v-if="isShowTimer" :target-at="targetAt" :is-end="raffle.isEnd" @onTimer="changeIsStart" />
                    <b v-html="statusText" />
                </p>
                <figcaption>
                    <p v-if="raffleTextType === 'state'" class="text_state">
                        <MMTimer v-if="isShowTimer" :target-at="targetAt" :is-end="raffle.isEnd" :tag-name="'b'" @onTimer="changeIsStart" />
                        <strong v-html="statusText" />
                    </p>
                    <p class="text_brand">
                        {{ raffle.goods.brandName }}
                    </p>
                    <p class="text_product">
                        {{ raffle.goods.name }}
                    </p>
                    <p v-if="isShowSellRate" class="text_sale">
                        {{ `${raffle.goods.saleRate}%` }}
                    </p>
                    <p v-if="isShowPrice" class="text_price">
                        <strong v-text="MMFilters.formatNumber(raffle.goods.baseDiscountedPrice)" />
                        <del v-if="raffle.goods.saleRate > 0" v-text="MMFilters.formatNumber(raffle.goods.price)" />
                    </p>
                </figcaption>
            </figure>
        </MMLink>
        <div v-if="isShowButton" class="mui_btn_box">
            <template v-if="raffle.isEnd">
                <template v-if="raffle.isBuyEnd">
                    <a class="btn_raffle T=end"><b>래플 종료</b></a>
                    <a
                        class="btn_winner"
                        href="javascript:;"
                        @click="winnersModalOpen()"
                    >
                        <b>당첨자 보기</b><i class="uico_link" />
                    </a>
                </template>
                <template v-else>
                    <b
                        v-if="!raffle.isConfirmedWinner"
                        class="btn_raffle"
                        v-text="isNoticeLabel"
                    />
                    <a
                        v-else
                        class="btn_raffle T=result"
                        href="#"
                        @click.prevent="winningResultModalOpen()"
                    >
                        <b>당첨 결과 확인하기</b>
                    </a>
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
                        href="#"
                        @click.prevent="entryModalOpen()"
                    ><b>응모하기</b></a>
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
import { useIdentityVerification } from '$/composables/auth/certificateComposable';
import { formatDate } from '$/filters';
import { certificateRepository } from '$/repository/auth/certificateRepository';
import MMTimer from "@/components/block/special/Timer.vue";
import moment from 'moment';
import { useRefreshUser } from '$/composables/auth/userComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { defaultCatch } from '$/functions';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { raffleRepository } from '$/repository/raffleRepository';
import Entry from '@/components/modal/raffle/Entry.vue';
import WinningResult from '@/components/modal/raffle/WinningResult.vue';
import Winners from '@/components/modal/raffle/Winners.vue';
import { AVAILABLE_RAFFLE_DEVICE } from '$/constants';

const props = withDefaults(defineProps<{
    raffle: Raffle,
    isShowPrice?: boolean,
    isShowSellRate?: boolean,
    isShowButton?: boolean,
    isShowTimer?: boolean,
    raffleTextType?: 'raffle'|'state'
}>(), {
    isShowPrice: true,
    isShowSellRate: true,
    isShowButton: true,
    isShowTimer: true,
    raffleTextType: 'raffle'
})

const { 
    user : userAuthInfo, 
    isUser,
    router,
    route,
    needCertificateAge,
    mmon,
} = usePageContext();

const pathCertificate = computed(() => {
    return isUser.value ? 'AdultCertification' : 'Login'
})

// 래플정보
const { raffle } = toRefs(props);
const statusText = computed<string>(() => {
    if (!raffle.value.isStart) {
        return `<span>Coming soon</span>`;
    }
    if (raffle.value.isEnd) {
        return `<span>${raffle.value.totalEntryCount}</span>명 참여`;
    } 
    
    return `<span>${raffle.value.totalEntryCount}</span>명 참여중`;
});
const targetAt = computed(() => {
    return raffle.value.isStart ? raffle.value.endAt: raffle.value.startAt;
});
const isNoticeLabel = computed(() => {
    return moment().diff(raffle.value.noticeAt, 'seconds') > 0 
        ? `당첨자 추첨 진행중` 
        : `${formatDate(raffle.value.noticeAt, 'MM.DD(ddd) HH시 mm분', true)} 당첨자 발표 예정`;
});

// 디바이스 이용 가능 여부
const isAvailableDevice = computed(() => {
    return raffle.value.availableDeviceList.find(device => device === 'PC');
});

// 이용 가능 디바이스 안내 문구 라벨 반환(WEB 제외)
const availableDeviceLabel = computed(() => {
    const deviceList = raffle.value.availableDeviceList.filter(
        (device) => {
            return device !== "PC";
        }
    );

    // 이용 가능 디바이스가 한개일 경우
    if (deviceList.length === 1) {
        return `${AVAILABLE_RAFFLE_DEVICE[deviceList[0]]}에서만 응모 가능`;
    }

    // 그 외
    return `모바일에서만 응모 가능`;
});

/**
 * 래플시작여부 변경
 * @param diffInMilliSecond 
 */
function changeIsStart(diffInMilliSecond: number) {
    if (diffInMilliSecond > 999 || raffle.value.isStart === true) {
        return;
    }
    // 남은 시간이 0.5초 미만일 경우 진행 예정 -> 진행중으로 정보 변경 및 타이머 재시작
    raffle.value.isStart = true;
}

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
            raffle.value.isEntry = true;
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
            name: 'WinningResult',
            props:{        
                winners
            }
        });
    } catch(e) {
        defaultCatch(e);
    }           
}
</script>