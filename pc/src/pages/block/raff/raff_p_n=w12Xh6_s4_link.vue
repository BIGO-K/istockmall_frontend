<template>
    <MMBlock
        :block-name="'raff_p_n=w12Xh6_s4_link'"
        :required="{
            requiredValueList: [block.rafflePartition?.raffleList, block.title1, block.title2]
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <div class="mui_inner">
            <div class="m_raffle">
                <div v-if="topRaffle" class="mui_lside">
                    <RaffleItem
                        :raffle="topRaffle"
                        :raffle-text-type="'state'"
                        :is-show-button="false"
                    >
                        <template #extra_data>
                            <template v-if="isUser && topRaffle.isStart && !topRaffle.isEnd">
                                <button v-if="topRaffle.isEntry && isUser" type="button" class="btn_raffle mm_btn T=disabled">
                                    <b>응모 완료</b>
                                </button>
                                <button
                                    v-else-if="isAvailableDevice"
                                    type="button"
                                    class="btn_raffle"
                                    @click="entryModalOpen()"
                                >
                                    <b>응모하기</b>
                                </button>
                            </template>
                        </template>
                    </RaffleItem>
                </div>
                <div class="mui_rside">
                    <div class="mui_product-list">
                        <ul>
                            <li
                                v-for="raffle in raffleList"
                                :key="raffle.id"
                            >
                                <RaffleItem
                                    :raffle="raffle"
                                    :raffle-text-type="'state'"
                                    :is-show-price="false"
                                    :is-show-sell-rate="false"
                                    :is-show-button="false"
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <MMBlockLink :link="block?.link || ''" :label="'전체보기'" />
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from "$/@type/block"
import MMBlock from "@/components/block/Block.vue";
import { computed, toRefs } from "vue";
import RaffleItem from '@/components/block/special/RaffleItem.vue';
import { Raffle } from "$/@type/raffle";
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'
import { usePageContext } from "$/composables/pageHandler/contextComposable";
import { useRaffleItem } from "$/composables/raffleComposable";
import { mmon } from "$/helper/mmon";
import { useIdentityVerification } from "$/composables/auth/certificateComposable";
import { certificateRepository } from "$/repository/auth/certificateRepository";
import { useRefreshUser } from "$/composables/auth/userComposable";
import { defaultCatch } from "$/functions";
import { useModal } from "$/composables/pageHandler/modalComposable";
import { raffleRepository } from "$/repository/raffleRepository";
import Entry from '@/components/modal/raffle/Entry.vue';

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props);
const { 
    user: userAuthInfo,
    isUser, 
    router, 
    route 
} = usePageContext();

/** VARIABLE */
// 최상단 래플
const topRaffle = computed<Raffle|null>(() => {
    return block.value?.rafflePartition?.raffleList[0] || null
});

// 래플 리스트
const raffleList = computed<Raffle[]>(() => {
    return block.value?.rafflePartition?.raffleList.slice().splice(1) || []
});
// 사용가능 디바이스 여부
const { isAvailableDevice } = useRaffleItem(topRaffle.value);
/** // VARIABLE */

/**
 * 응모하기 모달 open
 */
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
            if (topRaffle.value == null) {
                return;
            }
            
            const userInfo = await raffleRepository.userInfoForEntry(topRaffle.value.id);
            return {
                raffleId: topRaffle.value.id,
                userInfo
            }
        },
        onClose: (isRaffleEntry) => {
            if (isRaffleEntry && topRaffle.value) {
                topRaffle.value.isEntry = true;
            }
        } 
    });
}
</script>
<style>
    @import "@publish/css/block/specific/raff_p_n=w12Xh6_s4_link.css";
</style>