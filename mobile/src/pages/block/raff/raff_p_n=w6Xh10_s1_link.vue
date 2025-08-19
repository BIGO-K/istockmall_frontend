<template>
    <MMBlock
        :block-name="'raff_p_n=w6Xh10_s1_link'"
        :required="{
            requiredValueList: [block.rafflePartition?.raffleList, block.title1, block.title2],
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <template v-if="raffle">
            <div class="mui_inner">
                <RaffleItem
                    :key="raffle.id"
                    :raffle="raffle"
                    :is-show="['price','sellRate','button','timer','goodsInfo']"
                />
                <MMBlockLink :link="block.link || ''" :label="'전체보기'" />
            </div>
        </template>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from "$/@type/block"
import MMBlock from "@/components/block/Block.vue";
import { computed, toRefs } from "vue";
import { Raffle } from "$/@type/raffle";
import RaffleItem from '@/components/block/special/RaffleItem.vue';
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props);
const raffle = computed<Raffle|null>(() => {
    return block.value?.rafflePartition?.raffleList[0] || null;
});
</script>
<style>
    @import "@publish/css/block/feature/raff_p_n=w6Xh10_s1_link.css";
</style>