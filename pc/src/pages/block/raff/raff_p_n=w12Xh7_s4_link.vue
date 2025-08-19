<template>
    <MMBlock
        :block-name="'raff_p_n=w12Xh7_s4_link'"
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
            <div class="mui_product-list">
                <ul>
                    <li
                        v-for="raffle in block.rafflePartition?.raffleList"
                        :key="raffle.id"
                    >
                        <RaffleItem
                            :raffle="raffle"
                        />
                    </li>
                </ul>
            </div>
            <MMBlockLink :link="block.link || ''" :label="'전체보기'" />
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from "$/@type/block"
import MMBlock from "@/components/block/Block.vue";
import { toRefs } from "vue";
import RaffleItem from '@/components/block/special/RaffleItem.vue';
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props);
</script>
<style>
    @import "@publish/css/block/specific/raff_p_n=w12Xh7_s4_link.css";
</style>