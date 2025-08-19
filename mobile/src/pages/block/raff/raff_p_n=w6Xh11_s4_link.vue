<template>
    <MMBlock
        :block-name="'raff_p_n=w6Xh11_s4_link'"
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
                <RaffleItem
                    v-if="topRaffle"
                    :raffle="topRaffle"
                    :raffle-text-type="'state'"
                    :is-show="['price','sellRate','timer','goodsInfo']"
                >
                    <template #extra_data>
                        <template v-if="isUser && topRaffle.isStart && !topRaffle.isEnd">
                            <button v-if="topRaffle.isEntry && isUser" type="button" class="btn_raffle mm_btn T=disabled">
                                <b>응모 완료</b>
                            </button>
                            <button
                                v-else-if="isAvailableDevice"
                                class="btn_raffle"
                                @click="entryPopupOpen()"
                            >
                                <b>응모하기</b>
                            </button>
                        </template>
                    </template>
                </RaffleItem>
                <div class="mui_product-list">
                    <ul>
                        <li
                            v-for="raffle in raffleList"
                            :key="raffle.id"
                        >
                            <RaffleItem
                                :raffle="raffle"
                                :raffle-text-type="'state'"
                                :is-show="['price','sellRate']"
                            />
                        </li>
                    </ul>
                </div>
            </div>
            <MMBlockLink :link="block.link || ''" :label="'전체보기'" />
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from "$/@type/block"
import MMBlock from "@/components/block/Block.vue";
import MMTitle from '@/components/block/Title.vue'
import { computed, toRefs } from "vue";
import RaffleItem from '@/components/block/special/RaffleItem.vue';
import { Raffle } from "$/@type/raffle";
import MMBlockLink from '@/components/block/Link.vue'
import { useRaffleEntryModalPopup, useRaffleItem } from "$/composables/raffleComposable";
import { usePageContext } from "$/composables/pageHandler/contextComposable";

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props);
const { isUser } = usePageContext();
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
// 응모하기 모달팝업
const { entryPopupOpen } = useRaffleEntryModalPopup(topRaffle.value?.id || null, () => {
    if (!topRaffle.value) {
        return;
    }
    topRaffle.value.isEntry = true;
})

</script>
<style>
    @import "@publish/css/block/feature/raff_p_n=w6Xh11_s4_link.css";
</style>